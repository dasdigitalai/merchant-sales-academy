// Brand-gradient arrow. Replaces the "↗", "→", "←" and "›" characters, which iOS
// and Android render as grey emoji tiles or in a mismatched system font. Drawn as
// a CSS mask (see .arrow-ico in globals.css) so it follows the brand colors and
// the font size of its parent.
//   dir="ne"    up and right, for links that open something (default)
//   dir="right" forward / next
//   dir="left"  back
//   onDark      brighter gradient for dark backgrounds
export function ArrowIcon({ dir = "ne", onDark = false }: { dir?: "ne" | "right" | "left"; onDark?: boolean }) {
  const cls = ["arrow-ico", dir === "right" && "arrow-right", dir === "left" && "arrow-left", onDark && "arrow-on-dark"].filter(Boolean).join(" ");
  return <span className={cls} aria-hidden="true" />;
}
