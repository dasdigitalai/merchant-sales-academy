import { betaJSONSchemaOutputFormat } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import { NextRequest, NextResponse } from "next/server";
import { runCoach } from "@/lib/coach";
import { guardPaidRoute } from "@/lib/apiGuard";
import { scenarios } from "@/data/scenarios";
import { CALL_TIMES, parseTranscript, type Turn } from "@/lib/roleplay";
import { virtualRepSystem, visibleMerchant } from "@/lib/virtualRep";

// "How would the Virtual Salesperson have handled it": after a practice call, the
// rep's own lines side by side with what a model rep would have said at each point,
// given what the merchant had said up to then. Counts as one coach review.

const TASK = `You are looking back at a finished practice call that a rep ran. For each of the rep's lines, write what you would have said at that moment, given only what the merchant's side had said before it.

The merchant's later replies were reactions to the rep's actual words, so never assume how they would have reacted to your line. Judge each moment on its own.

For every REP line, in order, write one entry:
- "repTurn": the number of the REP line (1, 2, 3...).
- "verdict": "keep" if the rep's line already did the job well, "improve" if you'd say something different.
- "modelLine": what you would say. If the verdict is "keep", this can be the rep's own line, tightened if needed.
- "why": one or two short sentences to the rep ("you"), naming the move and why it works. If the verdict is "keep", say what they did well. Be warm and direct, and don't repeat the same point twice.
Also write "summary": two sentences comparing how you would have run the whole call with how the rep ran it, naming the single biggest difference.`;

const SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    lines: {
      type: "array",
      items: {
        type: "object",
        properties: {
          repTurn: { type: "integer" },
          verdict: { type: "string", enum: ["keep", "improve"] },
          modelLine: { type: "string" },
          why: { type: "string" },
        },
        required: ["repTurn", "verdict", "modelLine", "why"],
        additionalProperties: false,
      },
    },
  },
  required: ["summary", "lines"],
  additionalProperties: false,
} as const;

// REP lines are numbered so the answer can point at them.
function numbered(turns: Turn[]) {
  let n = 0;
  return turns.map((t) => (t.role === "rep" ? `REP #${++n}: ${t.text}` : `${(t.speaker || "MERCHANT").toUpperCase()}: ${t.text}`)).join("\n");
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const scenario = scenarios.find((s) => s.id === body?.scenarioId);
  if (!scenario) return NextResponse.json({ error: "Pick a merchant first." }, { status: 400 });
  if (!CALL_TIMES.includes(body?.callTime)) return NextResponse.json({ error: "Pick a time to call." }, { status: 400 });
  const parsed = parseTranscript(body?.turns);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  if (!parsed.turns.some((t) => t.role === "rep")) return NextResponse.json({ error: "Say something on the call first." }, { status: 400 });

  const content = `${visibleMerchant(scenario, body.callTime)}\n\n<transcript>\n${numbered(parsed.turns)}\n</transcript>`;

  const blocked = await guardPaidRoute(req, "coach");
  if (blocked) return blocked;

  return runCoach({ system: virtualRepSystem(TASK), format: betaJSONSchemaOutputFormat(SCHEMA), content });
}
