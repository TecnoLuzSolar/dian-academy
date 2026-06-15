import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import SimulacroQuiz from "./SimulacroQuiz";

export const dynamic = "force-dynamic";

export default async function SimulacroPage() {
  const user = await getCurrentUser();

  const questions = await prisma.question.findMany({
    where: { status: "PUBLISHED", type: "SITUATIONAL" },
    include: {
      options: true,
      lesson: { include: { module: true } },
    },
  });

  const shuffled = questions
    .sort(() => Math.random() - 0.5)
    .slice(0, 25)
    .map((q) => ({
      id: q.id,
      text: q.text,
      explanation: q.explanation ?? "",
      moduleName: q.lesson.module.title,
      options: q.options
        .sort(() => Math.random() - 0.5)
        .map((o) => ({
          id: o.id,
          text: o.text,
          isCorrect: o.isCorrect,
        })),
    }));

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <SimulacroQuiz
        questions={shuffled}
        userId={user.id}
        userName={user.name}
      />
    </div>
  );
}