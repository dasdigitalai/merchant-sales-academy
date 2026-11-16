import Link from "next/link";
import { Logo } from "./Logo";
import { ArrowIcon } from "./ArrowIcon";

export function PublicNav() {
  return (
    <header style={{ borderBottom: "1px solid #343733", background: "rgba(10,11,10,.96)", color: "white", position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(12px)" }}>
      <div className="container" style={{ height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo light />
        <nav className="desktop-only" style={{ display: "flex", gap: 32, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 900, color: "#a9b0a6" }}>
          <Link href="#curriculum">Training system</Link><Link href="#how">The call lab</Link><Link href="#teams">For leaders</Link>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link className="desktop-only" href="/signin" style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 900, padding: 12 }}>Sign in</Link>
          <Link className="btn btn-lime" href="/register">Enter call lab <ArrowIcon /></Link>
        </div>
      </div>
    </header>
  );
}
