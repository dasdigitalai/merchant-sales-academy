// Fallback-only: used when the Cloud TTS request fails for any reason (network
// issue, daily limit, misconfiguration). Network voices sound far less robotic
// than the default local SAPI voices most browsers pick first.
const PREFERRED_FALLBACK_VOICE_NAMES = [
  "Google US English",
  "Microsoft Aria Online (Natural) - English (United States)",
  "Microsoft Jenny Online (Natural) - English (United States)",
  "Microsoft Guy Online (Natural) - English (United States)",
  "Google UK English Female",
];

export function pickBestFallbackVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  for (const name of PREFERRED_FALLBACK_VOICE_NAMES) {
    const match = voices.find((v) => v.name === name);
    if (match) return match;
  }
  const anyNetworkEnglish = voices.find((v) => !v.localService && v.lang.startsWith("en"));
  if (anyNetworkEnglish) return anyNetworkEnglish;
  return voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
}
