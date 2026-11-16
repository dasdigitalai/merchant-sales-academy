"use client";
import { ArrowIcon } from "@/components/ArrowIcon";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ManagerShell } from "@/components/ManagerShell";
import { LearnerReport } from "@/components/LearnerReport";
import { fullName, loadProfile, type Profile } from "@/lib/db";

// A manager's view of one rep: time by module, scores, and everything they've saved.
export default function RepDetail() {
  return <ManagerShell><Detail /></ManagerShell>;
}

function Detail() {
  const { uid } = useParams<{ uid: string }>();
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  useEffect(() => { loadProfile(uid).then(setProfile).catch(() => setProfile(null)); }, [uid]);

  return <>
    <Link href="/manager" style={{ fontSize: 13, fontWeight: 800, color: "var(--green)" }}><ArrowIcon dir="left" /> Team overview</Link>
    {profile === undefined ? <p style={{ color: "var(--muted)" }}>Loading…</p> : profile === null ? <p>That person wasn&apos;t found.</p> : <>
      <div className="eyebrow" style={{ marginTop: 22 }}>{profile.role === "manager" ? "Manager" : "Rep"} · {profile.email}</div>
      <h1 className="display" style={{ fontSize: 38, margin: "13px 0 28px" }}>{fullName(profile)}</h1>
      <LearnerReport uid={uid} />
    </>}
  </>;
}
