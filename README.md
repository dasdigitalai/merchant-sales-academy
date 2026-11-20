# Merchant Sales Academy

A commercial cold-calling training platform for merchant-services salespeople. The first release focuses on overcoming call reluctance, building outbound consistency, handling merchant objections, and booking qualified appointments.

## Stack

- Next.js App Router and TypeScript
- Tailwind CSS plus a small design-token layer
- Firebase-ready Auth, Firestore, and Storage configuration
- Resend-ready server email client
- Vercel-compatible build

## Included routes

- `/` — commercial landing page
- `/signin` and `/register` — authentication layouts
- `/dashboard` — learner dashboard
- `/courses` — 12-module course catalog
- `/courses/understanding-call-reluctance` — complete Module 1 outline
- `/courses/understanding-call-reluctance/lessons/*` — lesson experience
- `/practice` — guided practice exercise
- `/quiz` — knowledge-check interface
- `/progress` — learner progress
- `/courses/executive-selling-nepq` — Module 13, Consultative Selling to Executives (NEPQ): Kadima brand only, an advanced track outside the certification, currently `status: "preview"` (managers only)
- `/manager` — team manager dashboard

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` and fill in Firebase, Resend, and OpenAI values. The current interface works without the services connected; authentication, persistence, and outbound email are the next integration milestone.

## Validation

```bash
npm run typecheck
npm run build
```

## Module 13: Consultative Selling to Executives (NEPQ)

Adapted from the Kadima NEPQ Sales Playbook for Credit Card Processing Services (C-Level Edition) by Moshe Maghboule.

- **Where things live:** the module is in `src/data/curriculum.ts` (id 13), its nine lessons in `src/data/executive-lessons.tsx`, its knowledge check in `src/data/quiz.ts` (`module13Quiz`), its exercise at `src/app/practice/executive-conversation` with coach feedback from `src/app/api/executive-conversation-feedback`.
- **Brand:** `brands: ["kadima"]`, so only `NEXT_PUBLIC_BRAND=kadima` deployments have it. Remove that field to offer it everywhere.
- **Certification:** `track: "advanced"` keeps it out of the Appointment-Setter Certification, so it never blocks or un-does anyone's certificate.
- **Releasing it:** it is `status: "preview"` (managers only). When it's ready for reps, change it to `"available"`. Reps' overall completion counts it from then on.
