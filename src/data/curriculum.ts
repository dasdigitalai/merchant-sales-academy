import { BRAND, type BrandId } from "@/lib/brand";

export type Lesson = { id: string; title: string; minutes: number; type: "lesson" | "exercise" | "quiz"; href?: string };

// Where a module item lives. Exercises and quizzes have their own routes
// (set via href); regular lessons live under the module's lesson route.
export function lessonHref(moduleSlug: string, lesson: Lesson) {
  return lesson.href ?? `/courses/${moduleSlug}/lessons/${lesson.id}`;
}

export type NavLink = { href: string; label: string; title: string };

// Previous/next for any item in a module (lesson, exercise or quiz), so every
// page in a module navigates the same way. The last item points to the next
// module's first item, or back to the catalog if that module isn't written yet.
// The last item of the certification module (Module 12's action plan) points to the certificate.
export function moduleNeighbors(moduleSlug: string, itemId: string) {
  const mIdx = modules.findIndex((m) => m.slug === moduleSlug);
  const module = modules[mIdx];
  const index = module.lessons.findIndex((l) => l.id === itemId);
  const kind = (l: Lesson) => (l.type === "exercise" ? "Practice" : l.type === "quiz" ? "Knowledge check" : "Lesson");
  const link = (l: Lesson): NavLink => ({ href: lessonHref(moduleSlug, l), label: kind(l), title: l.title });

  const prevItem = module.lessons[index - 1];
  const prev: NavLink = prevItem ? link(prevItem) : { href: `/courses/${moduleSlug}`, label: "Module overview", title: module.title };

  let next: NavLink;
  const nextItem = module.lessons[index + 1];
  if (nextItem) {
    next = link(nextItem);
  } else {
    const nextModule = modules[mIdx + 1];
    // The certification module always ends at the certificate, even when an
    // advanced module follows it (those are optional and sit outside it).
    next = module.slug === "certification"
      ? { href: "/certificate", label: "Certification", title: "Your certificate" }
      : nextModule && nextModule.lessons.length && nextModule.status !== "preview"
        ? { href: lessonHref(nextModule.slug, nextModule.lessons[0]), label: `Module ${nextModule.id}`, title: nextModule.title }
        : { href: "/courses", label: "All modules", title: "Back to the catalog" };
  }
  return { module, index, total: module.lessons.length, prev, next };
}
export type Module = {
  id: number; slug: string; title: string; description: string; lessons: Lesson[]; status: "active" | "locked" | "available" | "preview";
  // "advanced": builds on the core path but sits outside the Appointment-Setter
  // Certification, so it never blocks (or un-does) anyone's certificate.
  track?: "advanced";
  // Only these brands get the module; leave unset for every brand. Set it for
  // content that belongs to one company (see lib/brand.ts).
  brands?: BrandId[];
};
// "preview": written but not released. Only managers can open it (see PreviewGate),
// and it doesn't count toward reps' completion until it's switched to "available".

const allModules: Module[] = [
  { id: 1, slug: "understanding-call-reluctance", title: "Understanding Call Reluctance", description: "Recognize what is holding you back and learn how to separate personal rejection from a business outcome.", status: "available", lessons: [
    { id: "why-we-hesitate", title: "Why We Hesitate", minutes: 2, type: "lesson" },
    { id: "fear-of-rejection", title: "Fear of Rejection", minutes: 2, type: "lesson" },
    { id: "sounding-inexperienced", title: "Fear of Sounding Inexperienced", minutes: 2, type: "lesson" },
    { id: "avoidance-loop", title: "The Avoidance Loop", minutes: 2, type: "lesson" },
    { id: "reframe", title: "Reframe the Rejection", minutes: 10, type: "exercise", href: "/practice" },
    { id: "knowledge-check", title: "Module Knowledge Check", minutes: 5, type: "quiz", href: "/quiz" },
  ]},
  { id: 2, slug: "preparing-to-make-calls", title: "Preparing to Make Calls", description: "Create a repeatable call block, realistic activity goals, and a pre-call routine that removes hesitation.", status: "available", lessons: [
    { id: "the-call-block", title: "Building Your Call Block", minutes: 3, type: "lesson" },
    { id: "setting-your-number", title: "Setting a Real Daily Target", minutes: 2, type: "lesson" },
    { id: "the-precall-routine", title: "A Pre-Call Routine That Removes Hesitation", minutes: 2, type: "lesson" },
    { id: "activity-vs-outcome", title: "Track Activity, Not Just Outcomes", minutes: 2, type: "lesson" },
    { id: "call-plan", title: "Build Your Call Plan", minutes: 10, type: "exercise", href: "/practice/call-plan" },
    { id: "knowledge-check", title: "Module Knowledge Check", minutes: 5, type: "quiz", href: "/quiz/preparing-to-make-calls" },
  ]},
  { id: 3, slug: "opening-the-conversation", title: "Opening the Conversation", description: "Earn the next 30 seconds without sounding scripted, vague, or apologetic.", status: "available", lessons: [
    { id: "the-first-ten-seconds", title: "The First Ten Seconds", minutes: 3, type: "lesson" },
    { id: "a-reason-about-them", title: "Give Them a Reason That’s About Them", minutes: 3, type: "lesson" },
    { id: "drop-the-apology", title: "Drop the Apology and the Script Voice", minutes: 3, type: "lesson" },
    { id: "ask-for-the-next-30-seconds", title: "Ask for the Next 30 Seconds", minutes: 3, type: "lesson" },
    { id: "opener", title: "Write Your Opener", minutes: 10, type: "exercise", href: "/practice/opener" },
    { id: "knowledge-check", title: "Module Knowledge Check", minutes: 5, type: "quiz", href: "/quiz/opening-the-conversation" },
  ] },
  { id: 4, slug: "earning-attention", title: "Earning the Merchant's Attention", description: "Lead with relevance across restaurants, retail, service businesses, e-commerce, and integrated payments.", status: "available", lessons: [
    { id: "every-vertical-has-its-own-pain", title: "Every Vertical Has Its Own Pain", minutes: 3, type: "lesson" },
    { id: "speak-in-their-numbers", title: "Speak in Their Numbers", minutes: 3, type: "lesson" },
    { id: "lead-with-a-business-like-theirs", title: "Lead With a Business Like Theirs", minutes: 3, type: "lesson" },
    { id: "fit-the-software-they-run", title: "Integrated Payments: Fit the Software They Already Run", minutes: 3, type: "lesson" },
    { id: "pitch-card", title: "Build Your Vertical Pitch Card", minutes: 10, type: "exercise", href: "/practice/pitch-card" },
    { id: "knowledge-check", title: "Module Knowledge Check", minutes: 5, type: "quiz", href: "/quiz/earning-attention" },
  ] },
  { id: 5, slug: "discovery-questions", title: "Discovery That Creates Value", description: "Ask concise questions that reveal business impact instead of interrogating the merchant.", status: "available", lessons: [
    { id: "discovery-not-interrogation", title: "Discovery Is Not an Interrogation", minutes: 3, type: "lesson" },
    { id: "ask-about-impact", title: "Ask About Impact, Not Just Setup", minutes: 3, type: "lesson" },
    { id: "follow-the-answer", title: "Follow the Answer", minutes: 3, type: "lesson" },
    { id: "what-the-appointment-needs", title: "Know What the Appointment Needs", minutes: 3, type: "lesson" },
    { id: "discovery-plan", title: "Plan Your Discovery", minutes: 10, type: "exercise", href: "/practice/discovery-plan" },
    { id: "knowledge-check", title: "Module Knowledge Check", minutes: 5, type: "quiz", href: "/quiz/discovery-questions" },
  ] },
  { id: 6, slug: "handling-objections", title: "Handling Common Objections", description: "Stay composed through 'not interested,' 'we're happy,' 'send me information,' and price resistance.", status: "available", lessons: [
    { id: "not-interested", title: "When They Say “Not Interested”", minutes: 3, type: "lesson" },
    { id: "were-happy", title: "“We’re Happy With Who We Have”", minutes: 3, type: "lesson" },
    { id: "send-me-information", title: "“Just Send Me Some Information”", minutes: 3, type: "lesson" },
    { id: "price-resistance", title: "“What’s Your Rate?” and Price Pushback", minutes: 3, type: "lesson" },
    { id: "objection-playbook", title: "Build Your Objection Playbook", minutes: 10, type: "exercise", href: "/practice/objection-playbook" },
    { id: "knowledge-check", title: "Module Knowledge Check", minutes: 5, type: "quiz", href: "/quiz/handling-objections" },
  ] },
  { id: 7, slug: "booking-appointments", title: "Booking Qualified Appointments", description: "Move from conversation to a clear, worthwhile next step with the right stakeholders.", status: "available", lessons: [
    { id: "ask-for-the-meeting", title: "Ask for the Meeting", minutes: 3, type: "lesson" },
    { id: "qualified-appointment", title: "What Makes an Appointment Qualified", minutes: 3, type: "lesson" },
    { id: "make-it-stick", title: "Make It Stick", minutes: 3, type: "lesson" },
    { id: "the-handoff", title: "Hand It Off Well", minutes: 3, type: "lesson" },
    { id: "appointment-plan", title: "Book the Appointment", minutes: 10, type: "exercise", href: "/practice/appointment-plan" },
    { id: "knowledge-check", title: "Module Knowledge Check", minutes: 5, type: "quiz", href: "/quiz/booking-appointments" },
  ] },
  { id: 8, slug: "follow-up", title: "Follow-Up Without Chasing", description: "Build a professional follow-up cadence that adds value and keeps opportunities moving.", status: "available", lessons: [
    { id: "yes-comes-later", title: "Most Yeses Come Later", minutes: 3, type: "lesson" },
    { id: "give-them-a-reason", title: "Give Them a Reason to Hear From You", minutes: 3, type: "lesson" },
    { id: "a-cadence-you-can-keep", title: "Build a Cadence You Can Keep", minutes: 3, type: "lesson" },
    { id: "close-the-file", title: "Know When to Close the File", minutes: 3, type: "lesson" },
    { id: "follow-up-plan", title: "Plan Your Follow-Up", minutes: 10, type: "exercise", href: "/practice/follow-up-plan" },
    { id: "knowledge-check", title: "Module Knowledge Check", minutes: 5, type: "quiz", href: "/quiz/follow-up" },
  ] },
  { id: 9, slug: "activity-mindset", title: "Activity, Mindset & Consistency", description: "Use controllable behaviors and honest scorekeeping to create durable selling habits.", status: "available", lessons: [
    { id: "work-the-inputs", title: "Work the Part You Control", minutes: 3, type: "lesson" },
    { id: "keep-honest-score", title: "Keep Honest Score", minutes: 3, type: "lesson" },
    { id: "habits-that-hold", title: "Build Habits That Hold", minutes: 3, type: "lesson" },
    { id: "bounce-back", title: "Bounce Back From a Bad Week", minutes: 3, type: "lesson" },
    { id: "consistency-plan", title: "Build Your Consistency Plan", minutes: 10, type: "exercise", href: "/practice/consistency-plan" },
    { id: "knowledge-check", title: "Module Knowledge Check", minutes: 5, type: "quiz", href: "/quiz/activity-mindset" },
  ] },
  { id: 10, slug: "gatekeepers", title: "Working With Gatekeepers", description: "Navigate access professionally and turn gatekeepers into allies.", status: "available", lessons: [
    { id: "whos-answering", title: "Who’s Really Answering the Phone", minutes: 3, type: "lesson" },
    { id: "be-straight", title: "Be Straight About Who You Are", minutes: 3, type: "lesson" },
    { id: "ask-for-help", title: "Ask for Help, Not Access", minutes: 3, type: "lesson" },
    { id: "make-an-ally", title: "Turn Gatekeepers Into Allies", minutes: 3, type: "lesson" },
    { id: "gatekeeper-plan", title: "Plan Your Front-Desk Call", minutes: 10, type: "exercise", href: "/practice/gatekeeper-plan" },
    { id: "knowledge-check", title: "Module Knowledge Check", minutes: 5, type: "quiz", href: "/quiz/gatekeepers" },
  ] },
  { id: 11, slug: "vertical-practice", title: "Vertical Call Labs", description: "Practice realistic conversations across key merchant-services verticals.", status: "available", lessons: [
    { id: "restaurant-lab", title: "Lab: The Neighborhood Pizzeria", minutes: 4, type: "lesson" },
    { id: "retail-lab", title: "Lab: The Two-Store Retailer", minutes: 4, type: "lesson" },
    { id: "service-lab", title: "Lab: The Auto Repair Shop", minutes: 4, type: "lesson" },
    { id: "ecommerce-lab", title: "Lab: The Online Store", minutes: 4, type: "lesson" },
    { id: "call-lab", title: "Build Your Own Call Lab", minutes: 10, type: "exercise", href: "/practice/call-lab" },
    { id: "knowledge-check", title: "Module Knowledge Check", minutes: 5, type: "quiz", href: "/quiz/vertical-practice" },
  ] },
  { id: 12, slug: "certification", title: "Appointment-Setter Certification", description: "Demonstrate call readiness through a final scenario, quiz, and action plan.", status: "available", lessons: [
    { id: "call-ready", title: "What Call-Ready Means", minutes: 3, type: "lesson" },
    { id: "the-whole-call", title: "The Whole Call, Start to Finish", minutes: 3, type: "lesson" },
    { id: "next-30-days", title: "Your Next 30 Days", minutes: 3, type: "lesson" },
    { id: "final-scenario", title: "Final Scenario Call", minutes: 15, type: "exercise", href: "/practice/final-scenario" },
    { id: "knowledge-check", title: "Final Exam", minutes: 10, type: "quiz", href: "/quiz/certification" },
    { id: "action-plan", title: "Your 30-Day Action Plan", minutes: 10, type: "exercise", href: "/practice/action-plan" },
  ] },
  { id: 13, slug: "executive-selling-nepq", title: "Consultative Selling to Executives (NEPQ)", description: "Run a low-pressure, question-led conversation with a CEO, CFO or COO: connect, uncover the problem, let them price doing nothing, and earn a next step.", status: "available", track: "advanced", brands: ["kadima"], lessons: [
    { id: "nepq-roadmap", title: "Selling to the Executive’s World", minutes: 3, type: "lesson" },
    { id: "connect-and-situation", title: "Connect, Then Map the Current State", minutes: 4, type: "lesson" },
    { id: "problem-awareness", title: "Let Them Name the Problem", minutes: 4, type: "lesson" },
    { id: "solution-awareness", title: "Let Them Picture the Fix", minutes: 3, type: "lesson" },
    { id: "consequence-questions", title: "Let Them Price Doing Nothing", minutes: 3, type: "lesson" },
    { id: "commitment-and-closing", title: "Ask for the Next Step, Not the Moon", minutes: 4, type: "lesson" },
    { id: "trusted-advisor", title: "Be the Trusted Advisor", minutes: 3, type: "lesson" },
    { id: "differentiate", title: "Don’t Be a Commodity", minutes: 3, type: "lesson" },
    { id: "executive-objections", title: "Executive Objections: Contracts, “It Works,” and “Send Info”", minutes: 4, type: "lesson" },
    { id: "executive-conversation", title: "Plan Your Executive Conversation", minutes: 12, type: "exercise", href: "/practice/executive-conversation" },
    { id: "knowledge-check", title: "Module Knowledge Check", minutes: 6, type: "quiz", href: "/quiz/executive-selling-nepq" },
  ] },
];

// The modules this deployment offers (some belong to one brand only).
export const modules: Module[] = allModules.filter((m) => !m.brands || m.brands.includes(BRAND.id));
