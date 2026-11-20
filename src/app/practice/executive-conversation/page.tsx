"use client";
import { ArrowIcon } from "@/components/ArrowIcon";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { authedPost } from "@/lib/authedFetch";
import { ModuleBreadcrumb, ModulePager } from "@/components/ModuleNav";
import { SavedNote, useSaveExercise } from "@/components/Tracking";
import { downloadExecutiveConversationPdf } from "@/lib/pdf";
import { PreviewGate } from "@/components/PreviewGate";
import { modules } from "@/data/curriculum";

// Module 13 exercise: for one real executive, the rep writes the questions they'll ask at each
// NEPQ stage and how they'll ask for a next step, gets coach feedback from
// /api/executive-conversation-feedback, then keeps the plan as a PDF.
const MODULE = "executive-selling-nepq";
const ITEM = "executive-conversation";

type StepKey = "prospect" | "connect" | "situation" | "problem" | "solution" | "consequence" | "commitment";
type Area = Exclude<StepKey, "prospect">;
type Section = { status: "good" | "fix"; feedback: string; suggestion: string };
type Feedback = { verdict: "ready" | "almost" | "needs_work"; summary: string; sections: Record<Area, Section>; safeOut: string; oneChange: string };
type Draft = Record<Area, string> & { role: string; company: string };

const EMPTY: Draft = { role: "", company: "", connect: "", situation: "", problem: "", solution: "", consequence: "", commitment: "" };
const ROLES = ["CEO", "CFO", "COO", "Owner-operator", "Other executive"];

const VERDICT = {
  ready: { label: "Ready to meet", bg: "var(--green)", fg: "white", pdf: "strong" as const },
  almost: { label: "Almost there", bg: "var(--lime)", fg: "var(--ink)", pdf: "close" as const },
  needs_work: { label: "Needs work", bg: "#f3d9c9", fg: "#7a2e0e", pdf: "needs_work" as const },
};

const STEPS: { key: StepKey; kicker: string; title: string; hint: string; placeholder: string }[] = [
  { key: "prospect", kicker: "THE EXECUTIVE", title: "Pick a real executive to prepare for.", hint: "Someone you have, or expect to have, a meeting with. Your questions should fit their role and business, not every executive.", placeholder: "" },
  { key: "connect", kicker: "1 · CONNECT", title: "How do you open, and what do you ask first?", hint: "Something specific and real about them or their company, then an open-ended question that gets them talking about their world, not your product.", placeholder: "e.g. I noticed you expanded into e-commerce this year. How has that transition been for your payment operations?" },
  { key: "situation", kicker: "2 · SITUATION", title: "Which two or three questions map their current setup?", hint: "A few, not a checklist. Pick from fees and effective rate, contract, integration, funding speed, support and security. Ask for numbers where you can.", placeholder: "e.g. Roughly how much do you process in cards each month, and do you know your effective rate after all fees? Are you funded next day, and how much does that matter for cash flow?" },
  { key: "problem", kicker: "3 · PROBLEM AWARENESS", title: "What do you ask so they name the problem?", hint: "Ask how they feel, follow up on something they said, or raise a common pain point. Keep it a question. Don't tell them what's wrong.", placeholder: "e.g. On a scale of 1 to 10, how confident are you in the security of your payment data? If less than a 10: Why not a 10? What concerns you?" },
  { key: "solution", kicker: "4 · SOLUTION AWARENESS", title: "What do you ask so they picture the fix?", hint: "Invite them to describe what better looks like and what it would mean for them. It's a what-if, not a promise. No pitch yet.", placeholder: "e.g. Imagine your payment processing a year from now running perfectly. What does that look like for you and your finance team?" },
  { key: "consequence", kicker: "5 · CONSEQUENCE", title: "What do you ask so they price doing nothing?", hint: "Tie it to a problem they actually named, use “what if” language, and let them supply the numbers.", placeholder: "e.g. If those fees keep rising each quarter, how would that affect your margins over the next year?" },
  { key: "commitment", kicker: "6 · COMMITMENT", title: "How do you ask for the next step?", hint: "A soft close, a 1-to-10 readiness question, or a specific next step such as a walkthrough, a cost comparison from their statement, or a meeting with their team. No pressure.", placeholder: "e.g. Do you feel this could be the answer? Why do you feel that way? What would be the next steps on your end?" },
];

const AREAS: { area: Area; title: string; step: number }[] = [
  { area: "connect", title: "1 · Connect", step: 1 },
  { area: "situation", title: "2 · Situation", step: 2 },
  { area: "problem", title: "3 · Problem awareness", step: 3 },
  { area: "solution", title: "4 · Solution awareness", step: 4 },
  { area: "consequence", title: "5 · Consequence", step: 5 },
  { area: "commitment", title: "6 · Commitment", step: 6 },
];

const RED = "#a3320b";
const field = { width: "100%", border: "1px solid var(--line)", borderRadius: 12, padding: "13px 15px", background: "#fbfcf9", lineHeight: 1.5 } as const;
const labelStyle = { display: "block", fontSize: 13, fontWeight: 800, margin: "0 0 7px" } as const;
const filled = (d: Draft, key: StepKey) => (key === "prospect" ? !!(d.role && d.company.trim()) : !!d[key].trim());

export default function ExecutiveConversationPractice() {
  const module = modules.find((m) => m.slug === MODULE);
  if (!module) notFound(); // this brand doesn't offer Module 13

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [done, setDone] = useState(false);

  const update = (patch: Partial<Draft>) => { setDraft((d) => ({ ...d, ...patch })); setFeedback(null); setError(""); };

  async function getFeedback() {
    setLoading(true);
    setError("");
    try {
      const res = await authedPost("/api/executive-conversation-feedback", draft);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI feedback failed. Try again.");
      setFeedback(data.feedback);
      setReviewing(true);
      window.scrollTo(0, 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI feedback failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const current = STEPS[step];
  const canAdvance = filled(draft, current.key);
  const onPrimary = () => {
    if (step < STEPS.length - 1) { setStep(step + 1); return; }
    if (feedback) { setReviewing(true); return; }
    void getFeedback();
  };
  const editStep = (s: number) => { setStep(s); setReviewing(false); };
  const restart = () => { setDraft(EMPTY); setFeedback(null); setError(""); setStep(0); setReviewing(false); setDone(false); };

  return (
    <AppShell active="Practice">
      <PreviewGate status={module.status}>
        <div style={{ padding: "46px 4vw 70px", maxWidth: 950, margin: "auto" }}>
          <ModuleBreadcrumb moduleSlug={MODULE} itemId={ITEM} />
          <div className="eyebrow">Module 13 practice · 12 minutes</div>
          <h1 className="display" style={{ fontSize: 40, margin: "14px 0 10px" }}>Plan your executive conversation.</h1>
          <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.6, maxWidth: 720 }}>
            For one real executive, write the questions you&rsquo;ll ask at each stage of the NEPQ method, and how you&rsquo;ll ask for a next step. The coach checks each part against the lessons, and you keep the plan to take into the meeting.
          </p>

          {done && feedback ? (
            <Summary draft={draft} feedback={feedback} onRestart={restart} />
          ) : reviewing && feedback ? (
            <Review feedback={feedback} onEdit={editStep} onBack={() => setReviewing(false)} onSave={() => { setDone(true); window.scrollTo(0, 0); }} />
          ) : (
            <div className="card" style={{ marginTop: 32, overflow: "hidden" }}>
              <div style={{ background: "var(--green)", padding: 28, color: "white", display: "flex", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <small style={{ color: "var(--lime)", fontWeight: 900 }}>{current.kicker}</small>
                  <h2 style={{ fontFamily: "Georgia,serif", fontSize: 27, margin: "8px 0 0" }}>{current.title}</h2>
                </div>
                <span style={{ fontSize: 13, color: "#c9dbd5", whiteSpace: "nowrap" }}>Step {step + 1} of {STEPS.length}</span>
              </div>
              <div style={{ padding: 36 }}>
                <p style={{ color: "var(--muted)", marginTop: 0, lineHeight: 1.55 }}>{current.hint}</p>
                {current.key === "prospect" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
                    <label>
                      <span style={labelStyle}>Role</span>
                      <select style={field} value={draft.role} onChange={(e) => update({ role: e.target.value })}>
                        <option value="">Choose one…</option>
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </label>
                    <label>
                      <span style={labelStyle}>Company</span>
                      <input style={field} maxLength={1000} value={draft.company} onChange={(e) => update({ company: e.target.value })} placeholder="e.g. Harbor Home Goods, four retail stores" />
                    </label>
                  </div>
                ) : (
                  <textarea style={{ ...field, minHeight: 150, resize: "vertical" }} maxLength={1000} value={draft[current.key]} onChange={(e) => update({ [current.key]: e.target.value } as Partial<Draft>)} placeholder={current.placeholder} />
                )}
                {error && <p role="alert" style={{ color: RED, fontSize: 14, margin: "14px 0 0" }}>{error}</p>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 26 }}>
                  {step === 0
                    ? <Link className="btn btn-outline" href={`/courses/${MODULE}/lessons/executive-objections`}><ArrowIcon dir="left" /> Back to lesson</Link>
                    : <button className="btn btn-outline" onClick={() => setStep(step - 1)}><ArrowIcon dir="left" /> Back</button>}
                  <div style={{ display: "flex", gap: 7 }}>
                    {STEPS.map((_, i) => <span key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 9, background: i === step ? "var(--green)" : "#dce2db" }} />)}
                  </div>
                  <button className="btn btn-primary" disabled={!canAdvance || loading} onClick={onPrimary}>
                    {step < STEPS.length - 1 ? <>Continue <ArrowIcon dir="right" /></> : feedback ? <>Back to feedback <ArrowIcon dir="right" /></> : loading ? "Checking your plan…" : <>Get coach feedback <ArrowIcon dir="right" /></>}
                  </button>
                </div>
              </div>
            </div>
          )}
          <ModulePager moduleSlug={MODULE} itemId={ITEM} />
        </div>
      </PreviewGate>
    </AppShell>
  );
}

function Review({ feedback, onEdit, onBack, onSave }: { feedback: Feedback; onEdit: (step: number) => void; onBack: () => void; onSave: () => void }) {
  const v = VERDICT[feedback.verdict];
  return (
    <section aria-live="polite" className="card" style={{ marginTop: 32, padding: "30px 34px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <small style={{ fontWeight: 900, letterSpacing: ".12em", color: "var(--green)" }}>COACH FEEDBACK</small>
        <span style={{ background: v.bg, color: v.fg, fontSize: 12, fontWeight: 900, padding: "4px 10px", borderRadius: 20 }}>{v.label}</span>
      </div>
      <p style={{ fontFamily: "Georgia,serif", fontSize: 19, lineHeight: 1.5, margin: "14px 0 6px" }}>{feedback.summary}</p>
      {AREAS.map((a) => ({ ...a, ...feedback.sections[a.area] })).map((sec) => (
        <div key={sec.area} style={{ padding: "18px 0", borderTop: "1px solid var(--line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 900, color: "white", background: sec.status === "good" ? "var(--green)" : RED }}>{sec.status === "good" ? "✓" : "!"}</span>
              <b>{sec.title}</b>
            </div>
            <button className="btn btn-outline" style={{ fontSize: 12, minHeight: 36, padding: "0 14px" }} onClick={() => onEdit(sec.step)}>Edit this part</button>
          </div>
          <p style={{ margin: "10px 0 0", lineHeight: 1.6, color: "var(--muted)" }}>{sec.feedback}</p>
          {sec.status === "fix" && sec.suggestion.trim() && (
            <div style={{ marginTop: 12, background: "#f7f9f2", border: "1px solid var(--line)", borderRadius: 10, padding: "12px 16px" }}>
              <small style={{ fontWeight: 900, letterSpacing: ".1em", color: "var(--muted)" }}>TRY THIS</small>
              <p style={{ margin: "6px 0 0", lineHeight: 1.55, whiteSpace: "pre-line" }}>{sec.suggestion}</p>
            </div>
          )}
        </div>
      ))}
      <div style={{ padding: "18px 0", borderTop: "1px solid var(--line)" }}>
        <small style={{ fontWeight: 900, letterSpacing: ".12em", color: "var(--green)" }}>IF THEY HESITATE</small>
        <p style={{ fontFamily: "Georgia,serif", fontSize: 19, lineHeight: 1.5, margin: "8px 0 0" }}>&ldquo;{feedback.safeOut}&rdquo;</p>
      </div>
      <div style={{ marginTop: 6, background: "#f2f6e7", borderLeft: "5px solid var(--lime)", padding: "18px 22px" }}>
        <small style={{ fontWeight: 900, letterSpacing: ".12em", color: "var(--green)" }}>ONE CHANGE BEFORE YOU MEET</small>
        <p style={{ fontFamily: "Georgia,serif", fontSize: 19, lineHeight: 1.45, margin: "8px 0 0" }}>{feedback.oneChange}</p>
      </div>
      <p style={{ fontSize: 13, color: "var(--muted)", margin: "18px 0 0" }}>Edit any part to get fresh feedback, or save the plan as it is.</p>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
        <button className="btn btn-outline" onClick={onBack}><ArrowIcon dir="left" /> Back to my plan</button>
        <button className="btn btn-primary" onClick={onSave}>Save my plan <ArrowIcon dir="right" /></button>
      </div>
    </section>
  );
}

function Summary({ draft, feedback, onRestart }: { draft: Draft; feedback: Feedback; onRestart: () => void }) {
  const v = VERDICT[feedback.verdict];
  const [pdfError, setPdfError] = useState("");
  const saveStatus = useSaveExercise({
    type: "executive-conversation",
    moduleSlug: MODULE,
    itemId: ITEM,
    title: `Executive conversation: ${draft.role} at ${draft.company}`,
    data: {
      role: draft.role, company: draft.company, connect: draft.connect, situation: draft.situation, problem: draft.problem,
      solution: draft.solution, consequence: draft.consequence, commitment: draft.commitment,
      safeOut: feedback.safeOut, verdict: feedback.verdict, verdictLabel: v.label, oneChange: feedback.oneChange,
    },
  });
  const downloadPdf = () => {
    setPdfError("");
    downloadExecutiveConversationPdf({
      role: draft.role, company: draft.company, connect: draft.connect, situation: draft.situation, problem: draft.problem,
      solution: draft.solution, consequence: draft.consequence, commitment: draft.commitment,
      safeOut: feedback.safeOut, coachVerdict: v.pdf, coachVerdictLabel: v.label, oneChange: feedback.oneChange, date: new Date(),
    }).catch(() => setPdfError("Couldn’t create the PDF. Try again."));
  };
  const row = (label: string, text: string) => (
    <div style={{ padding: "20px 0", borderTop: "1px solid var(--line)" }}>
      <small style={{ fontWeight: 900, letterSpacing: ".12em", color: "var(--muted)" }}>{label}</small>
      <p style={{ fontFamily: "Georgia,serif", fontSize: 18, margin: "8px 0 0", lineHeight: 1.5, whiteSpace: "pre-line" }}>{text}</p>
    </div>
  );
  return (
    <div style={{ marginTop: 32 }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ background: "var(--green)", padding: 28, color: "white" }}>
          <small style={{ color: "var(--lime)", fontWeight: 900 }}>PLAN SAVED · {draft.role.toUpperCase()}</small>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: 27, margin: "8px 0 4px" }}>{draft.company}</h2>
          <span style={{ fontSize: 13, color: "#c9dbd5" }}>Coach rating: {v.label}</span>
        </div>
        <div style={{ padding: "16px 36px 30px" }}>
          {row("1 · CONNECT", draft.connect)}
          {row("2 · SITUATION", draft.situation)}
          {row("3 · PROBLEM AWARENESS", draft.problem)}
          {row("4 · SOLUTION AWARENESS", draft.solution)}
          {row("5 · CONSEQUENCE", draft.consequence)}
          {row("6 · COMMITMENT: THE NEXT STEP", draft.commitment)}
          {row("IF THEY HESITATE", feedback.safeOut)}
          <div style={{ marginTop: 10, background: "#f2f6e7", borderLeft: "5px solid var(--lime)", padding: "20px 24px" }}>
            <small style={{ fontWeight: 900, letterSpacing: ".12em", color: "var(--green)" }}>BEFORE YOU MEET</small>
            <p style={{ fontFamily: "Georgia,serif", fontSize: 20, lineHeight: 1.45, margin: "8px 0 0" }}>{feedback.oneChange}</p>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn-outline" onClick={downloadPdf}>Download PDF</button>
          <button className="btn btn-outline" onClick={onRestart}>Plan another executive</button>
        </div>
        <Link className="btn btn-primary" href={`/quiz/${MODULE}`}>Continue to Knowledge Check <ArrowIcon dir="right" /></Link>
      </div>
      <SavedNote status={saveStatus} />
      {pdfError && <p role="alert" style={{ color: RED, fontSize: 14, marginTop: 14 }}>{pdfError}</p>}
    </div>
  );
}
