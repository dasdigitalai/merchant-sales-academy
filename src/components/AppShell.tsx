"use client";
import Link from "next/link";
import { Logo } from "./Logo";
import { RequireAuth, useAuth } from "./AuthProvider";
import { fullName } from "@/lib/db";

const links: [React.ReactNode, string, string][] = [
  ["▦", "Dashboard", "/dashboard"], ["▶", "Training", "/courses"], ["◎", "Practice", "/practice"], ["☏", "Call simulator", "/practice/roleplay"], ["✓", "Knowledge checks", "/quiz"], [<span key="arrow" className="arrow-ico" style={{ ["--arrow-from" as string]: "var(--lime)", fontSize: 15 }} />, "My progress", "/progress"],
];

// Every learner page renders inside this shell, so it's also where sign-in is enforced.
export function AppShell({ children, active = "Dashboard" }: { children: React.ReactNode; active?: string }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f6f2" }}>
      <aside className="desktop-only" style={{ position: "fixed", inset: "0 auto 0 0", width: 248, background: "var(--ink)", color: "white", padding: "28px 20px", display: "flex", flexDirection: "column", zIndex: 10 }}>
        <Logo light />
        <nav style={{ display: "grid", gap: 7, marginTop: 48 }}>
          {links.map(([icon, name, href]) => <Link key={name} href={href} style={{ display: "flex", gap: 13, alignItems: "center", padding: "13px 14px", borderRadius: 10, background: active === name ? "rgba(201,240,91,.14)" : "transparent", color: active === name ? "var(--lime)" : "#cfdbd7", fontWeight: 750, fontSize: 14 }}><span style={{ width: 18, textAlign: "center" }}>{icon}</span>{name}</Link>)}
        </nav>
        <ManagerLink />
      </aside>
      <main style={{ marginLeft: 248 }} className="app-main">
        <UserBar />
        <RequireAuth>{children}</RequireAuth>
      </main>
      <style>{`@media(max-width:760px){.app-main{margin-left:0!important}}`}</style>
    </div>
  );
}

function ManagerLink() {
  const { profile } = useAuth();
  if (profile?.role !== "manager") return null;
  return <Link href="/manager" style={{ marginTop: "auto", padding: "14px", borderTop: "1px solid #334c48", color: "#cfdbd7", fontSize: 13 }}>Manager view →</Link>;
}

function UserBar() {
  const { user, profile, logOut } = useAuth();
  const initials = profile ? `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase() : "";
  return (
    <div style={{ minHeight: 72, background: "white", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 4vw", gap: 14 }}>
      {profile && <>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>{fullName(profile)}</span>
        <span title={user?.email ?? profile.email} style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--green)", color: "white", display: "grid", placeItems: "center", fontWeight: 800, cursor: "default" }}>{initials}</span>
        <button onClick={() => void logOut()} style={{ fontSize: 12, fontWeight: 800, color: "var(--green)", background: "none", border: 0, cursor: "pointer" }}>Sign out</button>
      </>}
    </div>
  );
}
