import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const modules = [
  { title: "Comprensión Lectora",      slug: "comprension-lectora",      order: 1, xpReward: 200, description: "Análisis de textos normativos e inferencia" },
  { title: "Razonamiento Lógico",      slug: "razonamiento-logico",      order: 2, xpReward: 250, description: "Series, silogismos y deducción" },
  { title: "Constitución Política",    slug: "constitucion-politica",    order: 3, xpReward: 300, description: "Derechos fundamentales y estructura del Estado" },
  { title: "Derecho Administrativo",   slug: "derecho-administrativo",   order: 4, xpReward: 350, description: "CPACA Ley 1437/2011 y PQRSF" },
  { title: "Tributario - RUT",         slug: "tributario-rut",           order: 5, xpReward: 400, description: "RUT, evasión, elusión y contrabando" },
  { title: "Aduanero y Cambiario",     slug: "aduanero-cambiario",       order: 6, xpReward: 350, description: "Régimen aduanero y control de divisas" },
  { title: "Competencias Funcionales", slug: "competencias-funcionales", order: 7, xpReward: 300, description: "Gestión documental, MIPG y ética" },
  { title: "Simulacros DIAN",          slug: "simulacros-dian",          order: 8, xpReward: 500, description: "Pruebas completas tipo CNSC" },
];

const passage = `La Dirección de Impuestos y Aduanas Nacionales (DIAN) es la entidad del Estado colombiano encargada de garantizar el cumplimiento voluntario de las obligaciones tributarias, aduaneras y cambiarias. Para ello, implementa el Sistema PQRSF (Peticiones, Quejas, Reclamos, Sugerencias y Felicitaciones), a través del cual los ciudadanos ejercen su derecho fundamental de petición.

Según la Ley 1755 de 2015, toda petición de interés particular debe resolverse dentro de los quince (15) días hábiles siguientes a su recepción. Cuando la DIAN no resuelva la solicitud en este plazo, opera el silencio administrativo positivo, salvo en los casos expresamente exceptuados por la norma.

El Analista I, en el subproceso de Asistencia al Usuario, tiene como función esencial tramitar estas solicitudes conforme a los procedimientos vigentes, garantizando la veracidad de la información y la calidad del servicio prestado al ciudadano.`;

const questions = [
  {
    text: "Según el texto, ¿cuál es el plazo máximo para resolver una petición de interés particular en la DIAN?",
    explanation: "El texto cita la Ley 1755 de 2015: máximo 15 días hábiles. Es uno de los datos más evaluados en las pruebas DIAN.",
    options: [
      { text: "5 días hábiles",       isCorrect: false },
      { text: "10 días hábiles",      isCorrect: false },
      { text: "15 días hábiles",      isCorrect: true  },
      { text: "30 días calendario",   isCorrect: false },
    ],
  },
  {
    text: "¿Qué fenómeno jurídico ocurre cuando la DIAN no responde una petición dentro del plazo?",
    explanation: "El texto señala que opera el silencio administrativo positivo: la petición se entiende aceptada. Figura clave del CPACA.",
    options: [
      { text: "Silencio administrativo negativo", isCorrect: false },
      { text: "Caducidad del trámite",            isCorrect: false },
      { text: "Silencio administrativo positivo", isCorrect: true  },
      { text: "Nulidad del procedimiento",        isCorrect: false },
    ],
  },
  {
    text: "¿Cuál es la función esencial del Analista I en el subproceso de Asistencia al Usuario?",
    explanation: "El texto lo dice directamente: tramitar solicitudes garantizando la veracidad de la información y la calidad del servicio. Coincide con tu ficha FT-TAH-1824.",
    options: [
      { text: "Realizar auditorías tributarias",                          isCorrect: false },
      { text: "Tramitar solicitudes PQRSF garantizando veracidad y calidad", isCorrect: true  },
      { text: "Diseñar políticas de servicio al ciudadano",               isCorrect: false },
      { text: "Fiscalizar operaciones aduaneras",                          isCorrect: false },
    ],
  },
];

async function main() {
  console.log("🌱 Sembrando módulos...");
  for (const mod of modules) {
    await prisma.module.upsert({
      where: { slug: mod.slug },
      update: {},
      create: mod,
    });
  }

  console.log("📖 Creando lección de Comprensión Lectora...");
  const cl = await prisma.module.findUnique({ where: { slug: "comprension-lectora" } });
  if (!cl) throw new Error("Módulo no encontrado");

  // Evitar duplicar lecciones si se corre varias veces
  const existing = await prisma.lesson.findFirst({ where: { moduleId: cl.id } });
  if (existing) {
    console.log("⚠️  La lección ya existe, no se duplica.");
  } else {
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: cl.id,
        title: "Análisis de textos normativos y PQRSF",
        order: 1,
        type: "QUIZ",
        xpReward: 120,
        content: { passage },
      },
    });

    for (const q of questions) {
      await prisma.question.create({
        data: {
          lessonId: lesson.id,
          text: q.text,
          explanation: q.explanation,
          options: { create: q.options },
        },
      });
    }
    console.log("✅ Lección con 3 preguntas creada.");
  }

  console.log("✅ Seed completado.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });