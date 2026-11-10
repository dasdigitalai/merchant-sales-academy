"use client";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { auth } from "@/lib/firebase";
import { loadProfile, type Profile, type Role } from "@/lib/db";
import { BRAND } from "@/lib/brand";

// Signed-in Firebase user plus their Firestore profile (name and role).
// A user with no profile signed up without an invite and has no access.

type AuthState = { user: User | null; profile: Profile | null; loading: boolean; refreshProfile: () => Promise<void>; logOut: () => Promise<void> };
const AuthContext = createContext<AuthState>({ user: null, profile: null, loading: true, refreshProfile: async () => {}, logOut: async () => {} });
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Bumped on every load, so a slow earlier load (e.g. the one fired the moment
  // a new account exists, before its profile is written) can't overwrite a newer one.
  const loadSeq = useRef(0);

  useEffect(() => onAuthStateChanged(auth, async (u) => {
    const seq = ++loadSeq.current;
    setLoading(true);
    setUser(u);
    const p = u ? await loadProfile(u.uid).catch(() => null) : null;
    if (seq !== loadSeq.current) return;
    setProfile(p);
    setLoading(false);
  }), []);

  const refreshProfile = useCallback(async () => {
    const seq = ++loadSeq.current;
    const p = auth.currentUser ? await loadProfile(auth.currentUser.uid).catch(() => null) : null;
    if (seq !== loadSeq.current) return;
    setProfile(p);
    setLoading(false);
  }, []);
  const logOut = useCallback(() => signOut(auth), []);

  return <AuthContext.Provider value={{ user, profile, loading, refreshProfile, logOut }}>{children}</AuthContext.Provider>;
}

// Wraps any page that needs a signed-in, invited user (and optionally a role).
export function RequireAuth({ role, children }: { role?: Role; children: React.ReactNode }) {
  const { user, profile, loading, logOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace(`/signin?next=${encodeURIComponent(window.location.pathname)}`);
  }, [loading, user, router]);

  if (loading || !user) return <Centered><p style={{ color: "var(--muted)" }}>Loading…</p></Centered>;
  if (!profile) return <Centered><h2 style={{ fontFamily: "Georgia,serif" }}>No access yet.</h2><p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{BRAND.name} is invite-only, and there&apos;s no invite for {user.email}. Ask your manager to invite this email, then sign in again.</p><button className="btn btn-outline" onClick={() => void logOut()}>Sign out</button></Centered>;
  if (role && profile.role !== role) return <Centered><h2 style={{ fontFamily: "Georgia,serif" }}>Managers only.</h2><p style={{ color: "var(--muted)" }}>This area is for sales managers.</p><Link className="btn btn-primary" href="/dashboard">Go to my dashboard →</Link></Centered>;
  return <>{children}</>;
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", padding: 30 }}><div style={{ maxWidth: 460, textAlign: "center", display: "grid", gap: 10, justifyItems: "center" }}>{children}</div></div>;
}
