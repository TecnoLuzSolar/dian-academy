import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { getCargoModules, getCargoName } from "@/lib/cargos";
import { isPremiumUser, canTakeSimulacro } from "@/lib/access";
import SimulacroQuiz from "./SimulacroQuiz";

export const dynamic = "force-dynamic";

// Banco de preguntas exclusivo del simulacro (no aparece en la ruta de módulos).
// ⚠️ Verifica que el slug coincida con el de tu BD:
//    SELECT slug FROM modules WHERE title LIKE 'Simulacro%';
const SIMULACRO_BANK_SLUGS = ["simulacros-dian"];

export default async function SimulacroPage() {
  const user = await getCurrentUser();
  const premium = isPremiumUser(user);

  // Trial: solo 1 simulacro gratis. Si ya lo usó, pantalla de bloqueo.
  if (!canTakeSimulacro(user)) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Ya usaste tu simulacro gratis
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Con el acceso completo tienes simulacros ilimitados tipo CNSC,
          resultados por módulo y toda tu ruta de aprendizaje desbloqueada
          hasta el día del concurso.
        </p>
        <Link
          href="/suscripcion"
          className="inline-block bg-[#0C447C] text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-[#185FA5] transition-colors"
        >
          Activar acceso completo
        </Link>
        <Link
          href="/dashboard"
          className="block mt-4 text-sm text-gray-400 hover:text-gray-600"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

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
        isTrial={!premium}
      />
    </div>
  );
}
