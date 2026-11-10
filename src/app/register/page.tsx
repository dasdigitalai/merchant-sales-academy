"use client";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/components/AuthProvider";
import { auth } from "@/lib/firebase";
import { createProfile } from "@/lib/db";
import { BRAND } from "@/lib/brand";

// Invite-only registration. The Firebase account is created first; the
// profile write then only succeeds if Firestore rules find an invite for this
// email. With no invite, the just-created account is deleted again.

export default function Register() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Invite links carry the invited email: /register?email=...
  useEffect(() => {
    const email = new URLSearchParams(window.location.search).get("email");
    if (email) setForm((f) => ({ ...f, email }));
  }, []);
  useEffect(() => { if (!loading && user && profile) router.replace("/dashboard"); }, [loading, user, profile, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) { setError("Use at least 8 characters for your password."); return; }
    setBusy(true); setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
      try {
        await createProfile(cred.user.uid, form.email, form.firstName, form.lastName);
      } catch {
        await deleteUser(cred.user).catch(() => auth.signOut());
        setError(`There's no invite for ${form.email.trim()}. ${BRAND.name} is invite-only. Ask your manager to invite this exact email.`);
        return;
      }
      await refreshProfile();
      router.replace("/dashboard");
    } catch (err) {
      const code = (err as { code?: string }).code;
      setError(code === "auth/email-already-in-use" ? "An account with this email already exists. Sign in instead." : code === "auth/invalid-email" ? "That email address doesn't look right." : "Couldn't create your account. Try again.");
    } finally { setBusy(false); }
  }

  return <div style={{ minHeight: "100vh", background: "var(--cream)", padding: 30 }}><div style={{ maxWidth: 1040, margin: "0 auto" }}><Logo /><div className="register-grid" style={{ display: "grid", gridTemplateColumns: ".9fr 1.1fr", gap: 40, alignItems: "center", minHeight: "calc(100vh - 90px)" }}>
    <div><div className="eyebrow">You&apos;ve been invited</div><h1 className="display" style={{ fontSize: 46, margin: "20px 0" }}>Make call confidence a skill—not a mood.</h1><p style={{ color: "var(--muted)", fontSize: 18, lineHeight: 1.6 }}>Build a repeatable approach to outbound calling with focused lessons, realistic practice, and clear progress. Use the email your manager invited.</p></div>
    <form className="card" onSubmit={submit} style={{ padding: 38 }}>
      <h2 style={{ fontFamily: "Georgia,serif", fontSize: 32, margin: "0 0 25px" }}>Create your account</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}><Field label="First name" value={form.firstName} onChange={set("firstName")} autoComplete="given-name" /><Field label="Last name" value={form.lastName} onChange={set("lastName")} autoComplete="family-name" /></div>
      <Field label="Work email (the one you were invited with)" type="email" value={form.email} onChange={set("email")} autoComplete="email" placeholder="you@company.com" />
      <Field label="Password" type="password" value={form.password} onChange={set("password")} autoComplete="new-password" placeholder="8+ characters" />
      {error && <p role="alert" style={{ color: "#a3320b", fontSize: 14, margin: "0 0 16px", lineHeight: 1.5 }}>{error}</p>}
      <button className="btn btn-primary" disabled={busy} style={{ width: "100%" }}>{busy ? "Creating your account…" : "Create account →"}</button>
      <p style={{ textAlign: "center", fontSize: 14, color: "var(--muted)", marginTop: 20 }}>Already have an account? <Link href="/signin" style={{ color: "var(--green)", fontWeight: 800 }}>Sign in</Link></p>
    </form>
  </div></div><style>{`@media(max-width:800px){.register-grid{grid-template-columns:1fr!important}}`}</style></div>;
}

function Field({ label, type = "text", placeholder, value, onChange, autoComplete }: { label: string; type?: string; placeholder?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; autoComplete?: string }) {
  return <label style={{ fontSize: 13, fontWeight: 800, display: "block", marginBottom: 18 }}>{label}<input type={type} required value={value} onChange={onChange} placeholder={placeholder ?? label} autoComplete={autoComplete} style={{ width: "100%", height: 46, border: "1px solid var(--line)", borderRadius: 10, padding: "0 13px", marginTop: 7, background: "#fbfcf9" }} /></label>;
}
