import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import RevisarLista from "./RevisarLista";

export const dynamic = "force-dynamic";

export default async function RevisarPage() {
  await getCurrentUser();

  const drafts = await prisma.question.findMany({
    where: { status: "DRAFT" },
    include: { options: true, lesson: { include: { module: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Revisar preguntas 📝</h1>
      <p className="text-sm text-gray-500 mb-6">
        {drafts.length} borrador(es) pendiente(s) de aprobación
      </p>
      <RevisarLista
        questions={drafts.map((q) => ({
          id: q.id,
          text: q.text,
          explanation: q.explanation ?? "",
          moduleTitle: q.lesson.module.title,
          options: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
        }))}
      />
    </div>
  );
}