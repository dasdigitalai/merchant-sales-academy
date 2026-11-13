// Shared by the Virtual Salesperson's pages and routes. Nothing secret in here:
// the playbook it follows lives in lib/playbook.ts, which only the server loads.

import { TTS_VOICES } from "@/lib/ttsVoices";

export const VS_LABEL = "Virtual Salesperson";
export const VS_NAME = "Alex"; // the rep in the course's example calls
// Most cold calls are over well before this; it only stops a model call that runs on.
export const MODEL_CALL_MAX_EXCHANGES = 12;

// The Virtual Salesperson's own voice: the first of these that neither person in
// the scenario already has, so it never sounds like the merchant.
const PREFERENCE = ["Puck", "Orus", "Charon", "Fenrir", "Aoede", "Kore", "Leda", "Zephyr"];
export function vsVoice(taken: readonly string[]): string {
  const ids = PREFERENCE.map((name) => TTS_VOICES.find((v) => v.id.endsWith(`-${name}`))?.id).filter((id): id is NonNullable<typeof id> => !!id);
  return ids.find((id) => !taken.includes(id)) ?? ids[0];
}
