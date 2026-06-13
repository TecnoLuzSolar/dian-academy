import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ModulosPage() {
  const user = await getCurrentUser();

  const modules = await prisma.module.findMany({
    orderBy: { order: "asc" },
    include: { lessons: true },
  });

  const progress = await prisma.userProgress.findMany({
    where: { userId: user.id },
  });

  // Determina el estado de cada módulo
  function getStatus(order: number): "completed" | "active" | "locked" {
    const modProgress = progress.find(
      (p) => modules.find((m) => m.id === p.moduleId)?.order === order
    );
    if (modProgress?.status === "COMPLETED") return "completed";

    // Si tiene contenido (lecciones), está disponible para estudiar
    const mod = modules.find((m) => m.order === order);
    const hasContent = (mod?.lessons?.length ?? 0) > 0;
    return hasContent ? "active" : "locked";
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Ruta de aprendizaje</h1>
      <p className="text-sm text-gray-500 mb-6">
        Completa cada módulo con ≥70% para desbloquear el siguiente
      </p>

      <div className="space-y-2">
        {modules.map((mod) => {
          const status = getStatus(mod.order);
          const hasLessons = mod.lessons.length > 0;
          const isClickable = status !== "locked" && hasLessons;

          const card = (
            <div
              className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                status === "locked"
                  ? "opacity-50 border-gray-200"
                  : status === "completed"
                  ? "border-green-400 bg-white hover:bg-gray-50"
                  : "border-[#0C447C] border-2 bg-white hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  status === "completed"
                    ? "bg-green-100 text-green-700"
                    : status === "active"
                    ? "bg-[#E6F1FB] text-[#0C447C]"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {status === "completed" ? "✓" : status === "locked" ? "🔒" : mod.order}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{mod.title}</p>
                <p className="text-xs text-gray-500">
                  {status === "completed"
                    ? "Completado"
                    : status === "locked"
                    ? "Bloqueado"
                    : hasLessons
                    ? `${mod.lessons.length} lección · +${mod.xpReward} XP`
                    : "Próximamente"}
                </p>
              </div>
              {status === "active" && hasLessons && (
                <span className="text-xs bg-[#0C447C] text-white px-3 py-1.5 rounded-lg font-medium">
                  {status === "completed" ? "Repasar" : "Empezar"}
                </span>
              )}
            </div>
          );

          return isClickable ? (
            <Link key={mod.id} href={`/modulos/${mod.slug}`}>
              {card}
            </Link>
          ) : (
            <div key={mod.id}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}