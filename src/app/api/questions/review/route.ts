import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if ((session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { questionId, action } = await request.json();

    if (action === "approve") {
      await prisma.question.update({
        where: { id: questionId },
        data: { status: "PUBLISHED" },
      });
    } else if (action === "reject") {
      // Eliminar opciones primero (no hay cascade), luego la pregunta
      await prisma.questionOption.deleteMany({ where: { questionId } });
      await prisma.question.delete({ where: { id: questionId } });
    } else {
      return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error en revisión:", error);
    return NextResponse.json({ error: error.message ?? "Error" }, { status: 500 });
  }
}