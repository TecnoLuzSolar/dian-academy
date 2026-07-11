import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name:     z.string().min(2,  "El nombre debe tener al menos 2 caracteres"),
  email:    z.string().email("Email inválido"),
  password: z.string().min(6,  "La contraseña debe tener al menos 6 caracteres"),
  cargo:    z.string().optional().default("analista-1"),
});

export async function POST(request: Request) {
  try {
    const body   = await request.json();
    const { name, email, password, cargo } = schema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        cargo,
        accessUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // prueba gratis de 7 días
        stats: {
          create: {
            xpTotal: 0,
            level: 1,
            streakCurrent: 0,
            coins: 0,
          },
        },
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}