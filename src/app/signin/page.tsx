"use client";
import { BRAND } from "@/lib/brand";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/components/AuthProvider";
import { auth } from "@/lib/firebase";

const field = { width: "100%", height: 48, border: "1px solid var(--line)", borderRadius: 10, padding: "0 14px", margin: "8px 0 20px", background: "#fbfcf9" };

// Only same-site paths, so ?next= can't send someone to another website.
const safeNext = () => {
  const next = new URLSearchParams(window.location.search).get("next") ?? "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
};

export default function SignIn() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && user) router.replace(safeNext()); }, [loading, user, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      setError("That email and password don’t match. Try again, or reset your password.");
    } finally { setBusy(false); }
  }

  async function reset() {
    setError(""); setNotice("");
    if (!email.trim()) { setError("Enter your email first, then click “Forgot password?”"); return; }
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch { /* same message either way, so this doesn't reveal which emails have accounts */ }
    setNotice(`If ${email.trim()} has an account, a reset link is on its way.`);
  }

  return <div className="auth-split" style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
    <section style={{ padding: 50, background: "var(--ink)", color: "white", display: "flex", flexDirection: "column" }}><Logo light /><div style={{ margin: "auto 8%" }}><div className="eyebrow" style={{ color: "var(--lime)" }}>Welcome back</div><h1 className="display" style={{ fontSize: 48, margin: "20px 0" }}>Your next call starts here.</h1><p style={{ color: "#b8c7c3", fontSize: 18, lineHeight: 1.6 }}>Keep building the confidence and consistency that turns dials into conversations.</p></div><small style={{ color: "#78908a" }}>{BRAND.name}</small></section>
    <section style={{ display: "grid", placeItems: "center", padding: 30 }}>
      <form className="card" onSubmit={submit} style={{ width: "min(440px,100%)", padding: 38 }}>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 34, margin: "0 0 8px" }}>Sign in</h2>
        <p style={{ color: "var(--muted)", margin: "0 0 28px" }}>Continue your training.</p>
        <label style={{ fontSize: 13, fontWeight: 800 }}>Email address<input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" style={field} /></label>
        <label style={{ fontSize: 13, fontWeight: 800 }}>Password<input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={field} /></label>
        {error && <p role="alert" style={{ color: "#a3320b", fontSize: 14, margin: "0 0 14px" }}>{error}</p>}
        {notice && <p role="status" style={{ color: "var(--green)", fontSize: 14, margin: "0 0 14px" }}>{notice}</p>}
        <button className="btn btn-primary" disabled={busy} style={{ width: "100%", marginTop: 4 }}>{busy ? "Signing in…" : "Sign in →"}</button>
        <button type="button" onClick={() => void reset()} style={{ display: "block", margin: "16px auto 0", background: "none", border: 0, color: "var(--green)", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Forgot password?</button>
        <p style={{ textAlign: "center", fontSize: 14, color: "var(--muted)", marginTop: 18 }}>Got an invite? <Link href="/register" style={{ color: "var(--green)", fontWeight: 800 }}>Create your account</Link></p>
      </form>
    </section>
    <style>{`@media(max-width:800px){.auth-split{grid-template-columns:1fr!important}.auth-split>section:first-child{display:none!important}}`}</style>
  </div>;
}
