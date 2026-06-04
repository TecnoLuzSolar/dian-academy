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
// ─── MÓDULO 4: Derecho Administrativo (CPACA) ───
  console.log("⚖️ Configurando banco de CPACA...");
  const da = await prisma.module.findUnique({ where: { slug: "derecho-administrativo" } });
  if (!da) throw new Error("Módulo Derecho Administrativo no encontrado");

  const cpacaPassage = `El Código de Procedimiento Administrativo y de lo Contencioso Administrativo (CPACA, Ley 1437 de 2011) regula el derecho fundamental de petición, sustituido por la Ley 1755 de 2015.

Las peticiones de interés general o particular se resuelven en quince (15) días hábiles. Las solicitudes de documentos e información tienen un plazo de diez (10) días hábiles; si la autoridad no responde, opera el silencio administrativo positivo y debe entregar las copias en tres (3) días. Las consultas, que piden el concepto de la entidad sobre cómo aplicar una norma, tienen treinta (30) días hábiles.

Cuando la autoridad no resuelve una petición dentro de los tres (3) meses siguientes a su presentación, se configura el silencio administrativo negativo: la petición se entiende negada y el ciudadano queda habilitado para interponer recursos o demandar.

Contra los actos administrativos definitivos proceden tres recursos (Art. 74): reposición, ante el mismo funcionario; apelación, ante el superior jerárquico (obligatoria para acceder a la jurisdicción); y queja, cuando se rechaza la apelación. Los recursos de reposición y apelación se interponen dentro de los diez (10) días siguientes a la notificación.`;

  const cpacaQuestions = [
    {
      text: "Un contribuyente presenta una petición de interés particular y la DIAN no responde. ¿Cuándo se configura el silencio administrativo negativo?",
      explanation: "El silencio negativo opera a los 3 meses (Art. 83). Vencer el plazo de respuesta de 15 días NO es lo mismo que configurarse el silencio: son dos relojes distintos.",
      options: [
        { text: "Al vencer los 15 días hábiles de respuesta",          isCorrect: false },
        { text: "A los 3 meses de presentada la petición",             isCorrect: true  },
        { text: "A los 10 días hábiles",                               isCorrect: false },
        { text: "Nunca, la entidad siempre está obligada a responder", isCorrect: false },
      ],
    },
    {
      text: "Una persona solicita copia de documentos a la DIAN y la entidad no responde en 10 días hábiles. ¿Qué consecuencia se produce?",
      explanation: "Para documentos e información opera el silencio POSITIVO a los 10 días: la solicitud se entiende aceptada y las copias se entregan en 3 días. Es la excepción pro-transparencia.",
      options: [
        { text: "Silencio negativo: se entiende negada y debe demandar",               isCorrect: false },
        { text: "Silencio positivo: se entiende aceptada y entregan copias en 3 días", isCorrect: true  },
        { text: "Debe esperar 3 meses para que opere cualquier silencio",              isCorrect: false },
        { text: "La petición caduca y debe presentarse de nuevo",                      isCorrect: false },
      ],
    },
    {
      text: "Un usuario pide a la DIAN un concepto sobre cómo aplicar una norma tributaria a su caso particular. ¿Cuál es el plazo para responder?",
      explanation: "Pedir un concepto sobre CÓMO aplicar una norma es una consulta (30 días hábiles). Distinto a pedir documentos que ya existen (10 días).",
      options: [
        { text: "10 días hábiles, por ser solicitud de información", isCorrect: false },
        { text: "15 días hábiles, por interés particular",          isCorrect: false },
        { text: "30 días hábiles, por tratarse de una consulta",    isCorrect: true  },
        { text: "3 meses, antes del silencio negativo",             isCorrect: false },
      ],
    },
    {
      text: "¿Cuál de los siguientes recursos es OBLIGATORIO interponer para poder acceder luego a la jurisdicción de lo contencioso administrativo?",
      explanation: "La apelación, cuando procede, es obligatoria para agotar la vía gubernativa y poder demandar. La reposición y la queja son facultativas.",
      options: [
        { text: "El recurso de reposición",  isCorrect: false },
        { text: "El recurso de apelación",   isCorrect: true  },
        { text: "El recurso de queja",       isCorrect: false },
        { text: "Ninguno es obligatorio",    isCorrect: false },
      ],
    },
    {
      text: "El recurso de reposición debe interponerse ante:",
      explanation: "La reposición va ante el MISMO funcionario que tomó la decisión, dentro de los 10 días siguientes a la notificación. La apelación va ante el superior jerárquico.",
      options: [
        { text: "El superior jerárquico del funcionario",    isCorrect: false },
        { text: "El mismo funcionario que tomó la decisión", isCorrect: true  },
        { text: "Directamente la jurisdicción contenciosa",  isCorrect: false },
        { text: "La Procuraduría General de la Nación",      isCorrect: false },
      ],
    },
    {
      text: "¿Cuál de los siguientes NO es un principio de la función administrativa según el Art. 3 del CPACA?",
      explanation: "Los principios son: debido proceso, igualdad, imparcialidad, buena fe, moralidad, participación, responsabilidad, transparencia, publicidad, coordinación, eficacia, economía y celeridad. La rentabilidad económica no es uno: la función administrativa no busca lucro.",
      options: [
        { text: "Debido proceso",        isCorrect: false },
        { text: "Buena fe",              isCorrect: false },
        { text: "Rentabilidad económica", isCorrect: true  },
        { text: "Celeridad",             isCorrect: false },
      ],
    },
    {
      text: "Cuando no es posible realizar la notificación personal de un acto administrativo, ¿qué procede según el CPACA?",
      explanation: "Si no se logra la notificación personal, se realiza la notificación por aviso (Art. 69), remitido a la dirección del interesado con copia del acto.",
      options: [
        { text: "La notificación por aviso",                  isCorrect: true  },
        { text: "El acto se entiende notificado de inmediato", isCorrect: false },
        { text: "El acto administrativo caduca",              isCorrect: false },
        { text: "Se archiva la actuación",                    isCorrect: false },
      ],
    },
    {
      text: "La revocatoria directa de un acto administrativo (Art. 93 CPACA) procede, entre otras causales, cuando:",
      explanation: "Procede cuando el acto es manifiestamente contrario a la Constitución o la ley, cuando no esté conforme con el interés público o social, o cuando cause agravio injustificado a una persona.",
      options: [
        { text: "El acto es manifiestamente contrario a la Constitución o la ley", isCorrect: true  },
        { text: "Han transcurrido más de cinco años",                              isCorrect: false },
        { text: "El particular paga una multa",                                    isCorrect: false },
        { text: "Solo cuando lo ordena un juez",                                   isCorrect: false },
      ],
    },
    {
      text: "Cuando una autoridad solicita información o documentos a OTRA autoridad, el plazo para responder es de:",
      explanation: "Las peticiones entre autoridades deben resolverse en 10 días (Ley 1755). Si no es posible, debe informarse y la otra autoridad puede señalar un plazo mayor.",
      options: [
        { text: "15 días hábiles", isCorrect: false },
        { text: "10 días",         isCorrect: true  },
        { text: "30 días hábiles", isCorrect: false },
        { text: "5 días",          isCorrect: false },
      ],
    },
    {
      text: "El recurso de queja procede cuando:",
      explanation: "La queja es facultativa y procede cuando se RECHAZA el recurso de apelación. Se interpone directamente ante el superior del funcionario que lo negó.",
      options: [
        { text: "Se rechaza el recurso de apelación",      isCorrect: true  },
        { text: "Se niega la petición inicial",            isCorrect: false },
        { text: "Vence el plazo de respuesta",             isCorrect: false },
        { text: "Se solicita una revocatoria directa",     isCorrect: false },
      ],
    },
  ];

  // Buscar o crear la lección (sin borrarla, para conservar tu progreso)
  let daLesson = await prisma.lesson.findFirst({ where: { moduleId: da.id } });
  if (!daLesson) {
    daLesson = await prisma.lesson.create({
      data: {
        moduleId: da.id,
        title: "Derecho de petición, silencio y recursos",
        order: 1,
        type: "QUIZ",
        xpReward: 150,
        content: { passage: cpacaPassage },
      },
    });
  } else {
    await prisma.lesson.update({
      where: { id: daLesson.id },
      data: { content: { passage: cpacaPassage } },
    });
  }

  // Refrescar el banco de preguntas (seguro: las preguntas no guardan progreso)
  const oldQs = await prisma.question.findMany({
    where: { lessonId: daLesson.id },
    select: { id: true },
  });
  if (oldQs.length > 0) {
    const ids = oldQs.map((x) => x.id);
    await prisma.questionOption.deleteMany({ where: { questionId: { in: ids } } });
    await prisma.question.deleteMany({ where: { id: { in: ids } } });
  }

  for (const q of cpacaQuestions) {
    await prisma.question.create({
      data: {
        lessonId: daLesson.id,
        text: q.text,
        explanation: q.explanation,
        options: { create: q.options },
      },
    });
  }
  console.log(`✅ CPACA: banco de ${cpacaQuestions.length} preguntas listo.`);

  // ─── MÓDULO: Competencias Comportamentales (Likert) ───
  console.log("🧭 Configurando módulo de comportamentales...");
  const comp = await prisma.module.upsert({
    where: { slug: "competencias-comportamentales" },
    update: {},
    create: {
      title: "Competencias Comportamentales",
      slug: "competencias-comportamentales",
      order: 9,
      xpReward: 200,
      description: "Autoevaluación de competencias del servidor público (Decreto 815 de 2018)",
    },
  });

  const compPassage = `Las competencias comportamentales (Decreto 815 de 2018) son las conductas y actitudes que debe demostrar todo servidor público. En las pruebas de la CNSC se evalúan con afirmaciones donde indicas tu grado de acuerdo: no miden conocimiento, sino tu alineación con las conductas esperadas en el servicio público.

Responde con honestidad según cómo actúas habitualmente. La opción de mayor acuerdo refleja la conducta ideal del servidor.`;

  const likertOptions = () => ([
    { text: "Totalmente de acuerdo",    isCorrect: false, score: 4 },
    { text: "De acuerdo",               isCorrect: false, score: 3 },
    { text: "En desacuerdo",            isCorrect: false, score: 2 },
    { text: "Totalmente en desacuerdo", isCorrect: false, score: 1 },
  ]);

  const compQuestions = [
    { competency: "Orientación al usuario", text: "Cuando un ciudadano me plantea una solicitud de forma confusa, me tomo el tiempo necesario para entender qué requiere antes de responder.", explanation: "Mide Orientación al usuario y al ciudadano. La conducta esperada es priorizar la comprensión real de la necesidad del ciudadano." },
    { competency: "Orientación a resultados", text: "Organizo mis tareas para cumplir los plazos establecidos, incluso cuando el volumen de trabajo es alto.", explanation: "Mide Orientación a resultados. El servidor planifica y cumple metas pese a la carga de trabajo." },
    { competency: "Trabajo en equipo", text: "Comparto con mis compañeros la información que necesitan para que el equipo cumpla sus objetivos comunes.", explanation: "Mide Trabajo en equipo. Anteponer la meta colectiva y compartir información es la conducta esperada." },
    { competency: "Adaptación al cambio", text: "Cuando la entidad modifica un procedimiento, ajusto mi forma de trabajar sin resistirme al cambio.", explanation: "Mide Adaptación al cambio. La flexibilidad ante nuevos procesos es clave en el servicio público." },
    { competency: "Transparencia", text: "Reporto la información de manera veraz y completa, aunque los resultados no sean los esperados.", explanation: "Mide Transparencia. La conducta esperada es la honestidad en la información sin importar el resultado." },
    { competency: "Compromiso con la organización", text: "Asumo los objetivos de la entidad como propios y oriento mi trabajo hacia ellos.", explanation: "Mide Compromiso con la organización. La identificación con la misión institucional define al buen servidor." },
  ];

  let compLesson = await prisma.lesson.findFirst({ where: { moduleId: comp.id } });
  if (!compLesson) {
    compLesson = await prisma.lesson.create({
      data: {
        moduleId: comp.id,
        title: "Autoevaluación de competencias",
        order: 1,
        type: "QUIZ",
        xpReward: 150,
        content: { passage: compPassage },
      },
    });
  } else {
    await prisma.lesson.update({ where: { id: compLesson.id }, data: { content: { passage: compPassage } } });
  }

  const oldCompQs = await prisma.question.findMany({ where: { lessonId: compLesson.id }, select: { id: true } });
  if (oldCompQs.length > 0) {
    const ids = oldCompQs.map((x) => x.id);
    await prisma.questionOption.deleteMany({ where: { questionId: { in: ids } } });
    await prisma.question.deleteMany({ where: { id: { in: ids } } });
  }

  for (const q of compQuestions) {
    await prisma.question.create({
      data: {
        lessonId: compLesson.id,
        text: q.text,
        explanation: q.explanation,
        type: "LIKERT",
        status: "PUBLISHED",
        competency: q.competency,
        options: { create: likertOptions() },
      },
    });
  }
  console.log(`✅ Comportamentales: ${compQuestions.length} afirmaciones Likert listas.`);
  console.log("✅ Seed completado.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });