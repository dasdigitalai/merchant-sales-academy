import { createRemoteJWKSet, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

// Gate for the paid API routes (AI coach, text-to-speech): the caller must be
// a signed-in, invited user, and within their daily usage limits.
//
// There's no Firebase Admin SDK here (the Google org blocks service-account
// keys), so this verifies the Firebase ID token against Google's public keys,
// and then talks to Firestore's REST API *as that user*. The usage counters are
// protected by firestore.rules: they can only ever go up by one, so a rep can't
// reset or lower their own count from the browser.

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "merchant-sales-academy";
const JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"));
const DOCS = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// roleplay counts practice calls started; roleplayTurn counts every merchant
// reply, so one call can't run up an unbounded bill. roleplayVoice counts the
// merchant replies spoken aloud, kept apart from tts so a practice call doesn't
// use up the lesson read-alouds.
export type UsageKind = "coach" | "tts" | "roleplay" | "roleplayTurn" | "roleplayVoice";

// Defaults; override per environment in Vercel without a code change.
const LIMITS: Record<UsageKind, { perUser: number; team: number; label: string }> = {
  coach: { perUser: envInt("COACH_DAILY_LIMIT_PER_USER", 25), team: envInt("COACH_DAILY_LIMIT_TEAM", 300), label: "AI coach reviews" },
  tts: { perUser: envInt("TTS_DAILY_LIMIT_PER_USER", 60), team: envInt("TTS_DAILY_LIMIT_TEAM", 600), label: "read-alouds" },
  roleplay: { perUser: envInt("ROLEPLAY_DAILY_LIMIT_PER_USER", 10), team: envInt("ROLEPLAY_DAILY_LIMIT_TEAM", 200), label: "practice calls" },
  // A call is at most ~20 merchant replies, so these leave room for 10 long calls a day.
  roleplayTurn: { perUser: envInt("ROLEPLAY_TURN_DAILY_LIMIT_PER_USER", 300), team: envInt("ROLEPLAY_TURN_DAILY_LIMIT_TEAM", 6000), label: "practice-call replies" },
  roleplayVoice: { perUser: envInt("ROLEPLAY_VOICE_DAILY_LIMIT_PER_USER", 300), team: envInt("ROLEPLAY_VOICE_DAILY_LIMIT_TEAM", 6000), label: "spoken practice-call replies" },
};

function envInt(name: string, fallback: number) {
  const n = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

// The team works on Eastern time, so limits reset at midnight Eastern.
function today() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

/**
 * Returns null when the request may go ahead, or the error response to send.
 * Counts the request against today's limits as a side effect.
 */
export async function guardPaidRoute(req: NextRequest, kind: UsageKind): Promise<NextResponse | null> {
  const token = req.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return NextResponse.json({ error: "Sign in to use this." }, { status: 401 });

  let uid: string;
  try {
    const { payload } = await jwtVerify(token, JWKS, { issuer: `https://securetoken.google.com/${PROJECT_ID}`, audience: PROJECT_ID });
    if (!payload.sub) throw new Error("no subject");
    uid = payload.sub;
  } catch {
    return NextResponse.json({ error: "Your session expired. Refresh the page and try again." }, { status: 401 });
  }
  const auth = { Authorization: `Bearer ${token}` };

  // Invited users have a profile; anyone else signed up without an invite.
  const profile = await fetch(`${DOCS}/users/${uid}`, { headers: auth });
  if (!profile.ok) return NextResponse.json({ error: "Your account doesn't have access." }, { status: 403 });

  // Bump the rep's and the team's counters for today in one atomic commit; the
  // response carries the new values.
  const day = today();
  const commit = await fetch(`${DOCS.replace(/\/documents$/, "/documents:commit")}`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      writes: [`usage/${uid}/${kind}/${day}`, `usageTeam/${kind}_${day}`].map((path) => ({
        transform: {
          document: `projects/${PROJECT_ID}/databases/(default)/documents/${path}`,
          fieldTransforms: [{ fieldPath: "count", increment: { integerValue: "1" } }],
        },
      })),
    }),
  });
  if (!commit.ok) {
    console.error("usage counter commit failed", commit.status, await commit.text().catch(() => ""));
    return NextResponse.json({ error: "Couldn't check your usage. Try again in a minute." }, { status: 503 });
  }
  const results = (await commit.json()).writeResults as { transformResults?: { integerValue?: string }[] }[];
  const [mine, team] = results.map((r) => Number(r.transformResults?.[0]?.integerValue ?? 0));

  const limit = LIMITS[kind];
  if (mine > limit.perUser) {
    return NextResponse.json({ error: `You've used today's ${limit.perUser} ${limit.label}. The limit resets at midnight Eastern.` }, { status: 429 });
  }
  if (team > limit.team) {
    return NextResponse.json({ error: `The team has reached today's limit for ${limit.label}. It resets at midnight Eastern.` }, { status: 429 });
  }
  return null;
}
