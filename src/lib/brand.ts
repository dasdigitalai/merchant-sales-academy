// Which brand this deployment runs as. One codebase serves every brand: set
// NEXT_PUBLIC_BRAND in the deployment's environment (Vercel) and rebuild.
// Leave it unset for Merchant Sales Academy.

export type BrandId = "msa" | "kadima";
type RGB = [number, number, number];

export type Brand = {
  id: BrandId;
  name: string;            // "Merchant Sales Academy"
  logoTop: string;         // first line of the text logo (unused when a wordmark is drawn)
  logoBottom: string;      // second line, under the wordmark or text
  tagline: string;
  description: string;
  icon?: string;           // favicon in /public
  // CSS theme. Names are historical: "green" is the main brand color, "lime"
  // the bright accent, "orange" the second accent.
  colors: { ink: string; muted: string; cream: string; paper: string; green: string; greenDark: string; lime: string; orange: string; line: string };
  // Same palette for the downloadable PDFs.
  pdf: { green: RGB; lime: RGB; ink: RGB; muted: RGB; line: RGB; tint: RGB };
};

const BRANDS: Record<BrandId, Brand> = {
  msa: {
    id: "msa",
    name: "Merchant Sales Academy",
    logoTop: "MERCHANT SALES",
    logoBottom: "ACADEMY",
    tagline: "Make the Call",
    description: "Cold-calling training built for merchant-services sales professionals.",
    colors: { ink: "#0a0b0a", muted: "#626760", cream: "#ecece4", paper: "#f6f6ef", green: "#167e3b", greenDark: "#06391c", lime: "#c3dd63", orange: "#ff5c35", line: "#c9cbc1" },
    pdf: { green: [22, 126, 59], lime: [195, 221, 99], ink: [10, 11, 10], muted: [98, 103, 96], line: [201, 203, 193], tint: [242, 246, 231] },
  },
  // Kadima Payments: black, white, and the green-to-blue gradient from their logo.
  kadima: {
    id: "kadima",
    name: "Kadima Sales Academy",
    logoTop: "KADIMA",
    logoBottom: "SALES ACADEMY",
    tagline: "Make the Call",
    description: "Cold-calling training for the Kadima Payments sales team.",
    icon: "/brands/kadima-icon.svg",
    colors: { ink: "#0b0c0e", muted: "#5d646b", cream: "#e8edee", paper: "#f4f7f7", green: "#17804f", greenDark: "#08321f", lime: "#31be72", orange: "#27a9e2", line: "#cad3d4" },
    pdf: { green: [23, 128, 79], lime: [49, 190, 114], ink: [11, 12, 14], muted: [93, 100, 107], line: [202, 211, 212], tint: [232, 245, 238] },
  },
};

export const BRAND: Brand = BRANDS[(process.env.NEXT_PUBLIC_BRAND as BrandId) ?? "msa"] ?? BRANDS.msa;

export const themeCss = (c: Brand["colors"]) =>
  `:root{--ink:${c.ink};--muted:${c.muted};--cream:${c.cream};--paper:${c.paper};--green:${c.green};--green-dark:${c.greenDark};--lime:${c.lime};--orange:${c.orange};--line:${c.line}}`;
