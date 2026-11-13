"use client";
import { useEffect, useRef, useState } from "react";
import { authedPost } from "@/lib/authedFetch";
import type { Scenario } from "@/data/scenarios";
import type { Turn } from "@/lib/roleplay";
import { useCallVoice } from "@/lib/useCallVoice";
import { MODEL_CALL_MAX_EXCHANGES, VS_LABEL, vsVoice } from "@/lib/virtualSalesperson";

// The Virtual Salesperson: a model rep that runs a call the way the academy
// teaches it. Three ways to see it work, all on the call simulator page:
//   ModelCall       watch it take a whole call against the same simulated merchant
//   HintBar         ask what it would say next, in the middle of your own call
//   ModelComparison after your call, your lines next to what it would have said

const RED = "#a3320b";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
// Long enough to read a line when the voice is off.
const readTime = (text: string) => Math.min(5000, 700 + text.length * 32);

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await authedPost(url, body);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "That didn't work. Try again.");
  return data.feedback as T;
}

const voiceFor = (scenario: Scenario) => vsVoice([scenario.voices.answerer, scenario.voices.decisionMaker]);
const badge = { fontSize: 11, fontWeight: 900, letterSpacing: ".08em", padding: "3px 9px", borderRadius: 20 } as const;
const small = { fontSize: 12, minHeight: 32, padding: "0 12px" } as const;

// ---------------------------------------------------------------------------
// Watch a model call

type Merchant = { speaker: string; reply: string; callOver: boolean; outcome: "ongoing" | "booked" | "callback" | "ended" | "hung_up" };
type Line = Turn & { why?: string };
type Result = "booked" | "callback" | "ended";
const RESULT: Record<Result, { label: string; bg: string; fg: string }> = {
  booked: { label: "Meeting booked", bg: "var(--green)", fg: "white" },
  callback: { label: "Told when to call back", bg: "var(--lime)", fg: "var(--ink)" },
  ended: { label: "Call ended, no meeting", bg: "#f3d9c9", fg: "#7a2e0e" },
};

export function ModelCall({ scenario, callTime, onExit }: { scenario: Scenario; callTime: string; onExit: () => void }) {
  const voice = useCallVoice(scenario.voices);
  const [status, setStatus] = useState<"intro" | "running" | "done">("intro");
  const [lines, setLines] = useState<Line[]>([]);
  const [thinking, setThinking] = useState<"merchant" | "rep" | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const cancelled = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);
  const vsVoiceId = voiceFor(scenario);

  useEffect(() => {
    cancelled.current = false;
    return () => {
      cancelled.current = true;
    };
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [lines, thinking]);

  // The merchant's side is the same simulator as a practice call (/api/roleplay);
  // the rep's side is the Virtual Salesperson (/api/virtual-rep). The next line is
  // requested while the current one is still being spoken, so the call keeps moving.
  async function run() {
    voice.begin();
    cancelled.current = false;
    setStatus("running");
    setError("");
    setLines([]);
    setResult(null);
    let turns: Line[] = [];
    const show = (t: Line) => {
      turns = [...turns, t];
      setLines(turns);
    };
    const plain = () => turns.map(({ role, speaker, text }) => ({ role, speaker, text }));
    const base = { scenarioId: scenario.id, callTime };
    try {
      setThinking("merchant");
      let m = await post<Merchant>("/api/roleplay", { ...base, turns: [] });
      for (let exchange = 1; ; exchange++) {
        if (cancelled.current) return;
        setThinking(null);
        show({ role: "merchant", speaker: m.speaker, text: m.reply });
        const last = m.callOver || exchange >= MODEL_CALL_MAX_EXCHANGES;
        const repReq = last ? null : post<{ line: string; why: string }>("/api/virtual-rep", { ...base, turns: plain() });
        repReq?.catch(() => {});
        await Promise.all([voice.speak(m.reply, m.speaker), sleep(readTime(m.reply))]);
        if (cancelled.current) return;
        if (!repReq) {
          setResult(m.callOver && m.outcome !== "ongoing" && m.outcome !== "hung_up" ? m.outcome : "ended");
          break;
        }
        setThinking("rep");
        const r = await repReq;
        if (cancelled.current) return;
        const line = r.line.slice(0, 590);
        setThinking(null);
        show({ role: "rep", speaker: VS_LABEL, text: line, why: r.why });
        const next = post<Merchant>("/api/roleplay", { ...base, turns: plain() });
        next.catch(() => {});
        await Promise.all([voice.speak(line, VS_LABEL, false, vsVoiceId), sleep(readTime(line))]);
        if (cancelled.current) return;
        setThinking("merchant");
        m = await next;
      }
    } catch (e) {
      if (!cancelled.current) setError(e instanceof Error ? e.message : "The call dropped. Try again.");
    } finally {
      if (!cancelled.current) {
        setThinking(null);
        setStatus("done");
      }
    }
  }
  const stop = () => {
    cancelled.current = true;
    voice.stop();
    setThinking(null);
    setStatus("done");
  };
  const exit = () => {
    cancelled.current = true;
    voice.stop();
    onExit();
  };

  if (status === "intro") {
    return (
      <div className="card" style={{ marginTop: 32, padding: 32 }}>
        <small style={{ fontWeight: 900, letterSpacing: ".1em", color: "var(--green)" }}>WATCH A MODEL CALL</small>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 28, margin: "10px 0" }}>The Virtual Salesperson calls {scenario.business}.</h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.6, maxWidth: 640 }}>
          Listen to a call run the way the academy teaches it, against the same simulated merchant you&rsquo;d practice on, at {callTime}. Each line the Virtual Salesperson says comes with the move it&rsquo;s using. The merchant reacts to what it says, so the call won&rsquo;t always end in a meeting, and neither will yours.
        </p>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: "10px 0 0" }}>This counts as one of today&rsquo;s practice calls.</p>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
          <button className="btn btn-outline" onClick={exit}>← Back</button>
          <button className="btn btn-primary" onClick={() => void run()}>▶ Start the model call</button>
        </div>
      </div>
    );
  }

  const running = status === "running";
  return (
    <div className="card" style={{ marginTop: 32, overflow: "hidden" }}>
      <div style={{ background: "var(--green)", padding: "20px 28px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div>
          <small style={{ color: "var(--lime)", fontWeight: 900 }}>MODEL CALL · {VS_LABEL.toUpperCase()} · {callTime}</small>
          <div style={{ fontFamily: "Georgia,serif", fontSize: 24, marginTop: 4 }}>{scenario.business}</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="btn btn-outline" aria-pressed={!voice.muted} style={{ background: "transparent", color: "white", borderColor: "rgba(255,255,255,.6)" }} onClick={voice.toggleMute}>
            {voice.muted ? "🔇 Voice off" : "🔊 Voice on"}
          </button>
          {running && <button className="btn btn-outline" style={{ background: "white", color: RED, borderColor: "white" }} onClick={stop}>Stop</button>}
        </div>
      </div>
      <div aria-live="polite" style={{ padding: "22px 28px", display: "grid", gap: 12, maxHeight: "60vh", overflowY: "auto", background: "#fbfcf9" }}>
        {lines.map((t, i) => {
          const rep = t.role === "rep";
          return (
            <div key={i} style={{ justifySelf: rep ? "end" : "start", maxWidth: "78%" }}>
              <small style={{ display: "block", fontSize: 11, fontWeight: 800, color: "var(--muted)", margin: "0 0 4px", textAlign: rep ? "right" : "left" }}>{rep ? VS_LABEL : t.speaker}</small>
              <div style={{ padding: "11px 15px", borderRadius: 14, lineHeight: 1.5, whiteSpace: "pre-line", background: rep ? "var(--green)" : "white", color: rep ? "white" : "var(--ink)", border: rep ? "none" : "1px solid var(--line)" }}>{t.text}</div>
              {rep && t.why && <div style={{ fontSize: 12, fontStyle: "italic", color: "var(--muted)", marginTop: 4, textAlign: "right" }}>Move: {t.why}</div>}
              <button type="button" aria-label="Hear this line again" onClick={() => void voice.speak(t.text, t.speaker, true, rep ? vsVoiceId : undefined)} style={{ marginTop: 2, background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--muted)", padding: "2px 0", display: "block", marginLeft: rep ? "auto" : 0 }}>🔊 Replay</button>
            </div>
          );
        })}
        {thinking && <div style={{ justifySelf: thinking === "rep" ? "end" : "start", color: "var(--muted)", fontSize: 14, fontStyle: "italic" }}>{thinking === "rep" ? `${VS_LABEL} is thinking…` : lines.length ? "…" : "Ringing…"}</div>}
        <div ref={endRef} />
      </div>
      <div style={{ padding: "18px 28px", borderTop: "1px solid var(--line)" }}>
        {error && <p role="alert" style={{ color: RED, fontSize: 14, margin: "0 0 12px" }}>{error}</p>}
        {running ? (
          <span style={{ fontSize: 13, color: "var(--muted)" }}>The call is running. Press Stop to end it.</span>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {result ? <span style={{ ...badge, background: RESULT[result].bg, color: RESULT[result].fg, fontSize: 13 }}>{RESULT[result].label}</span> : <span style={{ fontSize: 13, color: "var(--muted)" }}>{error ? "The call stopped." : "Stopped."}</span>}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btn-outline" onClick={() => void run()}>Watch again</button>
              <button className="btn btn-primary" onClick={exit}>Make my own call →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A hint in the middle of your own call

export function HintBar({ scenario, callTime, turns, disabled, onUse }: { scenario: Scenario; callTime: string; turns: Turn[]; disabled: boolean; onUse: (line: string) => void }) {
  const voice = useCallVoice();
  const [hint, setHint] = useState<{ line: string; why: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // A new line on the call makes the old hint stale.
  useEffect(() => {
    setHint(null);
    setError("");
  }, [turns.length]);

  async function ask() {
    setBusy(true);
    setError("");
    try {
      setHint(await post<{ line: string; why: string }>("/api/virtual-rep", { scenarioId: scenario.id, callTime, turns }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't get a hint. Try again.");
    } finally {
      setBusy(false);
    }
  }
  const hear = () => {
    if (!hint) return;
    voice.prime();
    void voice.speak(hint.line, VS_LABEL, true, voiceFor(scenario));
  };

  return (
    <div style={{ marginBottom: 12 }}>
      {!hint && (
        <button type="button" className="btn btn-outline" style={small} disabled={disabled || busy} onClick={() => void ask()} title="See what the Virtual Salesperson would say next">
          {busy ? "Thinking…" : "💡 What would the Virtual Salesperson say?"}
        </button>
      )}
      {error && <span role="alert" style={{ color: RED, fontSize: 13, marginLeft: 10 }}>{error}</span>}
      {hint && (
        <div style={{ background: "#f2f6e7", borderLeft: "5px solid var(--lime)", borderRadius: 8, padding: "12px 16px" }}>
          <small style={{ fontWeight: 900, letterSpacing: ".1em", color: "var(--green)" }}>{VS_LABEL.toUpperCase()} WOULD SAY</small>
          <p style={{ fontFamily: "Georgia,serif", fontSize: 17, lineHeight: 1.45, margin: "6px 0" }}>&ldquo;{hint.line}&rdquo;</p>
          <p style={{ fontSize: 13, fontStyle: "italic", color: "var(--muted)", margin: "0 0 10px" }}>Move: {hint.why}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" className="btn btn-primary" style={small} onClick={() => onUse(hint.line)}>Use this line</button>
            <button type="button" className="btn btn-outline" style={small} onClick={hear}>🔊 Hear it</button>
            <button type="button" className="btn btn-outline" style={small} onClick={() => { voice.stop(); setHint(null); }}>Dismiss</button>
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: "8px 0 0" }}>Try saying it in your own words. The line is a model, not a script.</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// After the call: your lines next to what the Virtual Salesperson would have said

type Review = { summary: string; lines: { repTurn: number; verdict: "keep" | "improve"; modelLine: string; why: string }[] };

export function ModelComparison({ scenario, callTime, turns, onWatch }: { scenario: Scenario; callTime: string; turns: Turn[]; onWatch: () => void }) {
  const voice = useCallVoice();
  const [review, setReview] = useState<Review | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const vsVoiceId = voiceFor(scenario);

  async function load() {
    voice.prime();
    setBusy(true);
    setError("");
    try {
      setReview(await post<Review>("/api/virtual-rep-review", { scenarioId: scenario.id, callTime, turns }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't compare the call. Try again.");
    } finally {
      setBusy(false);
    }
  }

  // Your lines are the odd turns; the merchant line before each one is what you were answering.
  const rows = turns.flatMap((t, i) => {
    if (t.role !== "rep") return [];
    const n = (i - 1) / 2 + 1;
    const mine = review?.lines.find((l) => l.repTurn === n);
    return [{ n, said: turns[i - 1], you: t.text, mine }];
  });

  return (
    <section style={{ marginTop: 28, padding: "20px 0 0", borderTop: "1px solid var(--line)" }}>
      <small style={{ fontWeight: 900, letterSpacing: ".12em", color: "var(--green)" }}>THE VIRTUAL SALESPERSON</small>
      {!review ? (
        <>
          <p style={{ lineHeight: 1.6, margin: "8px 0 14px", maxWidth: 640 }}>See what a model rep would have said at each point in your call, line by line, using the same method you&rsquo;ve been taught.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-outline" disabled={busy} onClick={() => void load()}>{busy ? "Comparing your call…" : "Show how the Virtual Salesperson would handle it"}</button>
            <button className="btn btn-outline" onClick={onWatch}>Or watch a whole model call</button>
          </div>
          {error && <p role="alert" style={{ color: RED, fontSize: 14, margin: "12px 0 0" }}>{error}</p>}
        </>
      ) : (
        <>
          <p style={{ fontFamily: "Georgia,serif", fontSize: 18, lineHeight: 1.5, margin: "10px 0 6px" }}>{review.summary}</p>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 14px" }}>The merchant&rsquo;s later replies were reactions to what you actually said, so this shows the best line at each moment, not a second call. To hear one start to finish, <button type="button" onClick={onWatch} style={{ background: "none", border: "none", padding: 0, font: "inherit", color: "var(--green)", fontWeight: 800, cursor: "pointer", textDecoration: "underline" }}>watch a model call</button>.</p>
          <div style={{ display: "grid", gap: 14 }}>
            {rows.map((r) => (
              <div key={r.n} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "14px 16px", background: "white" }}>
                {r.said && <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}><b>{r.said.speaker || "Merchant"}:</b> {r.said.text}</p>}
                <p style={{ margin: "0 0 10px", lineHeight: 1.5 }}><b style={{ color: "var(--green)" }}>You:</b> {r.you}</p>
                {r.mine && (
                  <div style={{ background: r.mine.verdict === "keep" ? "#f2f6e7" : "#fff6ef", borderRadius: 8, padding: "10px 14px" }}>
                    <span style={{ ...badge, background: r.mine.verdict === "keep" ? "var(--green)" : "#f3d9c9", color: r.mine.verdict === "keep" ? "white" : "#7a2e0e" }}>{r.mine.verdict === "keep" ? "✓ ALREADY STRONG" : "TRY THIS"}</span>
                    <p style={{ margin: "8px 0 6px", lineHeight: 1.5 }}><b>{VS_LABEL}:</b> {r.mine.modelLine}</p>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{r.mine.why}</p>
                    <button type="button" onClick={() => void voice.speak(r.mine!.modelLine, VS_LABEL, true, vsVoiceId)} style={{ marginTop: 4, background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--muted)", padding: "2px 0" }}>🔊 Hear it</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
