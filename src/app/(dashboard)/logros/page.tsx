import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LogrosPage() {
  const user = await getCurrentUser();

  const allAchievements = await prisma.achievement.findMany({
    orderBy: { conditionValue: "asc" },
  });

  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId: user.id },
    select: { achievementId: true, earnedAt: true },
  });

  const earnedMap = new Map(
    userAchievements.map((a) => [a.achievementId, a.earnedAt])
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Logros</h1>
      <p className="text-sm text-gray-500 mb-6">
        {userAchievements.length} de {allAchievements.length} desbloqueados
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {allAchievements.map((ach) => {
          const earned = earnedMap.has(ach.id);
          const earnedAt = earnedMap.get(ach.id);

          return (
            <div
              key={ach.id}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                earned
                  ? "bg-white border-green-300"
                  : "bg-gray-50 border-gray-200 opacity-50"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                earned ? "bg-green-50" : "bg-gray-100"
              }`}>
                {earned ? ach.icon : "🔒"}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${earned ? "text-gray-900" : "text-gray-500"}`}>
                  {ach.name}
                </p>
                <p className="text-xs text-gray-400">{ach.description}</p>
                {earned && earnedAt && (
                  <p className="text-xs text-green-600 mt-0.5">
                    +{ach.xpReward} XP
                  </p>
                )}
              </div>
              {earned && (
                <span className="text-green-500 text-lg">✓</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}