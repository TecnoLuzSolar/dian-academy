import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

async function checkAchievements(userId: string, score: number) {
  const earned: string[] = [];

  const stats = await prisma.userStats.findUnique({ where: { userId } });
  if (!stats) return earned;

  const completedModules = await prisma.userProgress.count({
    where: { userId, status: "COMPLETED" },
  });

  const allAchievements = await prisma.achievement.findMany();
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  });
  const earnedIds = new Set(userAchievements.map((a) => a.achievementId));

  for (const ach of allAchievements) {
    if (earnedIds.has(ach.id)) continue;

    let qualifies = false;

    switch (ach.conditionType) {
      case "MODULES_COMPLETED":
        if (ach.conditionValue === 0) qualifies = true;
        else qualifies = completedModules >= ach.conditionValue;
        break;
      case "PERFECT_SCORE":
        qualifies = score >= ach.conditionValue;
        break;
      case "STREAK":
        qualifies = (stats.streakCurrent ?? 0) >= ach.conditionValue;
        break;
      case "XP_TOTAL":
        qualifies = (stats.xpTotal ?? 0) >= ach.conditionValue;
        break;
    }

    if (qualifies) {
      await prisma.userAchievement.create({
        data: { userId, achievementId: ach.id },
      });
      await prisma.userStats.update({
        where: { userId },
        data: { xpTotal: { increment: ach.xpReward } },
      });
      earned.push(ach.name);
    }
  }

  return earned;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = session.user.id;
    const { moduleId, lessonId, score, xpReward } = await request.json();

    const passed = score >= 70;
    const status = passed ? "COMPLETED" : "FAILED";

    const existing = await prisma.userProgress.findFirst({
      where: { userId, moduleId, lessonId },
    });

    if (existing) {
      await prisma.userProgress.update({
        where: { id: existing.id },
        data: {
          status,
          score,
          attempts: { increment: 1 },
          completedAt: passed ? new Date() : null,
        },
      });
    } else {
      await prisma.userProgress.create({
        data: {
          userId, moduleId, lessonId, status, score,
          attempts: 1,
          completedAt: passed ? new Date() : null,
        },
      });
    }

    let newStats = null;
    if (passed) {
      const stats = await prisma.userStats.findUnique({ where: { userId } });
      const newXp = (stats?.xpTotal ?? 0) + (xpReward ?? 0);
      const newLevel = Math.floor(newXp / 500) + 1;

      const today = new Date();
      const lastStudy = stats?.lastStudyDate;
      let newStreak = stats?.streakCurrent ?? 0;

      if (lastStudy) {
        const diffDays = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) newStreak += 1;
        else if (diffDays > 1) newStreak = 1;
      } else {
        newStreak = 1;
      }

      newStats = await prisma.userStats.update({
        where: { userId },
        data: {
          xpTotal: newXp,
          level: newLevel,
          coins: { increment: 30 },
          lastStudyDate: today,
          streakCurrent: newStreak,
          streakMax: Math.max(newStreak, stats?.streakMax ?? 0),
        },
      });
    }

    const newAchievements = await checkAchievements(userId, score);

    return NextResponse.json({
      success: true,
      passed,
      stats: newStats,
      achievements: newAchievements,
    });
  } catch (error) {
    console.error("Error en /api/progress:", error);
    return NextResponse.json({ error: "Error al guardar el progreso" }, { status: 500 });
  }
}