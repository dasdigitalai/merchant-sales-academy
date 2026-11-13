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

// The call simulator gives each person on the phone their own voice, handed out
// in the order they first speak (whoever answers, then the decision-maker), and
// alternating male/female so two speakers never sound alike. All are on the list above.
export const CALL_VOICES = [
  "en-US-Chirp3-HD-Charon",
  "en-US-Chirp3-HD-Aoede",
  "en-US-Chirp3-HD-Orus",
  "en-US-Chirp3-HD-Kore",
] as const;

export function isAllowedVoice(v: unknown): v is string {
  return typeof v === "string" && TTS_VOICES.some((voice) => voice.id === v);
}
