import { betaJSONSchemaOutputFormat } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import { NextRequest, NextResponse } from "next/server";
import { runCoach } from "@/lib/coach";
import { guardPaidRoute } from "@/lib/apiGuard";
import { scenarios } from "@/data/scenarios";
import { CALL_TIMES, formatTranscript, parseTranscript } from "@/lib/roleplay";
import { virtualRepSystem, visibleMerchant } from "@/lib/virtualRep";

// The Virtual Salesperson's next line: given a call so far that ends with the
// merchant's side talking, what a model rep would say next. Used by the hint
// button during a call and by "Watch a model call". Counts as one practice-call
// reply (roleplayTurn), the same as a merchant reply.

const TASK = `Write the single next line you would say, in response to the last thing the merchant's side said. Put it in "line", exactly as you'd speak it. In "why", name the move or lesson it uses in twelve words or fewer, for the rep watching (for example "Asks for help, not access" or "Agrees first, then one easy question").`;

const SCHEMA = {
  type: "object",
  properties: {
    line: { type: "string", description: "What you say next, one to three sentences." },
    why: { type: "string", description: "The move it uses, twelve words or fewer." },
  },
  required: ["line", "why"],
  additionalProperties: false,
} as const;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const scenario = scenarios.find((s) => s.id === body?.scenarioId);
  if (!scenario) return NextResponse.json({ error: "Pick a merchant first." }, { status: 400 });
  if (!CALL_TIMES.includes(body?.callTime)) return NextResponse.json({ error: "Pick a time to call." }, { status: 400 });

  const parsed = parseTranscript(body?.turns);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { turns } = parsed;
  // The call opens with the merchant's side answering, so it's the rep's turn when the count is odd.
  if (turns.length % 2 !== 1) return NextResponse.json({ error: "It's not the rep's turn." }, { status: 400 });

  const content = `${visibleMerchant(scenario, body.callTime)}\n\n<transcript>\n${formatTranscript(turns)}\n</transcript>`;

  const blocked = await guardPaidRoute(req, "roleplayTurn");
  if (blocked) return blocked;

  return runCoach({ system: virtualRepSystem(TASK), format: betaJSONSchemaOutputFormat(SCHEMA), content, effort: "low", maxTokens: 1500 });
}
