import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const LIKERT_OPTIONS = [
  { text: "Totalmente de acuerdo",    isCorrect: false, score: 4 },
  { text: "De acuerdo",               isCorrect: false, score: 3 },
  { text: "En desacuerdo",            isCorrect: false, score: 2 },
  { text: "Totalmente en desacuerdo", isCorrect: false, score: 1 },
];

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if ((session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { moduleSlug, count = 5, questionType = "SITUATIONAL", sourceText } = await request.json();
    const isLikert = questionType === "LIKERT";

    const mod = await prisma.module.findUnique({
      where: { slug: moduleSlug },
      include: { lessons: true },
    });
    if (!mod || mod.lessons.length === 0) {
      return NextResponse.json({ error: "Módulo o lección no encontrada" }, { status: 404 });
    }

    const lesson = mod.lessons[0];
    let passage  = "";

    // Si envían texto nuevo, guardarlo como referencia permanente
    if (sourceText && sourceText.trim().length > 50) {
      passage = sourceText.trim();
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { content: { passage } },
      });
    } else {
      const content = lesson.content as { passage?: string } | null;
      passage = content?.passage ?? "";
    }

    if (!isLikert && passage.length < 50) {
      return NextResponse.json(
        { error: "Este módulo no tiene texto de referencia. Pega el texto de la ley primero." },
        { status: 400 }
      );
    }

    const prompt = isLikert
      ? `Eres un experto en evaluación de competencias del servicio público colombiano (Decreto 815 de 2018).

Genera ${count} afirmaciones de escala Likert para evaluar competencias comportamentales del servidor público.

Competencias disponibles: Orientación al usuario y al ciudadano, Orientación a resultados, Trabajo en equipo, Adaptación al cambio, Transparencia, Compromiso con la organización, Aprendizaje continuo.

Requisitos:
- Cada afirmación describe una conducta concreta observable en el trabajo público.
- Redacta en primera persona.
- Afirmaciones POSITIVAS: mayor acuerdo = mayor alineación.
- Incluye explicación breve de qué competencia mide.
- Distribuye entre las diferentes competencias.
- Responde ÚNICAMENTE con JSON válido, sin markdown:
{"questions":[{"text":"...","explanation":"...","competency":"..."}]}`

      : `Eres un experto en diseño de pruebas de concurso de méritos de la CNSC para la DIAN en Colombia. Conoces el estilo estricto de redacción que exige la CNSC para evitar demandas por subjetividad.

Genera ${count} preguntas de opción múltiple de tipo SITUACIONAL basadas ÚNICAMENTE en el siguiente texto legal. NO inventes datos que no estén en el texto.

TEXTO LEGAL:
"""
${passage.slice(0, 12000)}
"""

REGLAS DE REDACCIÓN ESTILO CNSC (obligatorias):
1. ENUNCIADO: Nunca uses frases genéricas como "según el texto legal" o "según la norma". Siempre referencia la norma específica: "de conformidad con el Decreto 1165 de 2019", "según la Ley 1755 de 2015", "conforme al artículo 83 del CPACA".
2. DISTRACTORES: Solo usa entidades colombianas que EXISTAN actualmente (DIAN, Fiscalía, MinCIT, SIC, Superintendencia de Sociedades, AGN, CNSC, Procuraduría). NUNCA inventes entidades ni uses entidades extintas.
3. DISTRACTORES: Deben ser técnicamente plausibles pero jurídicamente incorrectos. Ejemplo: atribuir una competencia real a una entidad equivocada, o aplicar un procedimiento de otra rama del derecho.
4. DISTRACTOR "VACÍO NORMATIVO": En al menos una pregunta, incluye un distractor que sugiera remitirse al CPACA o al Código Civil "para llenar un vacío", cuando en realidad la norma específica ya regula el caso autónomamente.
5. RESPUESTA CORRECTA: Siempre fundamentada en el texto, con referencia normativa precisa.
6. EXPLICACIÓN: Cita el artículo o norma específica, no diga "según el texto".

Formato: Responde ÚNICAMENTE con JSON válido, sin markdown ni texto adicional:
{"questions":[{"text":"...","explanation":"...","options":[{"text":"...","isCorrect":true},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false}]}]}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const raw   = message.content.filter((b) => b.type === "text").map((b) => (b as any).text).join("");
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    let created = 0;
    for (const q of parsed.questions) {
      if (isLikert) {
        await prisma.question.create({
          data: {
            lessonId: lesson.id, text: q.text, explanation: q.explanation ?? "",
            competency: q.competency ?? null, type: "LIKERT", status: "DRAFT", source: "AI",
            options: { create: LIKERT_OPTIONS },
          },
        });
      } else {
        await prisma.question.create({
          data: {
            lessonId: lesson.id, text: q.text, explanation: q.explanation ?? "",
            type: "SITUATIONAL", status: "DRAFT", source: "AI",
            options: { create: q.options.map((o: any) => ({ text: o.text, isCorrect: !!o.isCorrect, score: 0 })) },
          },
        });
      }
      created++;
    }

    return NextResponse.json({ success: true, created, questions: parsed.questions });
  } catch (error: any) {
    console.error("Error generando preguntas:", error);
    return NextResponse.json({ error: error.message ?? "Error al generar" }, { status: 500 });
  }
}