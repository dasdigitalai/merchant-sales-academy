import {
  addDoc, collection, deleteDoc, doc, writeBatch, getDoc, getDocs, increment, orderBy, query, serverTimestamp, setDoc, Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Firestore data model (rules in firestore.rules):
//   invites/{email}                   who may register, and with which role (managers write)
//   users/{uid}                       profile: name, email, role
//   users/{uid}/progress/{module__item}  completed lessons, exercises and passed quizzes
//   users/{uid}/moduleTime/{moduleSlug}  active seconds spent in each module
//   users/{uid}/days/{YYYY-MM-DD}        active seconds per day (streaks, weekly activity)
//   users/{uid}/journal/{id}             saved reflections, call plans, openers, pitch cards, discovery plans, objection playbooks, booking plans, follow-up plans, consistency plans, front-desk plans, call labs, final scenario calls, action plans and practice calls
//   users/{uid}/quizResults/{id}         every knowledge-check attempt
// Reps read and write only their own data; managers can read everyone's.

export type Role = "rep" | "manager";
export type Profile = { uid: string; email: string; firstName: string; lastName: string; role: Role };
export type Invite = { email: string; role: Role; invitedByName: string; createdAt: Date | null };
export type ProgressItem = { moduleSlug: string; itemId: string; completedAt: Date | null };
export type JournalType = "reflection" | "call-plan" | "opener" | "pitch-card" | "discovery-plan" | "objection-playbook" | "appointment-plan" | "follow-up-plan" | "consistency-plan" | "gatekeeper-plan" | "call-lab" | "final-scenario" | "action-plan" | "roleplay";
export type JournalEntry = { id: string; type: JournalType; moduleSlug: string; title: string; data: Record<string, unknown>; createdAt: Date | null };
export type QuizResult = { id: string; moduleSlug: string; score: number; total: number; passed: boolean; createdAt: Date | null };
export type LearnerData = {
  progress: ProgressItem[];
  moduleTime: Record<string, number>;
  days: Record<string, number>;
  journal: JournalEntry[];
  quizResults: QuizResult[];
};

const toDate = (v: unknown) => (v instanceof Timestamp ? v.toDate() : null);
export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const fullName = (p: Pick<Profile, "firstName" | "lastName">) => `${p.firstName} ${p.lastName}`.trim();
// Local calendar day, so a rep's evening session counts toward that day.
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export async function loadProfile(uid: string): Promise<Profile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  return { uid, email: d.email, firstName: d.firstName, lastName: d.lastName, role: d.role };
}

// Fails with permission-denied unless an invite exists for this email with this role.
export async function createProfile(uid: string, email: string, firstName: string, lastName: string) {
  const inviteSnap = await getDoc(doc(db, "invites", normalizeEmail(email)));
  const role: Role = inviteSnap.exists() ? inviteSnap.data().role : "rep";
  await setDoc(doc(db, "users", uid), { email: normalizeEmail(email), firstName: firstName.trim(), lastName: lastName.trim(), role, createdAt: serverTimestamp() });
}

export async function listUsers(): Promise<Profile[]> {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<Profile, "uid">) })).sort((a, b) => fullName(a).localeCompare(fullName(b)));
}

export async function listInvites(): Promise<Invite[]> {
  const snap = await getDocs(collection(db, "invites"));
  return snap.docs.map((d) => ({ email: d.id, role: d.data().role, invitedByName: d.data().invitedByName ?? "", createdAt: toDate(d.data().createdAt) }));
}

export async function createInvite(email: string, role: Role, invitedBy: Profile) {
  await setDoc(doc(db, "invites", normalizeEmail(email)), { role, invitedBy: invitedBy.uid, invitedByName: fullName(invitedBy), createdAt: serverTimestamp() });
}

export async function deleteInvite(email: string) {
  await deleteDoc(doc(db, "invites", normalizeEmail(email)));
}

// Removes someone from the program: all their training data, their invite and
// their profile. Rules only allow this for a manager who re-entered their
// password in the last 5 minutes. Their sign-in account itself stays in
// Firebase Authentication, but without a profile or invite it has no access.
export async function removeUser(p: Profile) {
  const subs = ["progress", "moduleTime", "days", "journal", "quizResults"];
  const snaps = await Promise.all(subs.map((name) => getDocs(collection(db, "users", p.uid, name))));
  const refs = snaps.flatMap((s) => s.docs.map((d) => d.ref));
  for (let i = 0; i < refs.length; i += 450) {
    const batch = writeBatch(db);
    refs.slice(i, i + 450).forEach((r) => batch.delete(r));
    await batch.commit();
  }
  await deleteDoc(doc(db, "invites", normalizeEmail(p.email)));
  await deleteDoc(doc(db, "users", p.uid));
}

export async function markComplete(uid: string, moduleSlug: string, itemId: string) {
  await setDoc(doc(db, "users", uid, "progress", `${moduleSlug}__${itemId}`), { moduleSlug, itemId, completedAt: serverTimestamp() });
}

export async function markIncomplete(uid: string, moduleSlug: string, itemId: string) {
  await deleteDoc(doc(db, "users", uid, "progress", `${moduleSlug}__${itemId}`));
}

export async function isComplete(uid: string, moduleSlug: string, itemId: string) {
  return (await getDoc(doc(db, "users", uid, "progress", `${moduleSlug}__${itemId}`))).exists();
}

export async function addActiveTime(uid: string, moduleSlug: string, seconds: number) {
  if (seconds <= 0) return;
  await Promise.all([
    setDoc(doc(db, "users", uid, "moduleTime", moduleSlug), { seconds: increment(seconds), updatedAt: serverTimestamp() }, { merge: true }),
    setDoc(doc(db, "users", uid, "days", dayKey()), { seconds: increment(seconds) }, { merge: true }),
  ]);
}

export async function saveJournal(uid: string, entry: { type: JournalType; moduleSlug: string; title: string; data: Record<string, unknown> }) {
  await addDoc(collection(db, "users", uid, "journal"), { ...entry, createdAt: serverTimestamp() });
}

export async function saveQuizResult(uid: string, r: { moduleSlug: string; score: number; total: number; passed: boolean }) {
  await addDoc(collection(db, "users", uid, "quizResults"), { ...r, createdAt: serverTimestamp() });
}

export async function loadLearnerData(uid: string): Promise<LearnerData> {
  const sub = (name: string) => collection(db, "users", uid, name);
  const [progress, moduleTime, days, journal, quizResults] = await Promise.all([
    getDocs(sub("progress")),
    getDocs(sub("moduleTime")),
    getDocs(sub("days")),
    getDocs(query(sub("journal"), orderBy("createdAt", "desc"))),
    getDocs(query(sub("quizResults"), orderBy("createdAt", "desc"))),
  ]);
  return {
    progress: progress.docs.map((d) => ({ moduleSlug: d.data().moduleSlug, itemId: d.data().itemId, completedAt: toDate(d.data().completedAt) })),
    moduleTime: Object.fromEntries(moduleTime.docs.map((d) => [d.id, d.data().seconds ?? 0])),
    days: Object.fromEntries(days.docs.map((d) => [d.id, d.data().seconds ?? 0])),
    journal: journal.docs.map((d) => ({ id: d.id, type: d.data().type, moduleSlug: d.data().moduleSlug, title: d.data().title, data: d.data().data ?? {}, createdAt: toDate(d.data().createdAt) })),
    quizResults: quizResults.docs.map((d) => ({ id: d.id, moduleSlug: d.data().moduleSlug, score: d.data().score, total: d.data().total, passed: d.data().passed, createdAt: toDate(d.data().createdAt) })),
  };
}
