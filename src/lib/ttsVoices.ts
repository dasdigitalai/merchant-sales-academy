// Google Cloud Text-to-Speech voices offered in the read-aloud voice picker.
// The server only accepts voices on this list, so learners can't request
// arbitrary (or more expensive) voices.
export const TTS_VOICES = [
  { id: "en-US-Chirp3-HD-Charon", label: "Charon (male)" },
  { id: "en-US-Chirp3-HD-Puck", label: "Puck (male)" },
  { id: "en-US-Chirp3-HD-Fenrir", label: "Fenrir (male)" },
  { id: "en-US-Chirp3-HD-Orus", label: "Orus (male)" },
  { id: "en-US-Chirp3-HD-Aoede", label: "Aoede (female)" },
  { id: "en-US-Chirp3-HD-Kore", label: "Kore (female)" },
  { id: "en-US-Chirp3-HD-Leda", label: "Leda (female)" },
  { id: "en-US-Chirp3-HD-Zephyr", label: "Zephyr (female)" },
] as const;

export const DEFAULT_TTS_VOICE = "en-US-Chirp3-HD-Charon";

// Accents. Chirp 3 HD speaks English in four regional accents; the voice name
// starts with the one you want (en-GB-Chirp3-HD-Kore is Kore with a British
// accent). Every locale costs the same. There are no other English accents.
export const TTS_LOCALES = ["en-US", "en-GB", "en-AU", "en-IN"] as const;
type Locale = (typeof TTS_LOCALES)[number];
type Speaker = (typeof TTS_VOICES)[number]["id"] extends `en-US-Chirp3-HD-${infer S}` ? S : never;

// Compile-time checked, so a typo in a scenario can't ship.
export type VoiceId = `${Locale}-Chirp3-HD-${Speaker}`;

const SPEAKERS: string[] = TTS_VOICES.map((v) => v.id.slice(v.id.lastIndexOf("-") + 1));
const FEMALE_SPEAKERS = new Set(TTS_VOICES.filter((v) => v.label.includes("(female)")).map((v) => v.id.slice(v.id.lastIndexOf("-") + 1)));

export function isAllowedVoice(v: unknown): v is string {
  if (typeof v !== "string") return false;
  const m = /^(en-[A-Z]{2})-Chirp3-HD-([A-Za-z]+)$/.exec(v);
  return !!m && (TTS_LOCALES as readonly string[]).includes(m[1]) && SPEAKERS.includes(m[2]);
}

// "en-GB-Chirp3-HD-Kore" -> "en-GB"
export const voiceLanguage = (voice: string) => voice.split("-").slice(0, 2).join("-");

// What to try if a voice isn't available: the same speaker with the US accent,
// then a Neural2 voice of the same gender (never a different gender).
export function voiceFallbacks(voice: string): string[] {
  const speaker = voice.slice(voice.lastIndexOf("-") + 1);
  const female = FEMALE_SPEAKERS.has(speaker) || /Neural2-[CEFGH]$/.test(voice);
  return [...new Set([voice, voice.replace(/^en-[A-Z]{2}-/, "en-US-"), female ? "en-US-Neural2-F" : "en-US-Neural2-D"])];
}

// The call simulator's own voices are set per scenario (data/scenarios.ts). These
// are only used for a third person on a call, or a scenario with no voices set,
// handed out in order of speaking and alternating male/female.
export const CALL_VOICES: readonly VoiceId[] = [
  "en-US-Chirp3-HD-Charon",
  "en-US-Chirp3-HD-Aoede",
  "en-US-Chirp3-HD-Orus",
  "en-US-Chirp3-HD-Kore",
];
