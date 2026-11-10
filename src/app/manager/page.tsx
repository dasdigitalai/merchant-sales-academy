"use client";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ManagerShell } from "@/components/ManagerShell";
import { useAuth } from "@/components/AuthProvider";
import { createInvite, deleteInvite, removeUser, fullName, listInvites, listUsers, loadLearnerData, normalizeEmail, type Invite, type LearnerData, type Profile, type Role } from "@/lib/db";
import { formatDuration, lastActive, overallCompletion, quizAverage, streak, thisWeek, totalSeconds } from "@/lib/stats";

// Manager home: invite people, see every rep's progress at a glance, and
// remove people (after re-entering your password).

type Row = { profile: Profile; data: LearnerData };
const RED = "#a3320b";

export default function Manager() {
  return <ManagerShell><TeamOverview /></ManagerShell>;
}

function TeamOverview() {
  const { profile: me } = useAuth();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [removing, setRemoving] = useState<Profile | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [users, inv] = await Promise.all([listUsers(), listInvites()]);
      setRows(await Promise.all(users.map(async (profile) => ({ profile, data: await loadLearnerData(profile.uid) }))));
      setInvites(inv);
    } catch {
      setError("Couldn’t load the team. Refresh to try again.");
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const reps = rows?.filter((r) => r.profile.role === "rep") ?? [];
  const joined = new Set(rows?.map((r) => r.profile.email) ?? []);
  const pending = invites.filter((i) => !joined.has(i.email));
  const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null);
  const avgCompletion = avg(reps.map((r) => overallCompletion(r.data).pct));
  const avgQuiz = avg(reps.map((r) => quizAverage(r.data)).filter((x): x is number => x !== null));
  const weekSeconds = reps.reduce((t, r) => t + thisWeek(r.data).reduce((a, d) => a + d.seconds, 0), 0);

  return <>
    <div className="eyebrow">Manager dashboard</div>
    <h1 className="display" style={{ fontSize: 38, margin: "13px 0 0" }}>Team call readiness.</h1>
    {error && <p role="alert" style={{ color: RED }}>{error}</p>}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 15, marginTop: 32 }}>
      {[[String(reps.length), "Reps"], [avgCompletion === null ? "–" : `${avgCompletion}%`, "Avg. completion"], [avgQuiz === null ? "–" : `${avgQuiz}%`, "Avg. quiz score (best attempts)"], [formatDuration(weekSeconds), "Team training time this week"]].map(([v, l]) =>
        <div className="card" key={l} style={{ padding: 24 }}><b style={{ fontFamily: "Georgia,serif", fontSize: 36 }}>{rows ? v : "…"}</b><span style={{ display: "block", color: "var(--muted)", fontSize: 13, marginTop: 7 }}>{l}</span></div>)}
    </div>

    <section className="card" style={{ marginTop: 20, overflow: "hidden" }}>
      <div style={{ padding: 27, display: "flex", justifyContent: "space-between", alignItems: "center" }}><h2 style={{ fontFamily: "Georgia,serif", fontSize: 28, margin: 0 }}>Learner progress</h2><span style={{ fontSize: 13, color: "var(--muted)" }}>Click a rep to see time by module, scores and journal</span></div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 850 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr 70px 90px", padding: "13px 27px", background: "#eef1ec", fontSize: 11, fontWeight: 900, letterSpacing: ".08em", color: "var(--muted)" }}><span>LEARNER</span><span>COMPLETION</span><span>TIME TRAINING</span><span>QUIZ AVG.</span><span>LAST ACTIVE</span><span></span><span></span></div>
          {!rows && <p style={{ padding: "18px 27px", color: "var(--muted)" }}>Loading…</p>}
          {rows?.length === 0 && <p style={{ padding: "18px 27px", color: "var(--muted)" }}>No one has joined yet. Invite your reps below.</p>}
          {rows?.map(({ profile: p, data }) => {
            const c = overallCompletion(data); const q = quizAverage(data); const last = lastActive(data); const st = streak(data);
            return <div key={p.uid} style={{ display: "grid", gridTemplateColumns: "1fr 90px", alignItems: "center", padding: "0 27px 0 0", borderTop: "1px solid var(--line)" }}>
            <Link href={`/manager/${p.uid}`} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr 70px", alignItems: "center", padding: "18px 0 18px 27px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--green)", color: "white", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 900 }}>{`${p.firstName[0] ?? ""}${p.lastName[0] ?? ""}`.toUpperCase()}</span><span><b style={{ display: "block" }}>{fullName(p)}</b><small style={{ color: "var(--muted)" }}>{p.role === "manager" ? "Manager" : p.email}</small></span></div>
              <span><b>{c.pct}%</b><small style={{ display: "block", color: "var(--muted)" }}>{c.completed} of {c.total} items</small></span>
              <span>{formatDuration(totalSeconds(data))}</span>
              <span>{q === null ? "–" : `${q}%`}</span>
              <span style={{ color: "var(--muted)", fontSize: 14 }}>{last ? formatDay(last) : "Not yet"}{st > 1 ? ` · ${st}-day streak` : ""}</span>
              <span style={{ color: "var(--green)", fontWeight: 800 }}>View →</span>
            </Link>
            <span style={{ textAlign: "right" }}>{p.uid !== me?.uid && <button className="btn btn-outline" style={{ fontSize: 12, minHeight: 36, padding: "0 14px", color: RED }} onClick={() => setRemoving(p)}>Remove</button>}</span>
            </div>;
          })}
        </div>
      </div>
    </section>

    <InviteSection me={me} pending={pending} onChange={load} />
    {removing && <RemoveDialog person={removing} onClose={() => setRemoving(null)} onRemoved={async () => { setRemoving(null); await load(); }} />}
  </>;
}

function InviteSection({ me, pending, onChange }: { me: Profile | null; pending: Invite[]; onChange: () => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("rep");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [copied, setCopied] = useState("");
  const link = (e: string) => `${window.location.origin}/register?email=${encodeURIComponent(e)}`;

  async function invite(ev: React.FormEvent) {
    ev.preventDefault();
    if (!me) return;
    setBusy(true); setMessage(null);
    try {
      await createInvite(email, role, me);
      setMessage({ ok: true, text: `Invited ${normalizeEmail(email)}. Copy their invite link below and send it to them.` });
      setEmail("");
      await onChange();
    } catch {
      setMessage({ ok: false, text: "Couldn’t create the invite. Try again." });
    } finally { setBusy(false); }
  }
  async function copy(e: string) {
    await navigator.clipboard.writeText(link(e)).catch(() => {});
    setCopied(e);
  }
  async function revoke(e: string) {
    await deleteInvite(e).catch(() => {});
    await onChange();
  }

  const input = { height: 46, border: "1px solid var(--line)", borderRadius: 10, padding: "0 13px", background: "#fbfcf9" };
  return <section className="card" style={{ marginTop: 20, padding: 27 }}>
    <h2 style={{ fontFamily: "Georgia,serif", fontSize: 28, margin: "0 0 6px" }}>Invite someone</h2>
    <p style={{ color: "var(--muted)", margin: "0 0 18px", lineHeight: 1.55 }}>Only invited emails can create an account. After inviting, copy the link and send it to them. It opens the sign-up page with their email filled in.</p>
    <form onSubmit={invite} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rep@company.com" style={{ ...input, flex: "1 1 260px" }} />
      <select value={role} onChange={(e) => setRole(e.target.value as Role)} style={input}><option value="rep">Rep</option><option value="manager">Manager</option></select>
      <button className="btn btn-primary" disabled={busy}>{busy ? "Inviting…" : "Send invite +"}</button>
    </form>
    {message && <p role="status" style={{ color: message.ok ? "var(--green)" : RED, fontSize: 14, margin: "12px 0 0" }}>{message.text}</p>}
    {pending.length > 0 && <div style={{ marginTop: 22 }}>
      <small style={{ fontWeight: 900, letterSpacing: ".1em", color: "var(--muted)" }}>WAITING TO JOIN</small>
      {pending.map((i) => <div key={i.email} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "14px 0", borderTop: "1px solid var(--line)", marginTop: 8 }}>
        <span><b>{i.email}</b><small style={{ display: "block", color: "var(--muted)" }}>{i.role === "manager" ? "Manager" : "Rep"}{i.invitedByName ? ` · invited by ${i.invitedByName}` : ""}</small></span>
        <span style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-outline" style={{ fontSize: 12, minHeight: 36, padding: "0 14px" }} onClick={() => void copy(i.email)}>{copied === i.email ? "✓ Link copied" : "Copy invite link"}</button>
          <button className="btn btn-outline" style={{ fontSize: 12, minHeight: 36, padding: "0 14px", color: RED }} onClick={() => void revoke(i.email)}>Revoke</button>
        </span>
      </div>)}
    </div>}
  </section>;
}

// Confirms a removal with the manager's own password. Reauthenticating refreshes
// the sign-in time, which firestore.rules require to be under 5 minutes old.
function RemoveDialog({ person, onClose, onRemoved }: { person: Profile; onClose: () => void; onRemoved: () => Promise<void> }) {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function confirm(ev: React.FormEvent) {
    ev.preventDefault();
    if (!user?.email) return;
    setBusy(true); setError("");
    try {
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
      await user.getIdToken(true);
    } catch (err) {
      const code = (err as { code?: string }).code;
      setError(code === "auth/too-many-requests" ? "Too many tries. Wait a few minutes and try again." : "That password isn’t right.");
      setBusy(false);
      return;
    }
    try {
      await removeUser(person);
      await onRemoved();
    } catch {
      setError(`Couldn’t remove ${fullName(person)}. Try again.`);
      setBusy(false);
    }
  }

  return <div role="dialog" aria-modal="true" aria-labelledby="remove-title" onClick={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }} style={{ position: "fixed", inset: 0, background: "rgba(16,24,22,.55)", display: "grid", placeItems: "center", padding: 16, zIndex: 50 }}>
    <form onSubmit={confirm} className="card" style={{ width: "100%", maxWidth: 440, padding: 27, background: "white" }}>
      <h2 id="remove-title" style={{ fontFamily: "Georgia,serif", fontSize: 26, margin: "0 0 10px" }}>Remove {fullName(person)}?</h2>
      <p style={{ color: "var(--muted)", lineHeight: 1.55, margin: "0 0 18px" }}>This deletes their profile, progress, journal and quiz results, and cancels their invite. They won&apos;t be able to use the academy anymore. This can&apos;t be undone.</p>
      <label style={{ fontSize: 13, fontWeight: 800 }}>Enter your password to confirm
        <input type="password" required autoFocus autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ display: "block", width: "100%", height: 46, border: "1px solid var(--line)", borderRadius: 10, padding: "0 13px", background: "#fbfcf9", marginTop: 6 }} />
      </label>
      {error && <p role="alert" style={{ color: RED, fontSize: 14, margin: "12px 0 0" }}>{error}</p>}
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 20 }}>
        <button type="button" className="btn btn-outline" onClick={onClose} disabled={busy}>Cancel</button>
        <button className="btn btn-primary" style={{ background: RED, borderColor: RED }} disabled={busy || !password}>{busy ? "Removing…" : "Remove"}</button>
      </div>
    </form>
  </div>;
}

function formatDay(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
