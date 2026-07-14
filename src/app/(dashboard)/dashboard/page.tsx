import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { getCargoModules, getCargoName } from "@/lib/cargos";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const stats = user.stats;

  // Módulos filtrados según el cargo del usuario
  const allowedSlugs = getCargoModules(user.cargo);
  const modules = await prisma.module.findMany({
    where: { slug: { in: allowedSlugs } },
    orderBy: { order: "asc" },
  });
  const completedCount = await prisma.userProgress.count({
    where: { userId: user.id, status: "COMPLETED" },
  });

  const cargoName = getCargoName(user.cargo);

  // Cálculo de XP para la barra
  const xpCurrent = stats?.xpTotal ?? 0;
  const xpForNext = (stats?.level ?? 1) * 500;
  const xpPct = Math.min(Math.round((xpCurrent / xpForNext) * 100), 100);

  const metrics = [
    { label: "Módulos completados", value: `${completedCount}/${modules.length || 8}`, sub: "Sigue avanzando", accent: "#E6F1FB", color: "#0C447C" },
    { label: "Tiempo de estudio",   value: `${Math.round((stats?.totalMinutes ?? 0) / 60)}h`, sub: "Acumulado", accent: "#E1F5EE", color: "#085041" },
    { label: "Racha actual",        value: `🔥 ${stats?.streakCurrent ?? 0}`, sub: "días seguidos", accent: "#FAEEDA", color: "#633806" },
    { label: "Monedas",             value: `${stats?.coins ?? 0}`, sub: "para recompensas", accent: "#EEEDFE", color: "#3C3489" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Saludo */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">
        ¡Hola, {user.name.split(" ")[0]}! 👋
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Meta: conseguir tu plaza — {cargoName}
      </p>

      {/* Barra de XP */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#0C447C] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Nivel {stats?.level ?? 1}
            </span>
            <span className="text-sm font-medium text-gray-900">Aspirante</span>
          </div>
          <span className="text-xs text-gray-500">{xpCurrent} / {xpForNext} XP</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-[#0C447C] h-2.5 rounded-full transition-all duration-700"
            style={{ width: `${xpPct}%` }}
          />
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{m.value}</p>
            <p className="text-xs text-gray-400 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Desafío diario */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <span className="text-2xl">🔥</span>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">Desafío diario</h3>
          <p className="text-xs text-gray-500">
            Completa una lección hoy y mantén tu racha. Recompensa: +80 XP
          </p>
        </div>
      </div>

      {/* Lista de módulos */}
      <h2 className="text-sm font-medium text-gray-900 mb-3">Ruta de aprendizaje</h2>
      {modules.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center">
          <p className="text-sm text-gray-500">
            Los módulos aún no se han cargado. Los agregaremos en el siguiente paso.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {modules.map((mod, i) => (
            <div
              key={mod.id}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white"
            >
              <div className="w-9 h-9 rounded-full bg-[#E6F1FB] text-[#0C447C] flex items-center justify-center font-bold text-sm shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{mod.title}</p>
                <p className="text-xs text-gray-500">+{mod.xpReward} XP</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
