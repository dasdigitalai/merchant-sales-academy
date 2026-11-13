import { NextRequest, NextResponse } from "next/server";
import { guardPaidRoute } from "@/lib/apiGuard";
import { DEFAULT_TTS_VOICE, isAllowedVoice, voiceFallbacks, voiceLanguage } from "@/lib/ttsVoices";

// Default voice: set GOOGLE_TTS_VOICE in the hosting environment to change it
// without a code edit (any Google Cloud TTS voice name). Callers can ask for a
// voice (and accent), limited to the list in ttsVoices.ts. If the chosen voice
// fails, it retries with the same speaker in the US accent, then a Neural2 voice
// of the same gender (voiceFallbacks).

async function synthesize(text: string, voiceName: string, apiKey: string) {
  return fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: voiceLanguage(voiceName), name: voiceName },
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

  // Chirp3-HD (or one accent of it) may not be enabled on every project yet, so
  // retry with the fallbacks instead of failing the whole request.
  const candidates = voiceFallbacks(primaryVoice);
  let res: Response | undefined;
  let usedVoice = primaryVoice;
  let primaryError: string | undefined;
  let lastError = "";
  for (const [i, name] of candidates.entries()) {
    res = await synthesize(trimmed, name, apiKey);
    usedVoice = name;
    if (res.ok) break;
    lastError = (await res.text().catch(() => "")).slice(0, 300);
    if (i === 0) primaryError = lastError;
    console.error("TTS voice failed", name, res.status, lastError);
  }

  if (!res?.ok) {
    return NextResponse.json({ error: "Text-to-speech request failed.", detail: lastError }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json({ audioContent: data.audioContent as string, voice: usedVoice, requestedVoice: primaryVoice, primaryError });
}
