import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { moduleSlug, count = 5 } = await request.json();

    const mod = await prisma.module.findUnique({
      where: { slug: moduleSlug },
      include: { lessons: true },
    });
    if (!mod || mod.lessons.length === 0) {
      return NextResponse.json({ error: "Módulo o lección no encontrada" }, { status: 404 });
    }

    const lesson = mod.lessons[0];
    const content = lesson.content as { passage?: string } | null;
    const passage = content?.passage ?? "";

    // Prompt FUNDAMENTADO: la IA solo puede usar el texto que le pasamos
    const prompt = `Eres un experto en pruebas de concurso de méritos de la CNSC para la DIAN en Colombia.

Genera ${count} preguntas de opción múltiple de tipo SITUACIONAL basadas ÚNICAMENTE en el siguiente texto legal. NO inventes datos, plazos, artículos ni cifras que no estén explícitamente en el texto.

TEXTO LEGAL:
"""
${passage}
"""

Requisitos:
- Cada pregunta plantea un caso o situación realista que evalúe la APLICACIÓN del texto.
- Exactamente 4 opciones, con solo UNA correcta.
- Incluye una explicación breve fundamentada en el texto.
- Redacta en español, con nivel de dificultad de concurso CNSC.
- Responde ÚNICAMENTE con JSON válido, sin markdown ni texto adicional, con esta estructura exacta:
{"questions":[{"text":"...","explanation":"...","options":[{"text":"...","isCorrect":true},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false}]}]}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    // Extraer el texto de la respuesta
    const raw = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as any).text)
      .join("");

    // Limpiar y parsear el JSON
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    // Guardar cada pregunta como BORRADOR (pendiente de revisión)
    let created = 0;
    for (const q of parsed.questions) {
      await prisma.question.create({
        data: {
          lessonId: lesson.id,
          text: q.text,
          explanation: q.explanation ?? "",
          type: "SITUATIONAL",
          status: "DRAFT",
          source: "AI",
          options: {
            create: q.options.map((o: any) => ({
              text: o.text,
              isCorrect: !!o.isCorrect,
            })),
          },
        },
      });
      created++;
    }

    return NextResponse.json({ success: true, created, questions: parsed.questions });
  } catch (error: any) {
    console.error("Error generando preguntas:", error);
    return NextResponse.json({ error: error.message ?? "Error al generar" }, { status: 500 });
  }
}