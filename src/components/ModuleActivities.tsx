"use client";
import { ArrowIcon } from "@/components/ArrowIcon";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { modules, lessonHref } from "@/data/curriculum";
import { loadLearnerData } from "@/lib/db";
import { moduleCompletion } from "@/lib/stats";

// A module's activity list, with checkmarks for what the signed-in rep has completed.
export function ModuleActivities({ moduleSlug }: { moduleSlug: string }) {
  const m = modules.find((x) => x.slug === moduleSlug)!;
  const { user } = useAuth();
  const [done, setDone] = useState<Set<string>>(new Set());
  useEffect(() => { if (user) loadLearnerData(user.uid).then((d) => setDone(moduleCompletion(m, d).done)).catch(() => {}); }, [user, m]);
  return <>{m.lessons.map((l, i) => {
    const complete = done.has(l.id);
    return <Link key={l.id} href={lessonHref(m.slug, l)} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 4px", borderTop: "1px solid var(--line)" }}><span style={{ width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center", background: complete ? "var(--green)" : "#edf0e9", color: complete ? "white" : "var(--ink)", fontWeight: 900 }}>{complete ? "✓" : i + 1}</span><div style={{ flex: 1 }}><b style={{ display: "block" }}>{l.title}</b><small style={{ color: "var(--muted)", textTransform: "capitalize" }}>{l.type} · {l.minutes} min</small></div><span style={{ fontSize: 16, display: "grid" }}><ArrowIcon /></span></Link>;
  })}</>;
}
