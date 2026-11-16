"use client";
import { ArrowIcon } from "@/components/ArrowIcon";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import type { Module } from "@/data/curriculum";

// Modules with status "preview" are written but not released: managers can
// open them (to review and add images), reps see a coming-soon notice.
export function PreviewGate({ status, children }: { status: Module["status"]; children: React.ReactNode }) {
  const { profile } = useAuth();
  if (status !== "preview") return <>{children}</>;
  if (profile?.role !== "manager") {
    return <div style={{ padding: "80px 4vw", maxWidth: 640, margin: "auto", textAlign: "center" }}><h1 className="display" style={{ fontSize: 34 }}>Coming soon.</h1><p style={{ color: "var(--muted)", lineHeight: 1.6 }}>This module is still being built. Keep working through the open modules in the meantime.</p><Link className="btn btn-primary" href="/courses">Back to all modules <ArrowIcon dir="right" /></Link></div>;
  }
  return <>
    <div style={{ background: "#fff6d6", borderBottom: "1px solid #e9d99a", padding: "10px 4vw", fontSize: 13, fontWeight: 700 }}>Manager preview: reps can&apos;t see this module yet. Switch it to &ldquo;available&rdquo; in the curriculum when it&apos;s ready.</div>
    {children}
  </>;
}
