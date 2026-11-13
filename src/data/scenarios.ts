// Merchants for Module 12's final scenario call and the call simulator. The rep
// sees the profile. What the simulated merchant knows beyond it lives in
// lib/merchantPersonas.ts, which only the server loads.

import { BRAND, type BrandId } from "@/lib/brand";
import type { VoiceId } from "@/lib/ttsVoices";

export type Scenario = {
  id: string;
  business: string;
  vertical: string;
  answerer: string;
  decisionMaker: string;
  profile: string;
  objection: string;
  // How each person sounds in the call simulator. Pick a voice that matches the
  // character: Charon, Puck, Fenrir, Orus are male; Aoede, Kore, Leda, Zephyr are
  // female. The start of the name sets the accent: en-US (American), en-GB
  // (British), en-AU (Australian) or en-IN (Indian). If the owner answers the
  // phone herself, use the same voice for both.
  voices: { answerer: VoiceId; decisionMaker: VoiceId };
  onlyFor?: BrandId;       // show this merchant only on one brand's site
};

const allScenarios: Scenario[] = [
  {
    id: "lucias-kitchen",
    business: "Lucia’s Kitchen",
    vertical: "Restaurant",
    answerer: "Marcus, the host",
    decisionMaker: "Lucia, the owner",
    profile: "Family-owned Mexican restaurant, one location, about 60 seats. Lucia works the kitchen most days. Their website says they started taking catering orders this year. The lunch rush ends around 1:30, and dinner starts filling up at 5.",
    objection: "We’re happy with who we have.",
    voices: { answerer: "en-US-Chirp3-HD-Charon", decisionMaker: "en-US-Chirp3-HD-Aoede" },
  },
  {
    id: "brightside-dental",
    business: "Brightside Family Dental",
    vertical: "Dental office",
    answerer: "Karen, the office manager",
    decisionMaker: "Dr. Ellen Moss, the owner",
    profile: "Two dentists. Karen runs the front desk, billing and vendor calls. Patients pay copays and balances at checkout, and the practice uses dental practice-management software for scheduling and billing. The front desk is busiest first thing in the morning and right after lunch.",
    objection: "Just send me some information.",
    voices: { answerer: "en-US-Chirp3-HD-Kore", decisionMaker: "en-US-Chirp3-HD-Leda" },
  },
  {
    id: "coastline-plumbing",
    business: "Coastline Plumbing",
    vertical: "Service business",
    answerer: "Denise, who handles the books and the office line",
    decisionMaker: "Rick, the owner",
    profile: "Five trucks doing residential repairs and water heaters. Techs collect payment when the job is done, often by having the customer read a card number to the office over the phone. Rick is in the field most of the day and is usually reachable before 7:30 a.m. or after 4:30 p.m.",
    objection: "What’s your rate?",
    voices: { answerer: "en-US-Chirp3-HD-Zephyr", decisionMaker: "en-US-Chirp3-HD-Fenrir" },
  },
  {
    id: "fern-and-fig",
    business: "Fern & Fig",
    vertical: "Retail and online store",
    answerer: "Priya, the owner, who usually answers the store phone herself",
    decisionMaker: "Priya, the owner",
    profile: "Women’s clothing boutique downtown that opened an online store last fall. The store opens at 10, and weekends are busiest. Priya posted on the store’s social media that online returns have been a headache.",
    objection: "Not interested.",
    voices: { answerer: "en-US-Chirp3-HD-Aoede", decisionMaker: "en-US-Chirp3-HD-Aoede" },
  },
  {
    id: "zaytoon-shawarma",
    business: "Zaytoon Shawarma",
    vertical: "Restaurant",
    answerer: "Omar, the owner’s son, who works the counter",
    decisionMaker: "Khalil, the owner",
    profile: "Counter-service shawarma restaurant, one location, open for over twenty years. Khalil runs it the old way: no POS system, just an electronic cash register, with cards taken on a separate countertop terminal. A few online reviews mention a sign by the register that says “Cash preferred.” The lunch rush runs from about 11:30 to 2.",
    objection: "I don’t need a computer. My register works fine.",
    voices: { answerer: "en-US-Chirp3-HD-Puck", decisionMaker: "en-US-Chirp3-HD-Orus" },
    onlyFor: "kadima",
  },
];

export const scenarios: Scenario[] = allScenarios.filter((s) => !s.onlyFor || s.onlyFor === BRAND.id);
