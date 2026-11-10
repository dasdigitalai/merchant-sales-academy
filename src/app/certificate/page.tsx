"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/components/AuthProvider";
import { fullName, loadLearnerData, type LearnerData } from "@/lib/db";
import { certification, nextItem } from "@/lib/stats";
import { lessonHref } from "@/data/curriculum";
import { downloadCertificatePdf } from "@/lib/pdf";
import { BRAND } from "@/lib/brand";

// The Appointment-Setter Certification. Shows the certificate once every module
// is complete (see certification() in lib/stats), and what's left until then.

// Names are shown as typed at sign-up, which is often all lowercase. On the
// certificate, capitalize the first letter of each part ("mary-jo o'brien" ->
// "Mary-Jo O'Brien") without lowercasing the rest, so "McKenzie" stays as is.
function capitalizeName(name: string) {
  return name.replace(/(^|[\s\-'’])(\p{Ll})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}

export default function CertificatePage() {
  const { user, profile } = useAuth();
  const [data, setData] = useState<LearnerData | null>(null);
  const [error, setError] = useState(false);
  const [pdfError, setPdfError] = useState("");
  useEffect(() => { if (user) loadLearnerData(user.uid).then(setData).catch(() => setError(true)); }, [user]);

  const name = profile ? capitalizeName(fullName(profile)) : "";
  const cert = data ? certification(data) : null;
  const next = data ? nextItem(data) : null;
  const dateText = cert?.certifiedOn?.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  const download = () => {
    if (!cert?.certifiedOn) return;
    setPdfError("");
    downloadCertificatePdf({ name, certifiedOn: cert.certifiedOn, examScore: cert.examScore ?? "Passed" }).catch(() => setPdfError("Couldn’t create the PDF. Try again."));
  };

  return <AppShell active="My progress"><div style={{ padding: "46px 4vw 70px", maxWidth: 950, margin: "auto" }}>
    <div className="eyebrow">Appointment-Setter Certification</div>
    {error && <p role="alert" style={{ color: "#a3320b" }}>Couldn’t load your progress. Refresh to try again.</p>}
    {!error && !cert && <p style={{ color: "var(--muted)" }}>Loading…</p>}
    {cert?.certified && <>
      <h1 className="display" style={{ fontSize: 40, margin: "14px 0 24px" }}>You’re certified.</h1>
      <section className="card" style={{ padding: 14, background: "var(--green)" }}>
        <div style={{ background: "white", border: "3px solid var(--lime)", borderRadius: 8, padding: "clamp(28px,6vw,60px) clamp(18px,4vw,40px)", textAlign: "center" }}>
          <small style={{ fontWeight: 900, letterSpacing: ".2em", color: "var(--green)" }}>{BRAND.name.toUpperCase()}</small>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,4.5vw,40px)", fontWeight: 400, margin: "18px 0 22px" }}>Appointment-Setter Certification</h2>
          <p style={{ color: "var(--muted)", margin: 0 }}>This certifies that</p>
          <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: "clamp(26px,4.5vw,38px)", color: "var(--green)", margin: "10px auto 14px", paddingBottom: 12, borderBottom: "1px solid var(--line)", maxWidth: 440 }}>{name || "You"}</p>
          <p style={{ maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>has completed all twelve modules of the {BRAND.name} cold-calling program, passed the final scenario call and the final exam, and committed to a 30-day action plan.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(30px,10vw,120px)", marginTop: 34, flexWrap: "wrap" }}>
            <div><small style={{ fontWeight: 900, letterSpacing: ".12em", color: "var(--muted)" }}>CERTIFIED ON</small><div style={{ fontFamily: "Georgia,serif", fontSize: 18, marginTop: 6 }}>{dateText}</div></div>
            <div><small style={{ fontWeight: 900, letterSpacing: ".12em", color: "var(--muted)" }}>FINAL EXAM</small><div style={{ fontFamily: "Georgia,serif", fontSize: 18, marginTop: 6 }}>{cert.examScore ?? "Passed"}</div></div>
          </div>
        </div>
      </section>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
        <button className="btn btn-primary" onClick={download}>Download certificate (PDF)</button>
        <Link className="btn btn-outline" href="/progress">See my progress →</Link>
      </div>
      {pdfError && <p role="alert" style={{ color: "#a3320b", fontSize: 14, marginTop: 14 }}>{pdfError}</p>}
      <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 18 }}>Your manager can see your certification on your progress report. Now go run your 30-day plan.</p>
    </>}
    {cert && !cert.certified && <>
      <h1 className="display" style={{ fontSize: 40, margin: "14px 0 10px" }}>Almost there.</h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.6, maxWidth: 720 }}>Your certificate unlocks when every module is complete, including a passing final scenario call, a passing final exam (8 of 10) and your 30-day action plan. Here’s what’s left.</p>
      <section className="card" style={{ padding: "10px 30px", marginTop: 24 }}>
        {cert.remaining.map((c) => {
          const todo = c.module.lessons.filter((l) => !c.done.has(l.id));
          return <div key={c.module.slug} style={{ padding: "16px 0", borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}><b>{c.module.id}. {c.module.title}</b><span style={{ fontSize: 13, color: "var(--muted)" }}>{c.module.lessons.length ? `${c.completed} of ${c.total} done` : "Not released yet"}</span></div>
            {todo.length > 0 && <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>{todo.map((l) => <Link key={l.id} href={lessonHref(c.module.slug, l)} style={{ fontSize: 13, fontWeight: 700, color: "var(--green)", border: "1px solid var(--line)", borderRadius: 20, padding: "5px 12px" }}>{l.title}</Link>)}</div>}
          </div>;
        })}
      </section>
      {next && <Link className="btn btn-primary" style={{ marginTop: 24 }} href={lessonHref(next.module.slug, next.lesson)}>Continue: {next.lesson.title} →</Link>}
    </>}
  </div></AppShell>;
}
