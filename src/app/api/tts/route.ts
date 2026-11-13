import { NextRequest, NextResponse } from "next/server";
import { guardPaidRoute } from "@/lib/apiGuard";
import { DEFAULT_TTS_VOICE, isAllowedVoice } from "@/lib/ttsVoices";

// Default voice: set GOOGLE_TTS_VOICE in the hosting environment to change it
// without a code edit (any Google Cloud TTS voice name). Learners can override
// it per-browser with the voice picker, limited to the list in ttsVoices.ts.
// Falls back to a widely available Neural2 voice if the chosen voice fails.
const FALLBACK_VOICE = "en-US-Neural2-D";

async function synthesize(text: string, voiceName: string, apiKey: string) {
  return fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: "en-US", name: voiceName },
      audioConfig: { audioEncoding: "MP3", speakingRate: 1.0 },
    }),
  });
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Text-to-speech is not configured." }, { status: 500 });
  }

  const { text, voice, purpose } = await req.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Missing text." }, { status: 400 });
  }
  // The call simulator speaks the merchant's replies (a few sentences each), with
  // its own daily limit and a shorter cap on the text.
  const roleplay = purpose === "roleplay";
  const blocked = await guardPaidRoute(req, roleplay ? "roleplayVoice" : "tts");
  if (blocked) return blocked;

  // Google's synthesize endpoint caps input at 5000 bytes.
  const trimmed = text.slice(0, roleplay ? 1000 : 4800);

  const primaryVoice = isAllowedVoice(voice)
    ? voice
    : process.env.GOOGLE_TTS_VOICE?.trim() || DEFAULT_TTS_VOICE;

  let res = await synthesize(trimmed, primaryVoice, apiKey);
  let usedVoice = primaryVoice;
  let primaryError: string | undefined;
  if (!res.ok) {
    primaryError = (await res.text().catch(() => "")).slice(0, 300);
    console.error("TTS primary voice failed", primaryVoice, res.status, primaryError);
    usedVoice = FALLBACK_VOICE;
    // Chirp3-HD may not be enabled on every project yet - retry with a
    // broadly available voice instead of failing the whole request.
    res = await synthesize(trimmed, FALLBACK_VOICE, apiKey);
  }

  if (!res.ok) {
    const errText = await res.text();
    return NextResponse.json({ error: "Text-to-speech request failed.", detail: errText }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json({ audioContent: data.audioContent as string, voice: usedVoice, requestedVoice: primaryVoice, primaryError });
}
