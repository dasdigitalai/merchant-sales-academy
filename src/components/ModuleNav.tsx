import { ArrowIcon } from "@/components/ArrowIcon";
import Link from "next/link";
import { moduleNeighbors } from "@/data/curriculum";
import { ModuleTimer } from "./Tracking";

// Shared module navigation for every item in a module (lessons, exercises and
// quizzes): a breadcrumb at the top and previous/next at the bottom. The
// breadcrumb also runs the module's time tracker, since every module page has one.

export function ModuleBreadcrumb({ moduleSlug, itemId }: { moduleSlug: string; itemId: string }) {
  const { module, index, total } = moduleNeighbors(moduleSlug, itemId);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
      <ModuleTimer moduleSlug={moduleSlug} />
      <Link href={`/courses/${module.slug}`} style={{ fontSize: 13, fontWeight: 800, color: "var(--green)" }}><ArrowIcon dir="left" /> {module.title}</Link>
      <span style={{ fontSize: 12, color: "var(--muted)" }}>Module {String(module.id).padStart(2, "0")} · {index + 1} of {total}</span>
    </div>
  );
}

export function ModulePager({ moduleSlug, itemId, children }: { moduleSlug: string; itemId: string; children?: React.ReactNode }) {
  const { prev, next } = moduleNeighbors(moduleSlug, itemId);
  const cell = { display: "flex", flexDirection: "column" as const, gap: 4, padding: "14px 18px", border: "1px solid var(--line)", borderRadius: 12, background: "white", maxWidth: 360, flex: "1 1 220px" };
  const small = { fontSize: 11, fontWeight: 900, letterSpacing: ".12em", color: "var(--muted)", textTransform: "uppercase" as const };
  return (
    <nav aria-label="Module navigation" style={{ display: "flex", justifyContent: "space-between", alignItems: "stretch", gap: 14, flexWrap: "wrap", marginTop: 28 }}>
      <Link href={prev.href} style={cell}><span style={small}><ArrowIcon dir="left" /> Previous · {prev.label}</span><b style={{ fontSize: 14, color: "var(--ink)" }}>{prev.title}</b></Link>
      {children}
      <Link href={next.href} style={{ ...cell, textAlign: "right", marginLeft: "auto" }}><span style={small}>Next · {next.label} <ArrowIcon dir="right" /></span><b style={{ fontSize: 14, color: "var(--ink)" }}>{next.title}</b></Link>
    </nav>
  );
}
