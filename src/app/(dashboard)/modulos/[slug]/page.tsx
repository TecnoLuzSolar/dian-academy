import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import LessonQuiz from "./LessonQuiz";
import GenerarBoton from "./GenerarBoton";

export default async function ModuloPage({
  params,
}: {
  params: { slug: string };
}) {
  await getCurrentUser();

  const module = await prisma.module.findUnique({
    where: { slug: params.slug },
    include: {
      lessons: {
        include: {
          questions: {
            where: { status: "PUBLISHED" },
            include: { options: true },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!module || module.lessons.length === 0) {
    notFound();
  }

  const lesson = module.lessons[0];
  const content = lesson.content as { passage?: string } | null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <GenerarBoton moduleSlug={module.slug} />
      <LessonQuiz
        moduleId={module.id}
        moduleTitle={module.title}
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        passage={content?.passage ?? ""}
        questions={lesson.questions.map((q) => ({
          id: q.id,
          text: q.text,
          explanation: q.explanation ?? "",
          type: q.type,
          options: q.options.map((o) => ({
            id: o.id,
            text: o.text,
            isCorrect: o.isCorrect,
            score: o.score,
          })),
        }))}
      />
    </div>
  );
}