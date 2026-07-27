import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { canAccessModule } from "@/lib/access";
import { notFound, redirect } from "next/navigation";
import LessonQuiz from "./LessonQuiz";
import GenerarBoton from "./GenerarBoton";

export default async function ModuloPage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await getCurrentUser();

  // Trial: solo los módulos gratis; el resto redirige a suscripción
  if (!canAccessModule(user, params.slug)) {
    redirect("/suscripcion");
  }

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

  // Detectar tipo de pregunta según el módulo
  const qType = module.slug === "competencias-comportamentales" ? "LIKERT" : "SITUATIONAL";


  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {user.role === "ADMIN" && (
        <GenerarBoton moduleSlug={module.slug} questionType={module.slug === "competencias-comportamentales" ? "LIKERT" : "SITUATIONAL"} />
      )}
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