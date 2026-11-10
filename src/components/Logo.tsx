import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function Logo({ light = false }: { light?: boolean }) {
  const sub = { fontSize: 10, letterSpacing: ".18em", color: light ? "#b8cbc4" : "var(--green)" };
  if (BRAND.id === "kadima") {
    return (
      <Link href="/" aria-label={BRAND.name} style={{ display: "inline-flex", flexDirection: "column", gap: 6, color: light ? "white" : "var(--ink)" }}>
        <KadimaWordmark height={26} />
        <span style={{ ...sub, fontWeight: 900, lineHeight: 1 }}>{BRAND.logoBottom}</span>
      </Link>
    );
  }
  return (
    <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 11, color: light ? "white" : "var(--ink)" }}>
      <span style={{ width: 34, height: 34, borderRadius: 10, background: "var(--lime)", display: "grid", placeItems: "center", color: "var(--ink)", fontWeight: 900 }}>M</span>
      <span style={{ fontWeight: 900, lineHeight: .92, letterSpacing: "-.03em" }}>{BRAND.logoTop}<br/><span style={sub}>{BRAND.logoBottom}</span></span>
    </Link>
  );
}

// Kadima Payments wordmark (from their logo file). The letters take the text
// color, so it reads on dark and light backgrounds; the arrow keeps its gradient.
const KADIMA_PATHS = [
  "M306.94,188.57c0-58.11,35.58-101.99,86.58-101.99,29.25,0,52.58,13.44,64.83,34.39v-31.23h54.95v162.87c0,13.44.79,24.51,2.37,34.79h-55.35c-1.58-9.09-2.37-18.98-2.37-30.44-12.26,20.55-35.58,33.6-64.44,33.6-51,0-86.58-43.88-86.58-101.99ZM458.35,188.57c0-32.81-17.79-57.72-46.65-57.72s-46.25,24.9-46.25,57.72,17.79,57.72,46.25,57.72,46.65-24.91,46.65-57.72Z",
  "M537.27,188.57c0-58.11,35.58-101.99,86.58-101.99,28.46,0,51,12.25,63.65,32.42V2.77h56.14v284.63h-54.95v-31.23c-12.26,20.95-35.58,34.39-64.83,34.39-51,0-86.58-43.88-86.58-101.99ZM688.68,188.57c0-32.81-17.79-57.72-46.65-57.72s-46.25,24.9-46.25,57.72,17.79,57.72,46.25,57.72,46.65-24.91,46.65-57.72Z",
  "M773.14,32.81c0-19.37,14.23-32.81,33.21-32.81s33.21,13.44,33.21,32.81-14.23,32.81-33.21,32.81-33.21-13.44-33.21-32.81ZM777.88,89.74h57.32v197.66h-57.32V89.74Z",
  "M869.05,89.74h55.35v30.44c11.07-22.14,32.02-34.39,57.32-34.39,27.28,0,48.23,13.84,58.11,37.55,13.05-24.11,34.39-37.55,62.07-37.55,18.58,0,34.79,6.72,45.86,18.98,11.07,12.25,18.58,30.04,18.58,56.93v125.71h-57.32v-114.64c0-14.63-3.16-24.12-8.3-29.25-5.14-5.93-11.86-8.3-20.56-8.3-21.35,0-34,16.6-34,45.86v106.34h-57.32v-114.64c0-14.63-2.77-24.12-7.91-29.25-5.14-5.93-12.26-8.3-20.95-8.3-21.35,0-33.6,16.6-33.6,45.86v106.34h-57.32V89.74Z",
  "M1187.94,188.57c0-58.11,35.58-101.99,86.58-101.99,29.25,0,52.58,13.44,64.83,34.39v-31.23h54.95v162.87c0,13.44.79,24.51,2.37,34.79h-55.34c-1.58-9.09-2.37-18.98-2.37-30.44-12.26,20.55-35.58,33.6-64.44,33.6-51,0-86.58-43.88-86.58-101.99ZM1339.35,188.57c0-32.81-17.79-57.72-46.65-57.72s-46.25,24.9-46.25,57.72,17.79,57.72,46.25,57.72,46.65-24.91,46.65-57.72Z",
  "M189.42,155.12l132.27,132.27h-82.9l-100.86-100.83v100.83h-58.63v-51.46c0-44.63,36.18-80.81,80.81-80.81h29.3Z",
  "M189.42,135.08h-29.3c-44.63,0-80.81-36.18-80.81-80.81V2.76s58.63,0,58.63,0v100.86L238.8,2.76h82.9l-132.27,132.31Z",
];

export function KadimaWordmark({ height }: { height: number }) {
  return (
    <svg viewBox="0 0 1396.67 290.56" height={height} width={height * 1396.67 / 290.56} role="img" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <linearGradient id="kadima-arrow" x1="46.14" y1="213.1" x2="46.14" y2="68.92" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#31be72" />
          <stop offset="1" stopColor="#27a9e2" />
        </linearGradient>
      </defs>
      {KADIMA_PATHS.map((d, i) => <path key={i} fill="currentColor" d={d} />)}
      <polygon fill="url(#kadima-arrow)" points="92.27 145.28 0 67.61 0 222.95 92.27 145.28" />
    </svg>
  );
}
