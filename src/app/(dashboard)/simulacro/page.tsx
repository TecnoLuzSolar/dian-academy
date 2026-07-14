import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { getCargoModules, getCargoName } from "@/lib/cargos";
import SimulacroQuiz from "./SimulacroQuiz";

export const dynamic = "force-dynamic";

// Banco de preguntas exclusivo del simulacro (no aparece en la ruta de módulos).
// ⚠️ Verifica que el slug coincida con el de tu BD:
//    SELECT slug FROM modules WHERE title LIKE 'Simulacro%';
const SIMULACRO_BANK_SLUGS = ["simulacros-dian"];

export default async function SimulacroPage() {
  const user = await getCurrentUser();

  // Solo preguntas de los módulos del cargo del usuario + el banco del simulacro
  const allowedSlugs = [...getCargoModules(user.cargo), ...SIMULACRO_BANK_SLUGS];

  const questions = await prisma.question.findMany({
    where: {
      status: "PUBLISHED",
      type: "SITUATIONAL",
      lesson: { module: { slug: { in: allowedSlugs } } },
    },
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
        cargoName={getCargoName(user.cargo)}
      />
    </div>
  );
}
