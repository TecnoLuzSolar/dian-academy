import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Marca el simulacro gratis del trial como usado.
 * Usuarios premium/admin no consumen intentos.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, isPremium: true, trialSimulacroUsed: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  // Premium y admin: intentos ilimitados, nada que marcar
  if (user.role === "ADMIN" || user.isPremium) {
    return NextResponse.json({ ok: true, unlimited: true });
  }

  // Trial: si ya lo usó, bloquear
  if (user.trialSimulacroUsed) {
    return NextResponse.json(
      { error: "Ya usaste tu simulacro gratis" },
      { status: 403 }
    );
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { trialSimulacroUsed: true },
  });

  return NextResponse.json({ ok: true, unlimited: false });
}
