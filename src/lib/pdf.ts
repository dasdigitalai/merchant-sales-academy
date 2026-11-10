import type { jsPDF as JsPDF } from "jspdf";
import { BRAND } from "@/lib/brand";

// Builds the downloadable PDFs (reflection summary, knowledge-check results, call plan, opener, pitch card, discovery plan, objection playbook, booking plan, follow-up plan, consistency plan, front-desk plan, call lab, final scenario, action plan, certificate) as real PDF files (Letter,
// portrait; the certificate is landscape) instead of relying on the browser's print dialog, whose margin,
// orientation and background-graphics settings made the output inconsistent
// between machines. The copyright footer is drawn at the same spot on every page.

export type ReflectionPdfInput = {
  thought: string;
  rewrite: string;
  verdictLabel: string;
  verdict: "strong" | "close" | "needs_work";
  coachSummary: string;
  tighterVersion: string | null;
  action: string;
  date: Date;
};

const GREEN: [number, number, number] = BRAND.pdf.green;
const LIME: [number, number, number] = BRAND.pdf.lime;
const INK: [number, number, number] = BRAND.pdf.ink;
const MUTED: [number, number, number] = BRAND.pdf.muted;
const LINE: [number, number, number] = BRAND.pdf.line;
const TINT: [number, number, number] = BRAND.pdf.tint;
const PILL: Record<ReflectionPdfInput["verdict"], { bg: [number, number, number]; fg: [number, number, number] }> = {
  strong: { bg: GREEN, fg: [255, 255, 255] },
  close: { bg: LIME, fg: INK },
  needs_work: { bg: [243, 217, 201], fg: [122, 46, 14] },
};

const MARGIN = 54;
const FOOTER_SPACE = 60;

// jsPDF's built-in fonts only cover WinAnsi, so swap the typographic
// characters the coach commonly writes for plain equivalents.
function clean(text: string) {
  return text
    .replace(/[—–]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, "...")
    .replace(/[→⇒➔]/g, "->")
    .replace(/[←⇐]/g, "<-")
    .replace(/•/g, "-")
    .replace(/[^\x00-\xFF]/g, "")
    .trim();
}

export async function downloadReflectionPdf(input: ReflectionPdfInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN * 2;
  const dateText = input.date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  drawHeader(doc, "REFLECTION COMPLETE", "Reframe the rejection", dateText);

  let y = 150;
  const ensureRoom = (needed: number) => {
    if (y + needed > pageH - FOOTER_SPACE) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const section = (label: string, text: string, pill?: ReflectionPdfInput["verdict"]) => {
    doc.setFont("helvetica", "normal").setFontSize(12);
    const lines = doc.splitTextToSize(clean(text), contentW) as string[];
    ensureRoom(40 + lines.length * 16);
    doc.setDrawColor(...LINE).setLineWidth(0.75).line(MARGIN, y, pageW - MARGIN, y);
    y += 22;
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...MUTED);
    doc.text(label, MARGIN, y, { charSpace: 1.2 });
    if (pill) drawPill(doc, input.verdictLabel, pill, MARGIN + doc.getTextWidth(label) + label.length * 1.2 + 10, y);
    y += 18;
    doc.setFont("helvetica", "normal").setFontSize(12).setTextColor(...INK);
    doc.text(lines, MARGIN, y, { lineHeightFactor: 1.35 });
    y += lines.length * 16 + 12;
  };

  section("THE THOUGHT", input.thought);
  section("YOUR FACTS-ONLY REWRITE", input.rewrite, input.verdict);

  if (input.coachSummary) {
    doc.setFont("helvetica", "normal").setFontSize(10);
    const lines = doc.splitTextToSize(`Coach: ${clean(input.coachSummary)}`, contentW) as string[];
    ensureRoom(lines.length * 14 + 10);
    y -= 4;
    doc.setTextColor(...MUTED).text(lines, MARGIN, y, { lineHeightFactor: 1.4 });
    y += lines.length * 14 + 14;
  }

  if (input.tighterVersion) section("COACH'S TIGHTER VERSION", input.tighterVersion);
  section("YOUR ACTION FOR THE NEXT CALL", input.action);

  // "Read this" callout
  doc.setFont("times", "normal").setFontSize(16);
  const actionLines = doc.splitTextToSize(clean(input.action), contentW - 44) as string[];
  const boxH = 50 + actionLines.length * 21;
  ensureRoom(boxH + 10);
  y += 6;
  doc.setFillColor(...TINT).rect(MARGIN, y, contentW, boxH, "F");
  doc.setFillColor(...LIME).rect(MARGIN, y, 5, boxH, "F");
  doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...GREEN);
  doc.text("BEFORE YOUR NEXT CALL BLOCK, READ THIS", MARGIN + 24, y + 24, { charSpace: 1.2 });
  doc.setFont("times", "normal").setFontSize(16).setTextColor(...INK);
  doc.text(actionLines, MARGIN + 24, y + 46, { lineHeightFactor: 1.3 });

  drawFooters(doc, input.date);

  const stamp = input.date.toISOString().slice(0, 10);
  doc.save(`Reflection - Reframe the Rejection - ${stamp}.pdf`);
}

function drawPill(doc: JsPDF, label: string, verdict: ReflectionPdfInput["verdict"], x: number, baseline: number) {
  const { bg, fg } = PILL[verdict];
  doc.setFont("helvetica", "bold").setFontSize(8);
  const w = doc.getTextWidth(label) + 16;
  doc.setFillColor(...bg).roundedRect(x, baseline - 10, w, 15, 7.5, 7.5, "F");
  doc.setTextColor(...fg).text(label, x + 8, baseline + 0.5);
}

function drawHeader(doc: JsPDF, kicker: string, title: string, dateText: string) {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, pageW, 118, "F");
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...LIME);
  doc.text(kicker, MARGIN, 44, { charSpace: 1 });
  doc.setFont("times", "normal").setFontSize(24).setTextColor(255, 255, 255);
  doc.text(title, MARGIN, 76);
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(201, 219, 213);
  doc.text(`${BRAND.name}  |  ${dateText}`, MARGIN, 98);
}

// Copyright footer at the same position on every page.
function drawFooters(doc: JsPDF, date: Date) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  for (let i = 1; i <= doc.getNumberOfPages(); i++) {
    doc.setPage(i);
    doc.setDrawColor(...LINE).setLineWidth(0.75).line(MARGIN, pageH - 42, pageW - MARGIN, pageH - 42);
    doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(...MUTED);
    doc.text(`© ${date.getFullYear()} ${BRAND.name}. All rights reserved.`, pageW / 2, pageH - 26, { align: "center" });
  }
}

export type QuizResultsPdfInput = {
  moduleTitle: string;
  score: number;
  total: number;
  passed: boolean;
  passMark: number;
  items: { prompt: string; chosen: string; correct: string; isCorrect: boolean; explanation: string }[];
  date: Date;
};

export async function downloadQuizResultsPdf(input: QuizResultsPdfInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN * 2;
  const dateText = input.date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  drawHeader(doc, "KNOWLEDGE CHECK RESULTS", clean(input.moduleTitle), dateText);

  let y = 150;
  const ensureRoom = (needed: number) => {
    if (y + needed > pageH - FOOTER_SPACE) {
      doc.addPage();
      y = MARGIN;
    }
  };

  // Score summary
  doc.setFont("times", "normal").setFontSize(34).setTextColor(...INK);
  doc.text(`${input.score} of ${input.total}`, MARGIN, y + 20);
  const scoreW = doc.getTextWidth(`${input.score} of ${input.total}`);
  drawPill(doc, input.passed ? "Passed" : "Not yet passed", input.passed ? "strong" : "needs_work", MARGIN + scoreW + 16, y + 12);
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...MUTED);
  doc.text(`Pass mark: ${input.passMark} of ${input.total} correct`, MARGIN, y + 42);
  y += 70;

  input.items.forEach((item, i) => {
    doc.setFont("helvetica", "bold").setFontSize(11.5);
    const promptLines = doc.splitTextToSize(clean(item.prompt), contentW) as string[];
    doc.setFont("helvetica", "normal").setFontSize(10.5);
    const chosenLines = doc.splitTextToSize(`Your answer: ${clean(item.chosen)}`, contentW - 14) as string[];
    const correctLines = item.isCorrect ? [] : (doc.splitTextToSize(`Correct answer: ${clean(item.correct)}`, contentW - 14) as string[]);
    doc.setFontSize(9.5);
    const whyLines = doc.splitTextToSize(clean(item.explanation), contentW) as string[];
    const blockH = 40 + promptLines.length * 15 + (chosenLines.length + correctLines.length) * 14 + whyLines.length * 13 + 18;
    ensureRoom(blockH);

    doc.setDrawColor(...LINE).setLineWidth(0.75).line(MARGIN, y, pageW - MARGIN, y);
    y += 22;
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...MUTED);
    doc.text(`QUESTION ${String(i + 1).padStart(2, "0")}`, MARGIN, y, { charSpace: 1.2 });
    drawPill(doc, item.isCorrect ? "Correct" : "Missed", item.isCorrect ? "strong" : "needs_work", MARGIN + 92, y);
    y += 18;
    doc.setFont("helvetica", "bold").setFontSize(11.5).setTextColor(...INK);
    doc.text(promptLines, MARGIN, y, { lineHeightFactor: 1.3 });
    y += promptLines.length * 15 + 6;

    doc.setFont("helvetica", "normal").setFontSize(10.5);
    const mark = item.isCorrect ? GREEN : ([163, 50, 11] as [number, number, number]);
    doc.setFillColor(...mark).rect(MARGIN, y - 9, 3, chosenLines.length * 14, "F");
    doc.setTextColor(...INK).text(chosenLines, MARGIN + 12, y, { lineHeightFactor: 1.3 });
    y += chosenLines.length * 14;
    if (correctLines.length) {
      y += 4;
      doc.setFillColor(...GREEN).rect(MARGIN, y - 9, 3, correctLines.length * 14, "F");
      doc.text(correctLines, MARGIN + 12, y, { lineHeightFactor: 1.3 });
      y += correctLines.length * 14;
    }
    y += 8;
    doc.setFontSize(9.5).setTextColor(...MUTED);
    doc.text(whyLines, MARGIN, y, { lineHeightFactor: 1.35 });
    y += whyLines.length * 13 + 16;
  });

  drawFooters(doc, input.date);
  const stamp = input.date.toISOString().slice(0, 10);
  doc.save(`Knowledge Check Results - ${clean(input.moduleTitle)} - ${stamp}.pdf`);
}

export type CallPlanPdfInput = {
  leadCount: string;
  dailyTarget: string;
  targetReason: string;
  blocks: { label: string; start: string; end: string; plan: string }[];
  routine: string;
  logging: string;
  coachVerdictLabel: string;
  coachVerdict: "strong" | "close" | "needs_work";
  oneChange: string;
  date: Date;
};

// One-page call plan the rep can keep next to the phone.
export async function downloadCallPlanPdf(input: CallPlanPdfInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN * 2;
  const dateText = input.date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  drawHeader(doc, "MY CALL PLAN", "Tomorrow's call plan", dateText);

  let y = 150;
  const ensureRoom = (needed: number) => {
    if (y + needed > pageH - FOOTER_SPACE) {
      doc.addPage();
      y = MARGIN;
    }
  };
  const label = (text: string) => {
    doc.setDrawColor(...LINE).setLineWidth(0.75).line(MARGIN, y, pageW - MARGIN, y);
    y += 22;
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...MUTED);
    doc.text(text, MARGIN, y, { charSpace: 1.2 });
    y += 18;
  };
  const paragraph = (text: string, size = 11.5) => {
    doc.setFont("helvetica", "normal").setFontSize(size).setTextColor(...INK);
    const lines = doc.splitTextToSize(clean(text), contentW) as string[];
    ensureRoom(lines.length * (size + 4));
    doc.text(lines, MARGIN, y, { lineHeightFactor: 1.35 });
    y += lines.length * (size + 4) + 10;
  };

  // Target
  label("DAILY DIAL TARGET");
  doc.setFont("times", "normal").setFontSize(34).setTextColor(...INK);
  doc.text(`${clean(input.dailyTarget)} dials`, MARGIN, y + 14);
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...MUTED);
  doc.text(`From a list of ${clean(input.leadCount)} leads this week. Set before the first dial. Non-negotiable.`, MARGIN, y + 34);
  y += 52;
  if (input.targetReason.trim()) paragraph(input.targetReason, 10.5);

  // Blocks
  ensureRoom(60);
  label("CALL BLOCKS");
  const labelW = 70;
  const timeW = 110;
  for (const b of input.blocks) {
    doc.setFont("helvetica", "normal").setFontSize(10.5);
    const planLines = doc.splitTextToSize(clean(b.plan), contentW - labelW - timeW) as string[];
    const rowH = Math.max(1, planLines.length) * 14 + 10;
    ensureRoom(rowH);
    doc.setFont("helvetica", "bold").setFontSize(10.5).setTextColor(...GREEN);
    doc.text(b.label, MARGIN, y);
    doc.setFont("helvetica", "normal").setTextColor(...INK);
    doc.text(`${clean(b.start)} - ${clean(b.end)}`, MARGIN + labelW, y);
    doc.text(planLines, MARGIN + labelW + timeW, y, { lineHeightFactor: 1.3 });
    y += rowH;
  }
  y += 4;

  // Routine, as numbered steps when the rep wrote one step per line
  ensureRoom(60);
  label("PRE-CALL ROUTINE (SAME EVERY TIME)");
  const steps = input.routine.split(/\n+/).map((l) => l.replace(/^\s*(\d+[.)]|[-*])\s*/, "").trim()).filter(Boolean);
  if (steps.length > 1) {
    doc.setFont("helvetica", "normal").setFontSize(11);
    steps.forEach((step, i) => {
      const lines = doc.splitTextToSize(clean(step), contentW - 22) as string[];
      ensureRoom(lines.length * 15 + 4);
      doc.setFont("helvetica", "bold").setTextColor(...GREEN).text(`${i + 1}.`, MARGIN, y);
      doc.setFont("helvetica", "normal").setTextColor(...INK).text(lines, MARGIN + 22, y, { lineHeightFactor: 1.3 });
      y += lines.length * 15 + 4;
    });
    y += 8;
  } else {
    paragraph(input.routine, 11);
  }

  // Logging
  ensureRoom(60);
  label("WHAT I LOG, AND WHEN");
  paragraph(input.logging, 11);

  // Coach's one change
  doc.setFont("helvetica", "normal").setFontSize(11.5);
  const changeLines = doc.splitTextToSize(clean(input.oneChange), contentW - 44) as string[];
  const boxH = 52 + changeLines.length * 16;
  ensureRoom(boxH + 10);
  y += 4;
  doc.setFillColor(...TINT).rect(MARGIN, y, contentW, boxH, "F");
  doc.setFillColor(...LIME).rect(MARGIN, y, 5, boxH, "F");
  doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...GREEN);
  doc.text("COACH: ONE CHANGE BEFORE TOMORROW", MARGIN + 24, y + 24, { charSpace: 1.2 });
  drawPill(doc, input.coachVerdictLabel, input.coachVerdict, pageW - MARGIN - 16 - doc.getTextWidth(input.coachVerdictLabel) - 18, y + 24);
  doc.setFont("helvetica", "normal").setFontSize(11.5).setTextColor(...INK);
  doc.text(changeLines, MARGIN + 24, y + 44, { lineHeightFactor: 1.35 });

  drawFooters(doc, input.date);
  const stamp = input.date.toISOString().slice(0, 10);
  doc.save(`Call Plan - ${stamp}.pdf`);
}

export type OpenerPdfInput = {
  merchant: string;
  contact: string;
  observation: string;
  opener: string;
  tighterOpener: string;
  coachVerdictLabel: string;
  coachVerdict: "strong" | "close" | "needs_work";
  oneChange: string;
  date: Date;
};

// The rep's opener for one merchant, with the coach's tighter version, to keep
// next to the phone for the call block.
export async function downloadOpenerPdf(input: OpenerPdfInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN * 2;
  const dateText = input.date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  drawHeader(doc, "MY OPENER", clean(input.merchant), dateText);

  let y = 150;
  const ensureRoom = (needed: number) => {
    if (y + needed > pageH - FOOTER_SPACE) {
      doc.addPage();
      y = MARGIN;
    }
  };
  const section = (label: string, text: string, opts: { quote?: boolean; pill?: boolean } = {}) => {
    const size = opts.quote ? 15 : 11.5;
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size);
    const body = opts.quote ? `"${clean(text)}"` : clean(text);
    const lines = doc.splitTextToSize(body, contentW) as string[];
    ensureRoom(40 + lines.length * (size + 5));
    doc.setDrawColor(...LINE).setLineWidth(0.75).line(MARGIN, y, pageW - MARGIN, y);
    y += 22;
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...MUTED);
    doc.text(label, MARGIN, y, { charSpace: 1.2 });
    if (opts.pill) drawPill(doc, input.coachVerdictLabel, input.coachVerdict, MARGIN + doc.getTextWidth(label) + label.length * 1.2 + 10, y);
    y += 20;
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size).setTextColor(...INK);
    doc.text(lines, MARGIN, y, { lineHeightFactor: 1.35 });
    y += lines.length * (size + 5) + 12;
  };

  const who = input.contact.trim() ? `Contact: ${clean(input.contact)}. ` : "";
  section("WHAT I NOTICED", `${who}${input.observation}`);
  section("MY OPENER", input.opener, { quote: true, pill: true });
  section("COACH'S TIGHTER VERSION", input.tighterOpener, { quote: true });

  // Before-the-dial callout
  const note = "Then say the opener out loud until it sounds like something you'd actually say, not something you're reading.";
  doc.setFont("helvetica", "normal").setFontSize(11.5);
  const changeLines = doc.splitTextToSize(clean(input.oneChange), contentW - 44) as string[];
  doc.setFontSize(9.5);
  const noteLines = doc.splitTextToSize(note, contentW - 44) as string[];
  const boxH = 58 + changeLines.length * 16 + noteLines.length * 13;
  ensureRoom(boxH + 10);
  y += 4;
  doc.setFillColor(...TINT).rect(MARGIN, y, contentW, boxH, "F");
  doc.setFillColor(...LIME).rect(MARGIN, y, 5, boxH, "F");
  doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...GREEN);
  doc.text("BEFORE THE FIRST DIAL", MARGIN + 24, y + 24, { charSpace: 1.2 });
  doc.setFont("helvetica", "normal").setFontSize(11.5).setTextColor(...INK);
  doc.text(changeLines, MARGIN + 24, y + 44, { lineHeightFactor: 1.35 });
  doc.setFontSize(9.5).setTextColor(...MUTED);
  doc.text(noteLines, MARGIN + 24, y + 50 + changeLines.length * 16, { lineHeightFactor: 1.35 });

  drawFooters(doc, input.date);
  const stamp = input.date.toISOString().slice(0, 10);
  doc.save(`Opener - ${clean(input.merchant).replace(/[\/:*?"<>|]/g, "")} - ${stamp}.pdf`);
}

export type PitchCardPdfInput = {
  vertical: string;
  merchant: string;
  callTime: string;
  pain: string;
  number: string;
  exampleLabel: string;
  example: string;
  software: string;
  cheatSheet: string;
  coachVerdictLabel: string;
  coachVerdict: "strong" | "close" | "needs_work";
  oneChange: string;
  date: Date;
};

// One merchant's pitch card (Module 4) to keep next to the phone.
export async function downloadPitchCardPdf(input: PitchCardPdfInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN * 2;
  const dateText = input.date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  drawHeader(doc, `PITCH CARD  |  ${clean(input.vertical).toUpperCase()}`, clean(input.merchant), dateText);

  let y = 150;
  const ensureRoom = (needed: number) => {
    if (y + needed > pageH - FOOTER_SPACE) {
      doc.addPage();
      y = MARGIN;
    }
  };
  const section = (label: string, text: string, opts: { quote?: boolean; pill?: boolean } = {}) => {
    const size = opts.quote ? 14 : 11.5;
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size);
    const lines = doc.splitTextToSize(opts.quote ? `"${clean(text)}"` : clean(text), contentW) as string[];
    ensureRoom(40 + lines.length * (size + 5));
    doc.setDrawColor(...LINE).setLineWidth(0.75).line(MARGIN, y, pageW - MARGIN, y);
    y += 22;
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...MUTED);
    doc.text(label, MARGIN, y, { charSpace: 1.2 });
    if (opts.pill) drawPill(doc, input.coachVerdictLabel, input.coachVerdict, MARGIN + doc.getTextWidth(label) + label.length * 1.2 + 10, y);
    y += 20;
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size).setTextColor(...INK);
    doc.text(lines, MARGIN, y, { lineHeightFactor: 1.35 });
    y += lines.length * (size + 5) + 12;
  };

  // Cheat sheet callout
  doc.setFont("times", "normal").setFontSize(14);
  const sheetLines = doc.splitTextToSize(clean(input.cheatSheet), contentW - 44) as string[];
  const sheetH = 46 + sheetLines.length * 18;
  doc.setFillColor(...TINT).rect(MARGIN, y, contentW, sheetH, "F");
  doc.setFillColor(...LIME).rect(MARGIN, y, 5, sheetH, "F");
  doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...GREEN);
  doc.text("CHEAT SHEET FOR THIS VERTICAL", MARGIN + 24, y + 22, { charSpace: 1.2 });
  doc.setFont("times", "normal").setFontSize(14).setTextColor(...INK);
  doc.text(sheetLines, MARGIN + 24, y + 42, { lineHeightFactor: 1.3 });
  y += sheetH + 18;

  section("BEST TIME TO CALL", input.callTime, { pill: true });
  section("THEIR PAIN", input.pain);
  section("THEIR NUMBER", input.number);
  section(clean(input.exampleLabel), input.example);
  section("ASK ABOUT THEIR SOFTWARE", input.software, { quote: true });

  // Before-you-call callout
  doc.setFont("helvetica", "normal").setFontSize(11.5);
  const changeLines = doc.splitTextToSize(clean(input.oneChange), contentW - 44) as string[];
  const boxH = 52 + changeLines.length * 16;
  ensureRoom(boxH + 10);
  y += 4;
  doc.setFillColor(...TINT).rect(MARGIN, y, contentW, boxH, "F");
  doc.setFillColor(...LIME).rect(MARGIN, y, 5, boxH, "F");
  doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...GREEN);
  doc.text("BEFORE YOU CALL", MARGIN + 24, y + 24, { charSpace: 1.2 });
  doc.setFont("helvetica", "normal").setFontSize(11.5).setTextColor(...INK);
  doc.text(changeLines, MARGIN + 24, y + 44, { lineHeightFactor: 1.35 });

  drawFooters(doc, input.date);
  const stamp = input.date.toISOString().slice(0, 10);
  doc.save(`Pitch Card - ${clean(input.merchant).replace(/[\/:*?"<>|]/g, "")} - ${stamp}.pdf`);
}

export type DiscoveryPlanPdfInput = {
  vertical: string;
  merchant: string;
  opening: string;
  impact: string;
  likelyAnswer: string;
  followUp: string;
  decision: string;
  statement: string;
  listenFor: string;
  coachVerdictLabel: string;
  coachVerdict: "strong" | "close" | "needs_work";
  oneChange: string;
  date: Date;
};

// One merchant's discovery plan (Module 5) to keep next to the phone.
export async function downloadDiscoveryPlanPdf(input: DiscoveryPlanPdfInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN * 2;
  const dateText = input.date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  drawHeader(doc, `DISCOVERY PLAN  |  ${clean(input.vertical).toUpperCase()}`, clean(input.merchant), dateText);

  let y = 150;
  const ensureRoom = (needed: number) => {
    if (y + needed > pageH - FOOTER_SPACE) {
      doc.addPage();
      y = MARGIN;
    }
  };
  const section = (label: string, text: string, opts: { quote?: boolean; pill?: boolean } = {}) => {
    const size = opts.quote ? 14 : 11.5;
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size);
    const lines = doc.splitTextToSize(opts.quote ? `"${clean(text)}"` : clean(text), contentW) as string[];
    ensureRoom(40 + lines.length * (size + 5));
    doc.setDrawColor(...LINE).setLineWidth(0.75).line(MARGIN, y, pageW - MARGIN, y);
    y += 22;
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...MUTED);
    doc.text(label, MARGIN, y, { charSpace: 1.2 });
    if (opts.pill) drawPill(doc, input.coachVerdictLabel, input.coachVerdict, MARGIN + doc.getTextWidth(label) + label.length * 1.2 + 10, y);
    y += 20;
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size).setTextColor(...INK);
    doc.text(lines, MARGIN, y, { lineHeightFactor: 1.35 });
    y += lines.length * (size + 5) + 12;
  };
  const callout = (label: string, text: string, serif: boolean) => {
    const size = serif ? 14 : 11.5;
    doc.setFont(serif ? "times" : "helvetica", "normal").setFontSize(size);
    const lines = doc.splitTextToSize(clean(text), contentW - 44) as string[];
    const boxH = 50 + lines.length * (size + 4);
    ensureRoom(boxH + 10);
    doc.setFillColor(...TINT).rect(MARGIN, y, contentW, boxH, "F");
    doc.setFillColor(...LIME).rect(MARGIN, y, 5, boxH, "F");
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...GREEN);
    doc.text(label, MARGIN + 24, y + 24, { charSpace: 1.2 });
    doc.setFont(serif ? "times" : "helvetica", "normal").setFontSize(size).setTextColor(...INK);
    doc.text(lines, MARGIN + 24, y + 44, { lineHeightFactor: 1.35 });
    y += boxH + 18;
  };

  section("FIRST QUESTION", input.opening, { quote: true, pill: true });
  section("IMPACT QUESTION", input.impact, { quote: true });
  section("IF THEY SAY", input.likelyAnswer);
  section("YOU FOLLOW WITH", input.followUp, { quote: true });
  section("WHO ELSE WEIGHS IN", input.decision, { quote: true });
  section("STATEMENT AND TIMING", input.statement);
  y += 4;
  callout("LISTEN FOR", input.listenFor, true);
  callout("BEFORE YOU CALL", input.oneChange, false);

  drawFooters(doc, input.date);
  const stamp = input.date.toISOString().slice(0, 10);
  doc.save(`Discovery Plan - ${clean(input.merchant).replace(/[\/:*?"<>|]/g, "")} - ${stamp}.pdf`);
}

export type ObjectionPlaybookPdfInput = {
  vertical: string;
  merchant: string;
  notInterested: string;
  happy: string;
  sendInfo: string;
  price: string;
  exitLine: string;
  coachVerdictLabel: string;
  coachVerdict: "strong" | "close" | "needs_work";
  oneChange: string;
  date: Date;
};

// One merchant's objection playbook (Module 6) to keep next to the phone.
export async function downloadObjectionPlaybookPdf(input: ObjectionPlaybookPdfInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN * 2;
  const dateText = input.date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  drawHeader(doc, `OBJECTION PLAYBOOK  |  ${clean(input.vertical).toUpperCase()}`, clean(input.merchant), dateText);

  let y = 150;
  const ensureRoom = (needed: number) => {
    if (y + needed > pageH - FOOTER_SPACE) {
      doc.addPage();
      y = MARGIN;
    }
  };
  const section = (label: string, text: string, pill = false) => {
    doc.setFont("times", "normal").setFontSize(14);
    const lines = doc.splitTextToSize(`"${clean(text)}"`, contentW) as string[];
    ensureRoom(40 + lines.length * 19);
    doc.setDrawColor(...LINE).setLineWidth(0.75).line(MARGIN, y, pageW - MARGIN, y);
    y += 22;
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...MUTED);
    doc.text(label, MARGIN, y, { charSpace: 1.2 });
    if (pill) drawPill(doc, input.coachVerdictLabel, input.coachVerdict, MARGIN + doc.getTextWidth(label) + label.length * 1.2 + 10, y);
    y += 20;
    doc.setFont("times", "normal").setFontSize(14).setTextColor(...INK);
    doc.text(lines, MARGIN, y, { lineHeightFactor: 1.35 });
    y += lines.length * 19 + 12;
  };

  section("WHEN THEY SAY \"NOT INTERESTED\"", input.notInterested, true);
  section("WHEN THEY SAY \"WE'RE HAPPY\"", input.happy);
  section("WHEN THEY SAY \"SEND ME INFORMATION\"", input.sendInfo);
  section("WHEN THEY ASK \"WHAT'S YOUR RATE?\"", input.price);
  section("IF THEY SAY NO TWICE", input.exitLine);

  // Before-you-call callout
  doc.setFont("helvetica", "normal").setFontSize(11.5);
  const changeLines = doc.splitTextToSize(clean(input.oneChange), contentW - 44) as string[];
  const boxH = 52 + changeLines.length * 16;
  ensureRoom(boxH + 10);
  y += 4;
  doc.setFillColor(...TINT).rect(MARGIN, y, contentW, boxH, "F");
  doc.setFillColor(...LIME).rect(MARGIN, y, 5, boxH, "F");
  doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...GREEN);
  doc.text("BEFORE YOU CALL", MARGIN + 24, y + 24, { charSpace: 1.2 });
  doc.setFont("helvetica", "normal").setFontSize(11.5).setTextColor(...INK);
  doc.text(changeLines, MARGIN + 24, y + 44, { lineHeightFactor: 1.35 });

  drawFooters(doc, input.date);
  const stamp = input.date.toISOString().slice(0, 10);
  doc.save(`Objection Playbook - ${clean(input.merchant).replace(/[\/:*?"<>|]/g, "")} - ${stamp}.pdf`);
}

export type AppointmentPlanPdfInput = {
  vertical: string;
  merchant: string;
  ask: string;
  qualify: string;
  confirm: string;
  handoff: string;
  invite: string;
  coachVerdictLabel: string;
  coachVerdict: "strong" | "close" | "needs_work";
  oneChange: string;
  date: Date;
};

// One merchant's booking plan (Module 7) to keep next to the phone.
export async function downloadAppointmentPlanPdf(input: AppointmentPlanPdfInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN * 2;
  const dateText = input.date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  drawHeader(doc, `BOOKING PLAN  |  ${clean(input.vertical).toUpperCase()}`, clean(input.merchant), dateText);

  let y = 150;
  const ensureRoom = (needed: number) => {
    if (y + needed > pageH - FOOTER_SPACE) {
      doc.addPage();
      y = MARGIN;
    }
  };
  const section = (label: string, text: string, opts: { quote?: boolean; pill?: boolean } = {}) => {
    const size = opts.quote ? 14 : 11.5;
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size);
    const lines = doc.splitTextToSize(opts.quote ? `"${clean(text)}"` : clean(text), contentW) as string[];
    ensureRoom(40 + lines.length * (size + 5));
    doc.setDrawColor(...LINE).setLineWidth(0.75).line(MARGIN, y, pageW - MARGIN, y);
    y += 22;
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...MUTED);
    doc.text(label, MARGIN, y, { charSpace: 1.2 });
    if (opts.pill) drawPill(doc, input.coachVerdictLabel, input.coachVerdict, MARGIN + doc.getTextWidth(label) + label.length * 1.2 + 10, y);
    y += 20;
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size).setTextColor(...INK);
    doc.text(lines, MARGIN, y, { lineHeightFactor: 1.35 });
    y += lines.length * (size + 5) + 12;
  };
  const callout = (label: string, text: string) => {
    doc.setFont("helvetica", "normal").setFontSize(11.5);
    const lines = doc.splitTextToSize(clean(text), contentW - 44) as string[];
    const boxH = 52 + lines.length * 16;
    ensureRoom(boxH + 10);
    doc.setFillColor(...TINT).rect(MARGIN, y, contentW, boxH, "F");
    doc.setFillColor(...LIME).rect(MARGIN, y, 5, boxH, "F");
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...GREEN);
    doc.text(label, MARGIN + 24, y + 24, { charSpace: 1.2 });
    doc.setFont("helvetica", "normal").setFontSize(11.5).setTextColor(...INK);
    doc.text(lines, MARGIN + 24, y + 44, { lineHeightFactor: 1.35 });
    y += boxH + 18;
  };

  section("THE ASK", input.ask, { quote: true, pill: true });
  section("QUALIFICATION CHECK", input.qualify);
  section("LOCKING IT IN", input.confirm);
  section("HANDOFF NOTE", input.handoff);
  y += 4;
  callout("CALENDAR INVITE", input.invite);
  callout("BEFORE YOU CALL", input.oneChange);

  drawFooters(doc, input.date);
  const stamp = input.date.toISOString().slice(0, 10);
  doc.save(`Booking Plan - ${clean(input.merchant).replace(/[\/:*?"<>|]/g, "")} - ${stamp}.pdf`);
}

export type FollowUpPlanPdfInput = {
  vertical: string;
  merchant: string;
  situation: string;
  message: string;
  cadence: string;
  stopRule: string;
  lastMessage: string;
  coachVerdictLabel: string;
  coachVerdict: "strong" | "close" | "needs_work";
  oneChange: string;
  date: Date;
};

// One merchant's follow-up plan (Module 8).
export async function downloadFollowUpPlanPdf(input: FollowUpPlanPdfInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN * 2;
  const dateText = input.date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  drawHeader(doc, `FOLLOW-UP PLAN  |  ${clean(input.vertical).toUpperCase()}`, clean(input.merchant), dateText);

  let y = 150;
  const ensureRoom = (needed: number) => {
    if (y + needed > pageH - FOOTER_SPACE) {
      doc.addPage();
      y = MARGIN;
    }
  };
  const section = (label: string, text: string, opts: { quote?: boolean; pill?: boolean } = {}) => {
    const size = opts.quote ? 14 : 11.5;
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size);
    const lines = doc.splitTextToSize(opts.quote ? `"${clean(text)}"` : clean(text), contentW) as string[];
    ensureRoom(40 + lines.length * (size + 5));
    doc.setDrawColor(...LINE).setLineWidth(0.75).line(MARGIN, y, pageW - MARGIN, y);
    y += 22;
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...MUTED);
    doc.text(label, MARGIN, y, { charSpace: 1.2 });
    if (opts.pill) drawPill(doc, input.coachVerdictLabel, input.coachVerdict, MARGIN + doc.getTextWidth(label) + label.length * 1.2 + 10, y);
    y += 20;
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size).setTextColor(...INK);
    doc.text(lines, MARGIN, y, { lineHeightFactor: 1.35 });
    y += lines.length * (size + 5) + 12;
  };

  section("WHERE THINGS STAND", input.situation, { pill: true });
  section("NEXT FOLLOW-UP", input.message, { quote: true });
  section("CADENCE", input.cadence);
  section("CLOSING THE FILE", input.stopRule);
  section("IF THEY STAY QUIET", input.lastMessage, { quote: true });

  // Before-you-send callout
  doc.setFont("helvetica", "normal").setFontSize(11.5);
  const changeLines = doc.splitTextToSize(clean(input.oneChange), contentW - 44) as string[];
  const boxH = 52 + changeLines.length * 16;
  ensureRoom(boxH + 10);
  y += 4;
  doc.setFillColor(...TINT).rect(MARGIN, y, contentW, boxH, "F");
  doc.setFillColor(...LIME).rect(MARGIN, y, 5, boxH, "F");
  doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...GREEN);
  doc.text("BEFORE YOU SEND", MARGIN + 24, y + 24, { charSpace: 1.2 });
  doc.setFont("helvetica", "normal").setFontSize(11.5).setTextColor(...INK);
  doc.text(changeLines, MARGIN + 24, y + 44, { lineHeightFactor: 1.35 });

  drawFooters(doc, input.date);
  const stamp = input.date.toISOString().slice(0, 10);
  doc.save(`Follow-Up Plan - ${clean(input.merchant).replace(/[\/:*?"<>|]/g, "")} - ${stamp}.pdf`);
}

export type ConsistencyPlanPdfInput = {
  numbers: string;
  ratios: string;
  inputs: string;
  leak: string;
  habit: string;
  story: string;
  mondayStart: string;
  coachVerdictLabel: string;
  coachVerdict: "strong" | "close" | "needs_work";
  oneChange: string;
  date: Date;
};

// A rep's weekly consistency plan (Module 9).
export async function downloadConsistencyPlanPdf(input: ConsistencyPlanPdfInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN * 2;
  const dateText = input.date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  drawHeader(doc, "CONSISTENCY PLAN  |  NEXT WEEK", clean(input.numbers), dateText);

  let y = 150;
  const ensureRoom = (needed: number) => {
    if (y + needed > pageH - FOOTER_SPACE) {
      doc.addPage();
      y = MARGIN;
    }
  };
  const section = (label: string, text: string, opts: { quote?: boolean; pill?: boolean } = {}) => {
    const size = opts.quote ? 14 : 11.5;
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size);
    const lines = doc.splitTextToSize(clean(text), contentW) as string[];
    ensureRoom(40 + lines.length * (size + 5));
    doc.setDrawColor(...LINE).setLineWidth(0.75).line(MARGIN, y, pageW - MARGIN, y);
    y += 22;
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...MUTED);
    doc.text(label, MARGIN, y, { charSpace: 1.2 });
    if (opts.pill) drawPill(doc, input.coachVerdictLabel, input.coachVerdict, MARGIN + doc.getTextWidth(label) + label.length * 1.2 + 10, y);
    y += 20;
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size).setTextColor(...INK);
    doc.text(lines, MARGIN, y, { lineHeightFactor: 1.35 });
    y += lines.length * (size + 5) + 12;
  };

  section("YOUR RATIOS", input.ratios, { pill: true });
  section("INPUT GOALS", input.inputs);
  section("THE LEAK AND THE FIX", input.leak);
  section("FIRST-DIAL HABIT", input.habit);
  section("THE STORY, REWRITTEN", input.story);
  section("MONDAY MORNING", input.mondayStart, { quote: true });

  // One-change callout
  doc.setFont("helvetica", "normal").setFontSize(11.5);
  const changeLines = doc.splitTextToSize(clean(input.oneChange), contentW - 44) as string[];
  const boxH = 52 + changeLines.length * 16;
  ensureRoom(boxH + 10);
  y += 4;
  doc.setFillColor(...TINT).rect(MARGIN, y, contentW, boxH, "F");
  doc.setFillColor(...LIME).rect(MARGIN, y, 5, boxH, "F");
  doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...GREEN);
  doc.text("ONE CHANGE FOR NEXT WEEK", MARGIN + 24, y + 24, { charSpace: 1.2 });
  doc.setFont("helvetica", "normal").setFontSize(11.5).setTextColor(...INK);
  doc.text(changeLines, MARGIN + 24, y + 44, { lineHeightFactor: 1.35 });

  drawFooters(doc, input.date);
  const stamp = input.date.toISOString().slice(0, 10);
  doc.save(`Consistency Plan - ${stamp}.pdf`);
}

export type GatekeeperPlanPdfInput = {
  vertical: string;
  merchant: string;
  answerer: string;
  intro: string;
  help: string;
  theNo: string;
  ally: string;
  ownerOpener: string;
  coachVerdictLabel: string;
  coachVerdict: "strong" | "close" | "needs_work";
  oneChange: string;
  date: Date;
};

// One business's front-desk plan (Module 10).
export async function downloadGatekeeperPlanPdf(input: GatekeeperPlanPdfInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN * 2;
  const dateText = input.date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  drawHeader(doc, `FRONT-DESK PLAN  |  ${clean(input.vertical).toUpperCase()}`, clean(input.merchant), dateText);

  let y = 150;
  const ensureRoom = (needed: number) => {
    if (y + needed > pageH - FOOTER_SPACE) {
      doc.addPage();
      y = MARGIN;
    }
  };
  const section = (label: string, text: string, opts: { quote?: boolean; pill?: boolean } = {}) => {
    const size = opts.quote ? 14 : 11.5;
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size);
    const lines = doc.splitTextToSize(opts.quote ? `"${clean(text)}"` : clean(text), contentW) as string[];
    ensureRoom(40 + lines.length * (size + 5));
    doc.setDrawColor(...LINE).setLineWidth(0.75).line(MARGIN, y, pageW - MARGIN, y);
    y += 22;
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...MUTED);
    doc.text(label, MARGIN, y, { charSpace: 1.2 });
    if (opts.pill) drawPill(doc, input.coachVerdictLabel, input.coachVerdict, MARGIN + doc.getTextWidth(label) + label.length * 1.2 + 10, y);
    y += 20;
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size).setTextColor(...INK);
    doc.text(lines, MARGIN, y, { lineHeightFactor: 1.35 });
    y += lines.length * (size + 5) + 12;
  };

  section("WHO ANSWERS", input.answerer, { pill: true });
  section("INTRODUCTION", input.intro);
  section("ASKING FOR HELP", input.help);
  section("WHEN IT'S A NO", input.theNo);
  section("MAKING AN ALLY", input.ally);
  section("ONCE YOU'RE PUT THROUGH", input.ownerOpener, { quote: true });

  // Before-you-call callout
  doc.setFont("helvetica", "normal").setFontSize(11.5);
  const changeLines = doc.splitTextToSize(clean(input.oneChange), contentW - 44) as string[];
  const boxH = 52 + changeLines.length * 16;
  ensureRoom(boxH + 10);
  y += 4;
  doc.setFillColor(...TINT).rect(MARGIN, y, contentW, boxH, "F");
  doc.setFillColor(...LIME).rect(MARGIN, y, 5, boxH, "F");
  doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...GREEN);
  doc.text("BEFORE YOU CALL", MARGIN + 24, y + 24, { charSpace: 1.2 });
  doc.setFont("helvetica", "normal").setFontSize(11.5).setTextColor(...INK);
  doc.text(changeLines, MARGIN + 24, y + 44, { lineHeightFactor: 1.35 });

  drawFooters(doc, input.date);
  const stamp = input.date.toISOString().slice(0, 10);
  doc.save(`Front-Desk Plan - ${clean(input.merchant).replace(/[\/:*?"<>|]/g, "")} - ${stamp}.pdf`);
}

export type CallLabPdfInput = {
  vertical: string;
  merchant: string;
  answerer: string;
  setup: string;
  opening: string;
  objection: string;
  ask: string;
  moves: { label: string; hit: boolean }[];
  curveball: string;
  curveballAnswer: string;
  coachVerdictLabel: string;
  coachVerdict: "strong" | "close" | "needs_work";
  oneChange: string;
  date: Date;
};

// One business's call lab (Module 11).
export async function downloadCallLabPdf(input: CallLabPdfInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN * 2;
  const dateText = input.date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  drawHeader(doc, `CALL LAB  |  ${clean(input.vertical).toUpperCase()}`, clean(input.merchant), dateText);

  let y = 150;
  const ensureRoom = (needed: number) => {
    if (y + needed > pageH - FOOTER_SPACE) {
      doc.addPage();
      y = MARGIN;
    }
  };
  const label = (text: string, pill = false) => {
    doc.setDrawColor(...LINE).setLineWidth(0.75).line(MARGIN, y, pageW - MARGIN, y);
    y += 22;
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...MUTED);
    doc.text(text, MARGIN, y, { charSpace: 1.2 });
    if (pill) drawPill(doc, input.coachVerdictLabel, input.coachVerdict, MARGIN + doc.getTextWidth(text) + text.length * 1.2 + 10, y);
    y += 20;
  };
  const section = (title: string, text: string, opts: { quote?: boolean; pill?: boolean } = {}) => {
    const size = opts.quote ? 14 : 11.5;
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size);
    const lines = doc.splitTextToSize(opts.quote ? `"${clean(text)}"` : clean(text), contentW) as string[];
    ensureRoom(40 + lines.length * (size + 5));
    label(title, opts.pill);
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size).setTextColor(...INK);
    doc.text(lines, MARGIN, y, { lineHeightFactor: 1.35 });
    y += lines.length * (size + 5) + 12;
  };

  section("WHO ANSWERS", input.answerer, { pill: true });
  section("THE SETUP", input.setup);
  section("THE OPENING", input.opening);
  section("THE HARD MOMENT", input.objection);
  section("THE ASK", input.ask);

  // Five moves: a filled dot (hit) or an open red dot (missed) beside each.
  const hit = input.moves.filter((m) => m.hit).length;
  ensureRoom(46 + input.moves.length * 20);
  label(`THE FIVE MOVES  |  ${hit} OF ${input.moves.length}`);
  doc.setFont("helvetica", "normal").setFontSize(11.5);
  for (const m of input.moves) {
    if (m.hit) doc.setFillColor(...GREEN).circle(MARGIN + 5, y - 4, 4.5, "F");
    else doc.setDrawColor(163, 50, 11).setLineWidth(1.4).circle(MARGIN + 5, y - 4, 4, "S");
    doc.setTextColor(...INK).text(`${clean(m.label)}${m.hit ? "" : "  (missed)"}`, MARGIN + 18, y);
    y += 20;
  }
  y += 4;

  section("CURVEBALL TO PRACTICE", input.curveball, { quote: true });
  section("YOU COULD SAY", input.curveballAnswer, { quote: true });

  // Before-you-call callout
  doc.setFont("helvetica", "normal").setFontSize(11.5);
  const changeLines = doc.splitTextToSize(clean(input.oneChange), contentW - 44) as string[];
  const boxH = 52 + changeLines.length * 16;
  ensureRoom(boxH + 10);
  y += 4;
  doc.setFillColor(...TINT).rect(MARGIN, y, contentW, boxH, "F");
  doc.setFillColor(...LIME).rect(MARGIN, y, 5, boxH, "F");
  doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...GREEN);
  doc.text("BEFORE YOU CALL", MARGIN + 24, y + 24, { charSpace: 1.2 });
  doc.setFont("helvetica", "normal").setFontSize(11.5).setTextColor(...INK);
  doc.text(changeLines, MARGIN + 24, y + 44, { lineHeightFactor: 1.35 });

  drawFooters(doc, input.date);
  const stamp = input.date.toISOString().slice(0, 10);
  doc.save(`Call Lab - ${clean(input.merchant).replace(/[\/:*?"<>|]/g, "")} - ${stamp}.pdf`);
}

// Shared body for the plain "label, then text" PDFs below: a section writer
// that adds pages as needed, and the tinted callout box at the end.
function sectionWriter(doc: JsPDF, startY: number, pillLabel: string, pillVerdict: ReflectionPdfInput["verdict"]) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN * 2;
  let y = startY;
  const ensureRoom = (needed: number) => {
    if (y + needed > pageH - FOOTER_SPACE) {
      doc.addPage();
      y = MARGIN;
    }
  };
  const section = (label: string, text: string, opts: { quote?: boolean; pill?: boolean; color?: [number, number, number] } = {}) => {
    const size = opts.quote ? 14 : 11.5;
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size);
    const lines = doc.splitTextToSize(opts.quote ? `"${clean(text)}"` : clean(text), contentW) as string[];
    ensureRoom(40 + lines.length * (size + 5));
    doc.setDrawColor(...LINE).setLineWidth(0.75).line(MARGIN, y, pageW - MARGIN, y);
    y += 22;
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...(opts.color ?? MUTED));
    doc.text(label, MARGIN, y, { charSpace: 1.2 });
    if (opts.pill) drawPill(doc, pillLabel, pillVerdict, MARGIN + doc.getTextWidth(label) + label.length * 1.2 + 10, y);
    y += 20;
    doc.setFont(opts.quote ? "times" : "helvetica", "normal").setFontSize(size).setTextColor(...INK);
    doc.text(lines, MARGIN, y, { lineHeightFactor: 1.35 });
    y += lines.length * (size + 5) + 12;
  };
  const callout = (label: string, text: string) => {
    doc.setFont("helvetica", "normal").setFontSize(11.5);
    const lines = doc.splitTextToSize(clean(text), contentW - 44) as string[];
    const boxH = 52 + lines.length * 16;
    ensureRoom(boxH + 10);
    y += 4;
    doc.setFillColor(...TINT).rect(MARGIN, y, contentW, boxH, "F");
    doc.setFillColor(...LIME).rect(MARGIN, y, 5, boxH, "F");
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...GREEN);
    doc.text(label, MARGIN + 24, y + 24, { charSpace: 1.2 });
    doc.setFont("helvetica", "normal").setFontSize(11.5).setTextColor(...INK);
    doc.text(lines, MARGIN + 24, y + 44, { lineHeightFactor: 1.35 });
    y += boxH + 10;
  };
  return { section, callout };
}

export type FinalScenarioPdfInput = {
  business: string;
  vertical: string;
  profile: string;
  objectionGiven: string;
  timing: string;
  frontDesk: string;
  opener: string;
  objection: string;
  ask: string;
  followUp: string;
  sections: { title: string; good: boolean }[];
  strength: string;
  coachVerdictLabel: string;
  coachVerdict: "strong" | "close" | "needs_work";
  oneChange: string;
  date: Date;
};

// One attempt at the certification call (Module 12). Parts the coach marked
// for a fix are labeled in red.
export async function downloadFinalScenarioPdf(input: FinalScenarioPdfInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });
  const dateText = input.date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  drawHeader(doc, `FINAL SCENARIO CALL  |  ${clean(input.vertical).toUpperCase()}`, clean(input.business), dateText);

  const { section, callout } = sectionWriter(doc, 150, input.coachVerdictLabel, input.coachVerdict);
  const fix = (title: string) => input.sections.find((s) => s.title === title)?.good === false;
  const part = (title: string, text: string) => section(fix(title) ? `${title.toUpperCase()}  |  NEEDS A FIX` : title.toUpperCase(), text, { color: fix(title) ? [163, 50, 11] : undefined });

  section("THE MERCHANT", `${input.profile} Objection: "${input.objectionGiven}"`, { pill: true });
  part("Timing and reason", input.timing);
  part("The front desk", input.frontDesk);
  part("Opener and discovery", input.opener);
  part("The objection", input.objection);
  part("The ask", input.ask);
  part("The follow-up", input.followUp);
  section("BEST PART", input.strength);
  callout(input.coachVerdict === "strong" ? "PROTECT THIS ON LIVE CALLS" : "THE MOST IMPORTANT FIX", input.oneChange);

  drawFooters(doc, input.date);
  const stamp = input.date.toISOString().slice(0, 10);
  doc.save(`Final Scenario - ${clean(input.business).replace(/[\/:*?"<>|]/g, "")} - ${stamp}.pdf`);
}

export type ActionPlanPdfInput = {
  inputs: string;
  focus: string;
  score: string;
  badWeek: string;
  dayOne: string;
  coachVerdictLabel: string;
  coachVerdict: "strong" | "close" | "needs_work";
  oneChange: string;
  date: Date;
};

// The rep's plan for the 30 days after certification (Module 12).
export async function downloadActionPlanPdf(input: ActionPlanPdfInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });
  const dateText = input.date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  drawHeader(doc, "30-DAY ACTION PLAN", "My next 30 days", dateText);

  const { section, callout } = sectionWriter(doc, 150, input.coachVerdictLabel, input.coachVerdict);
  section("DAILY INPUTS", input.inputs, { pill: true });
  section("ONE SKILL A WEEK", input.focus);
  section("KEEPING SCORE", input.score);
  section("THE BAD WEEK", input.badWeek);
  section("DAY ONE", input.dayOne, { quote: true });
  callout("ONE CHANGE TO YOUR PLAN", input.oneChange);

  drawFooters(doc, input.date);
  const stamp = input.date.toISOString().slice(0, 10);
  doc.save(`30-Day Action Plan - ${stamp}.pdf`);
}

export type CertificatePdfInput = { name: string; certifiedOn: Date; examScore: string };

// The Appointment-Setter Certification: landscape, one page.
export async function downloadCertificatePdf(input: CertificatePdfInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "landscape" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  const cx = w / 2;
  const dateText = input.certifiedOn.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  doc.setFillColor(...GREEN).rect(0, 0, w, h, "F");
  doc.setFillColor(255, 255, 255).rect(28, 28, w - 56, h - 56, "F");
  doc.setDrawColor(...LIME).setLineWidth(3).rect(40, 40, w - 80, h - 80, "S");

  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(...GREEN);
  doc.text(BRAND.name.toUpperCase(), cx, 108, { align: "center", charSpace: 2 });
  doc.setFont("times", "normal").setFontSize(38).setTextColor(...INK);
  doc.text("Appointment-Setter Certification", cx, 168, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(12).setTextColor(...MUTED);
  doc.text("This certifies that", cx, 222, { align: "center" });
  doc.setFont("times", "italic").setFontSize(34).setTextColor(...GREEN);
  doc.text(clean(input.name) || `${BRAND.name} graduate`, cx, 272, { align: "center" });
  doc.setDrawColor(...LINE).setLineWidth(0.75).line(cx - 200, 288, cx + 200, 288);
  doc.setFont("helvetica", "normal").setFontSize(12).setTextColor(...INK);
  const body = doc.splitTextToSize(`has completed all twelve modules of the ${BRAND.name} cold-calling program, passed the final scenario call and the final exam, and committed to a 30-day action plan.`, 480) as string[];
  doc.text(body, cx, 320, { align: "center", lineHeightFactor: 1.5 });

  doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...MUTED);
  doc.text("CERTIFIED ON", cx - 150, h - 112, { align: "center", charSpace: 1.2 });
  doc.text("FINAL EXAM", cx + 150, h - 112, { align: "center", charSpace: 1.2 });
  doc.setFont("times", "normal").setFontSize(16).setTextColor(...INK);
  doc.text(dateText, cx - 150, h - 90, { align: "center" });
  doc.text(clean(input.examScore), cx + 150, h - 90, { align: "center" });

  const stamp = input.certifiedOn.toISOString().slice(0, 10);
  doc.save(`Appointment-Setter Certification - ${clean(input.name).replace(/[\/:*?"<>|]/g, "")} - ${stamp}.pdf`);
}
