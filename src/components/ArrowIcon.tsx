// Brand-gradient "up and right" arrow. Replaces the "↗" character, which iOS and
// Android render as a grey emoji tile. Drawn as a CSS mask (see .arrow-ico in
// globals.css) so it follows the brand colors and the font size of its parent.
export function ArrowIcon() {
  return <span className="arrow-ico" aria-hidden="true" />;
}
