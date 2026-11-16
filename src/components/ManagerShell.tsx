"use client";
import { ArrowIcon } from "@/components/ArrowIcon";
import Link from "next/link";
import { Logo } from "./Logo";
import { RequireAuth, useAuth } from "./AuthProvider";

export function ManagerShell({ children }: { children: React.ReactNode }) {
  const { logOut } = useAuth();
  return <div style={{ minHeight: "100vh", background: "#f5f6f2" }}>
    <header style={{ minHeight: 74, background: "var(--ink)", color: "white", display: "flex", alignItems: "center" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <Logo light />
        <nav style={{ display: "flex", gap: 25, fontSize: 13, fontWeight: 800, color: "#c9d7d3", alignItems: "center" }}>
          <Link href="/manager" style={{ color: "var(--lime)" }}>Team overview</Link>
          <Link href="/dashboard">Learner view <ArrowIcon dir="right" onDark /></Link>
          <button onClick={() => void logOut()} style={{ background: "none", border: 0, color: "#c9d7d3", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Sign out</button>
        </nav>
      </div>
    </header>
    <RequireAuth role="manager"><main className="container" style={{ padding: "48px 0 70px" }}>{children}</main></RequireAuth>
  </div>;
}
