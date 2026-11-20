import { notFound } from "next/navigation";
import { QuizRunner } from "@/components/QuizRunner";
import { modules } from "@/data/curriculum";
import { quizzes } from "@/data/quiz";

export default async function ModuleQuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // A quiz can exist for a module this brand doesn't offer (see Module.brands).
  if (!quizzes[slug] || !modules.some((m) => m.slug === quizzes[slug].moduleSlug)) notFound();
  return <QuizRunner slug={slug} />;
}
