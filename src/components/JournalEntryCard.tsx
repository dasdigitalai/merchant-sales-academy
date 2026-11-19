import type { JournalEntry } from "@/lib/db";
import { modules } from "@/data/curriculum";

// One saved exercise (reflection, call plan, opener, pitch card, discovery plan, objection playbook, booking plan, follow-up plan, consistency plan, front-desk plan, call lab, final scenario, action plan, practice call or executive conversation plan), shown on My progress
// and in the manager's view of a rep.

const s = (v: unknown) => (typeof v === "string" ? v : "");
type Block = { label: string; start: string; end: string; plan: string };

export function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const d = entry.data;
  const module = modules.find((m) => m.slug === entry.moduleSlug);
  const when = entry.createdAt?.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) ?? "";
  const row = (label: string, text: string, quote = false) => text.trim() ? <div style={{ padding: "12px 0", borderTop: "1px solid var(--line)" }}><small style={{ fontWeight: 900, letterSpacing: ".1em", color: "var(--muted)" }}>{label}</small><p style={{ margin: "6px 0 0", lineHeight: 1.55, whiteSpace: "pre-line", ...(quote ? { fontFamily: "Georgia,serif", fontSize: 17 } : {}) }}>{quote ? `“${text}”` : text}</p></div> : null;

  return <article className="card" style={{ padding: "22px 26px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
      <div><b style={{ fontSize: 16 }}>{entry.title}</b><small style={{ display: "block", color: "var(--muted)", marginTop: 3 }}>Module {module?.id ?? "?"} · {when}</small></div>
      {s(d.verdictLabel) && <span style={{ fontSize: 12, fontWeight: 900, padding: "4px 10px", borderRadius: 20, background: "#edf0e9" }}>Coach: {s(d.verdictLabel)}</span>}
    </div>
    <div style={{ marginTop: 10 }}>
      {entry.type === "reflection" && <>
        {row("THE THOUGHT", s(d.thought))}
        {row("FACTS-ONLY REWRITE", s(d.rewrite))}
        {row("COACH'S TIGHTER VERSION", s(d.tighterVersion))}
        {row("ACTION FOR THE NEXT CALL", s(d.action))}
      </>}
      {entry.type === "call-plan" && <>
        {row("DAILY TARGET", `${s(d.dailyTarget)} dials from ${s(d.leadCount)} leads. ${s(d.targetReason)}`)}
        {Array.isArray(d.blocks) && row("CALL BLOCKS", (d.blocks as Block[]).map((b) => `${b.label} ${b.start}–${b.end}: ${b.plan}`).join("\n"))}
        {row("PRE-CALL ROUTINE", s(d.routine))}
        {row("LOGGING", s(d.logging))}
        {row("COACH: ONE CHANGE", s(d.oneChange))}
      </>}
      {entry.type === "opener" && <>
        {row("WHAT THEY NOTICED", s(d.observation))}
        {row("THEIR OPENER", s(d.opener), true)}
        {row("COACH'S TIGHTER VERSION", s(d.tighterOpener), true)}
        {row("COACH: ONE CHANGE", s(d.oneChange))}
      </>}
      {entry.type === "pitch-card" && <>
        {row("VERTICAL AND BEST TIME TO CALL", `${s(d.vertical)}. ${s(d.callTime)}`)}
        {row("THEIR PAIN", s(d.pain))}
        {row("THEIR NUMBER", s(d.number))}
        {row(d.exampleIsReal ? "A BUSINESS LIKE THEIRS (REAL CUSTOMER)" : "THE SITUATION (NO CLOSE MATCH)", s(d.example))}
        {row("SOFTWARE QUESTION", s(d.software), true)}
        {row("COACH'S CHEAT SHEET", s(d.cheatSheet))}
        {row("COACH: ONE CHANGE", s(d.oneChange))}
      </>}
      {entry.type === "discovery-plan" && <>
        {row("VERTICAL", s(d.vertical))}
        {row("FIRST QUESTION", s(d.opening), true)}
        {row("IMPACT QUESTION", s(d.impact), true)}
        {row("IF THEY SAY", s(d.likelyAnswer))}
        {row("THEY FOLLOW WITH", s(d.followUp), true)}
        {row("WHO ELSE WEIGHS IN", s(d.decision), true)}
        {row("STATEMENT AND TIMING", s(d.statement))}
        {row("COACH: LISTEN FOR", s(d.listenFor))}
        {row("COACH: ONE CHANGE", s(d.oneChange))}
      </>}
      {entry.type === "objection-playbook" && <>
        {row("VERTICAL", s(d.vertical))}
        {row("“NOT INTERESTED”", s(d.notInterested), true)}
        {row("“WE’RE HAPPY”", s(d.happy), true)}
        {row("“SEND ME INFORMATION”", s(d.sendInfo), true)}
        {row("“WHAT’S YOUR RATE?”", s(d.price), true)}
        {row("COACH: IF THEY SAY NO TWICE", s(d.exitLine), true)}
        {row("COACH: ONE CHANGE", s(d.oneChange))}
      </>}
      {entry.type === "appointment-plan" && <>
        {row("VERTICAL", s(d.vertical))}
        {row("THE ASK", s(d.ask), true)}
        {row("QUALIFICATION CHECK", s(d.qualify))}
        {row("LOCKING IT IN", s(d.confirm))}
        {row("HANDOFF NOTE", s(d.handoff))}
        {row("COACH: CALENDAR INVITE", s(d.invite))}
        {row("COACH: ONE CHANGE", s(d.oneChange))}
      </>}
      {entry.type === "follow-up-plan" && <>
        {row("VERTICAL", s(d.vertical))}
        {row("WHERE THINGS STAND", s(d.situation))}
        {row("NEXT FOLLOW-UP", s(d.message), true)}
        {row("CADENCE", s(d.cadence))}
        {row("CLOSING THE FILE", s(d.stopRule))}
        {row("COACH: IF THEY STAY QUIET", s(d.lastMessage), true)}
        {row("COACH: ONE CHANGE", s(d.oneChange))}
      </>}
      {entry.type === "consistency-plan" && <>
        {row("LAST WEEK'S NUMBERS", s(d.numbers))}
        {row("RATIOS", s(d.ratios))}
        {row("INPUT GOALS", s(d.inputs))}
        {row("THE LEAK AND THE FIX", s(d.leak))}
        {row("FIRST-DIAL HABIT", s(d.habit))}
        {row("THE STORY, REWRITTEN", s(d.story))}
        {row("COACH: MONDAY MORNING", s(d.mondayStart))}
        {row("COACH: ONE CHANGE", s(d.oneChange))}
      </>}
      {entry.type === "gatekeeper-plan" && <>
        {row("VERTICAL", s(d.vertical))}
        {row("WHO ANSWERS", s(d.answerer))}
        {row("INTRODUCTION", s(d.intro), true)}
        {row("ASKING FOR HELP", s(d.help))}
        {row("WHEN IT'S A NO", s(d.theNo))}
        {row("MAKING AN ALLY", s(d.ally))}
        {row("COACH: ONCE PUT THROUGH", s(d.ownerOpener), true)}
        {row("COACH: ONE CHANGE", s(d.oneChange))}
      </>}
      {entry.type === "call-lab" && <>
        {row("VERTICAL", s(d.vertical))}
        {row("WHO ANSWERS", s(d.answerer))}
        {row("THE SETUP", s(d.setup))}
        {row("THE OPENING", s(d.opening))}
        {row("THE HARD MOMENT", s(d.objection))}
        {row("THE ASK", s(d.ask))}
        {typeof d.movesHit === "number" && row("COACH: FIVE MOVES", `${d.movesHit} of 5${s(d.movesMissed) ? `. Missed: ${s(d.movesMissed)}` : ""}`)}
        {row("COACH: CURVEBALL", s(d.curveball), true)}
        {row("COACH: YOU COULD SAY", s(d.curveballAnswer), true)}
        {row("COACH: ONE CHANGE", s(d.oneChange))}
      </>}
      {entry.type === "final-scenario" && <>
        {row("MERCHANT", `${s(d.scenario)} (${s(d.vertical)}). Objection: “${s(d.objectionGiven)}”`)}
        {row("TIMING AND REASON", s(d.timing))}
        {row("THE FRONT DESK", s(d.frontDesk))}
        {row("OPENER AND DISCOVERY", s(d.opener))}
        {row("THE OBJECTION", s(d.objection))}
        {row("THE ASK", s(d.ask))}
        {row("THE FOLLOW-UP", s(d.followUp))}
        {typeof d.movesHit === "number" && row("COACH: FIVE MOVES", `${d.movesHit} of 5`)}
        {row("COACH: BEST PART", s(d.strength))}
        {row(d.passed ? "COACH: PROTECT THIS" : "COACH: MOST IMPORTANT FIX", s(d.oneChange))}
      </>}
      {entry.type === "roleplay" && <>
        {row("CALL", `${s(d.scenario)} (${s(d.vertical)}) at ${s(d.callTime)}. ${s(d.outcomeLabel)}.`)}
        {row("COACH", s(d.summary))}
        {row("COACH: BEST LINE", s(d.bestLine))}
        {row("COACH: TURNING POINT", s(d.turningPoint))}
        {row("COACH: TRY THIS", s(d.tryInstead))}
        {row("COACH: ONE CHANGE", s(d.oneChange))}
        {row("TRANSCRIPT", s(d.transcript))}
      </>}
      {entry.type === "executive-conversation" && <>
        {row("EXECUTIVE", `${s(d.role)} at ${s(d.company)}`)}
        {row("1. CONNECT", s(d.connect), true)}
        {row("2. SITUATION", s(d.situation), true)}
        {row("3. PROBLEM AWARENESS", s(d.problem), true)}
        {row("4. SOLUTION AWARENESS", s(d.solution), true)}
        {row("5. CONSEQUENCE", s(d.consequence), true)}
        {row("6. COMMITMENT: THE NEXT STEP", s(d.commitment), true)}
        {row("COACH: IF THEY HESITATE", s(d.safeOut), true)}
        {row("COACH: ONE CHANGE", s(d.oneChange))}
      </>}
      {entry.type === "action-plan" && <>
        {row("DAILY INPUTS", s(d.inputs))}
        {row("ONE SKILL A WEEK", s(d.focus))}
        {row("KEEPING SCORE", s(d.score))}
        {row("THE BAD WEEK", s(d.badWeek))}
        {row("COACH: DAY ONE", s(d.dayOne))}
        {row("COACH: ONE CHANGE", s(d.oneChange))}
      </>}
    </div>
  </article>;
}
