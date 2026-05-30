import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

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

    // Buscar progreso existente (sin usar el upsert compuesto)
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
          userId,
          moduleId,
          lessonId,
          status,
          score,
          attempts: 1,
          completedAt: passed ? new Date() : null,
        },
      });
    }

    // Sumar XP y monedas solo si aprobó (≥70%)
    let newStats = null;
    if (passed) {
      const stats    = await prisma.userStats.findUnique({ where: { userId } });
      const newXp    = (stats?.xpTotal ?? 0) + (xpReward ?? 0);
      const newLevel = Math.floor(newXp / 500) + 1;

      newStats = await prisma.userStats.update({
        where: { userId },
        data: {
          xpTotal: newXp,
          level: newLevel,
          coins: { increment: 30 },
          lastStudyDate: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, passed, stats: newStats });
  } catch (error) {
    console.error("Error en /api/progress:", error);
    return NextResponse.json({ error: "Error al guardar el progreso" }, { status: 500 });
  }
}