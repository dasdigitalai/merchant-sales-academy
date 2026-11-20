import { modules, type Module } from "@/data/curriculum";
import { dayKey, type LearnerData } from "./db";

// Summaries shared by the learner dashboard, My progress, and the manager views.

// Released modules only; a manager-preview module doesn't count toward anyone's progress yet.
export const openModules = () => modules.filter((m) => m.lessons.length > 0 && m.status !== "preview");

export function moduleCompletion(m: Module, data: LearnerData) {
  const done = new Set(data.progress.filter((p) => p.moduleSlug === m.slug).map((p) => p.itemId));
  const completed = m.lessons.filter((l) => done.has(l.id)).length;
  return { completed, total: m.lessons.length, pct: m.lessons.length ? Math.round((completed / m.lessons.length) * 100) : 0, done };
}

export function overallCompletion(data: LearnerData) {
  let completed = 0, total = 0;
  for (const m of openModules()) {
    const c = moduleCompletion(m, data);
    completed += c.completed;
    total += c.total;
  }
  return { completed, total, pct: total ? Math.round((completed / total) * 100) : 0 };
}

// First item not yet completed, in curriculum order.
export function nextItem(data: LearnerData) {
  for (const m of openModules()) {
    const { done } = moduleCompletion(m, data);
    const lesson = m.lessons.find((l) => !done.has(l.id));
    if (lesson) return { module: m, lesson };
  }
  return null;
}

// Consecutive days with any training activity, ending today (or yesterday, so
// the streak doesn't read 0 first thing in the morning).
export function streak(data: LearnerData) {
  const active = (d: Date) => (data.days[dayKey(d)] ?? 0) > 0;
  const d = new Date();
  if (!active(d)) d.setDate(d.getDate() - 1);
  let n = 0;
  while (active(d)) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

// Monday-to-Sunday of the current week, with active seconds per day.
export function thisWeek(data: LearnerData) {
  const monday = new Date();
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { label: "MTWTFSS"[i], seconds: data.days[dayKey(d)] ?? 0 };
  });
}

export function bestQuizScores(data: LearnerData) {
  const best: Record<string, { score: number; total: number; passed: boolean }> = {};
  for (const r of data.quizResults) {
    const b = best[r.moduleSlug];
    if (!b || r.score > b.score) best[r.moduleSlug] = { score: r.score, total: r.total, passed: r.passed };
  }
  return best;
}

export function quizAverage(data: LearnerData) {
  const best = Object.values(bestQuizScores(data));
  if (!best.length) return null;
  return Math.round((best.reduce((t, b) => t + b.score / b.total, 0) / best.length) * 100);
}

export function totalSeconds(data: LearnerData) {
  return Object.values(data.moduleTime).reduce((t, s) => t + s, 0);
}

export function formatDuration(seconds: number) {
  const m = Math.round(seconds / 60);
  if (m < 1) return seconds > 0 ? "<1 min" : "0 min";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h} hr ${m % 60} min`;
}

export function lastActive(data: LearnerData) {
  const days = Object.keys(data.days).filter((k) => data.days[k] > 0).sort();
  return days.length ? days[days.length - 1] : null;
}

// Appointment-Setter Certification: every item in every module is complete
// (the final scenario only completes on a passing call, the final exam only on
// a pass). A core module that isn't written or released yet blocks it; advanced
// modules (track: "advanced") sit outside the certification, so adding or
// releasing one never blocks or un-does anyone's certificate. Certified on
// the date the last Module 12 item was completed.
export function certification(data: LearnerData) {
  const remaining = modules
    .filter((m) => m.track !== "advanced")
    .map((m) => ({ module: m, ...moduleCompletion(m, data) }))
    .filter((c) => c.module.lessons.length === 0 || c.module.status === "preview" || c.completed < c.total);
  const certified = remaining.length === 0;
  const finalItems = data.progress.filter((p) => p.moduleSlug === "certification" && p.completedAt);
  const certifiedOn = certified && finalItems.length ? new Date(Math.max(...finalItems.map((p) => p.completedAt!.getTime()))) : null;
  const exam = bestQuizScores(data).certification;
  return { certified, certifiedOn, examScore: exam ? `${exam.score} of ${exam.total}` : null, remaining };
}
