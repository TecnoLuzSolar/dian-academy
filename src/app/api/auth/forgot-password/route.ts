import { prisma } from "@/lib/db";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "https://dian-academy-o14q.vercel.app";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "DIGNUS <onboarding@resend.dev>",
      to: email,
      subject: "Recupera tu contrasena - DIGNUS",
      html: `
        <h2>Recuperar contrasena</h2>
        <p>Hola ${user.name},</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contrasena:</p>
        <a href="${resetUrl}" style="background:#0C447C;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">Restablecer contrasena</a>
        <p>Este enlace expira en 1 hora.</p>
        <p>Si no solicitaste este cambio, ignora este correo.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
  }
}