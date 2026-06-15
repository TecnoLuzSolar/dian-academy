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

  // ─── Constitución Política ───────────────────────────────────────
  console.log("📜 Configurando Constitución Política...");
  const cp = await prisma.module.findUnique({ where: { slug: "constitucion-politica" } });
  if (cp) {
    const cpPassage = `La Constitución Política de Colombia de 1991 establece en el Artículo 1 que Colombia es un Estado Social de Derecho, organizado como República unitaria, democrática, participativa y pluralista, fundada en el respeto de la dignidad humana.

El Artículo 2 define los fines esenciales del Estado: servir a la comunidad, promover la prosperidad general, garantizar los derechos, facilitar la participación de todos en las decisiones y asegurar la convivencia pacífica.

El Artículo 6 señala que los servidores públicos son responsables ante las autoridades por infringir la Constitución y las leyes, y por omisión o extralimitación en el ejercicio de sus funciones.

El Artículo 74 garantiza a toda persona el acceso a los documentos públicos, salvo los casos que establezca la ley.

El Artículo 209 establece que la función administrativa está al servicio de los intereses generales y se desarrolla con fundamento en los principios de igualdad, moralidad, eficacia, economía, celeridad, imparcialidad y publicidad, mediante la descentralización, la delegación y la desconcentración de funciones.`;

    const cpLesson = await prisma.lesson.findFirst({ where: { moduleId: cp.id } });
    if (!cpLesson) {
      await prisma.lesson.create({ data: { moduleId: cp.id, title: "Principios constitucionales y función pública", order: 1, type: "QUIZ", xpReward: 120, content: { passage: cpPassage } } });
      console.log("✅ Lección Constitución Política creada.");
    } else {
      await prisma.lesson.update({ where: { id: cpLesson.id }, data: { content: { passage: cpPassage } } });
      console.log("⚠️ Lección Constitución actualizada.");
    }
  }

  // ─── Tributario — RUT ─────────────────────────────────────────────
  console.log("💰 Configurando Tributario - RUT...");
  const rut = await prisma.module.findUnique({ where: { slug: "tributario-rut" } });
  if (rut) {
    const rutPassage = `El Registro Único Tributario (RUT) es el mecanismo que la DIAN administra para identificar, ubicar y clasificar a las personas y entidades obligadas a cumplir obligaciones tributarias, aduaneras y cambiarias en Colombia. Constituye el único documento válido para acreditar el Número de Identificación Tributaria (NIT).

Están obligados a inscribirse en el RUT: las personas naturales y jurídicas con obligaciones tributarias, los responsables del impuesto sobre las ventas (IVA), los agentes retenedores, los contribuyentes del régimen ordinario del impuesto sobre la renta, y quienes realicen operaciones de importación o exportación.

Según el Artículo 555-2 del Estatuto Tributario, la inscripción en el RUT debe realizarse antes de iniciar actividades gravadas. La información del RUT debe mantenerse actualizada; la desactualización puede generar sanciones. La DIAN puede cancelar la inscripción cuando el obligado no desarrolle actividades económicas o incumpla los requisitos legales.

La DIAN, como administradora del sistema tributario, tiene la facultad de fiscalizar, investigar y sancionar el incumplimiento de las obligaciones tributarias, garantizando el recaudo de los tributos para el financiamiento del Estado.`;

    const rutLesson = await prisma.lesson.findFirst({ where: { moduleId: rut.id } });
    if (!rutLesson) {
      await prisma.lesson.create({ data: { moduleId: rut.id, title: "RUT y obligaciones tributarias", order: 1, type: "QUIZ", xpReward: 120, content: { passage: rutPassage } } });
      console.log("✅ Lección Tributario-RUT creada.");
    } else {
      await prisma.lesson.update({ where: { id: rutLesson.id }, data: { content: { passage: rutPassage } } });
      console.log("⚠️ Lección Tributario-RUT actualizada.");
    }
  }

// ─── Aduanero y Cambiario (mejorado con distractores sofisticados) ──
  console.log("🚢 Configurando Aduanero y Cambiario (v2)...");
  const adua = await prisma.module.findUnique({ where: { slug: "aduanero-cambiario" } });
  if (adua) {
    const aduaPassage = `La DIAN es la autoridad aduanera de Colombia, encargada de controlar y facilitar las operaciones de comercio exterior. El régimen aduanero está regulado por el Decreto 1165 de 2019, que constituye un cuerpo normativo autónomo con sus propias reglas de procedimiento, sanciones y causales de aprehensión y decomiso.

La declaración de importación es el acto mediante el cual el importador manifiesta ante la DIAN la voluntad de realizar una importación, indicando régimen, clasificación arancelaria, valor en aduana y tributos aduaneros. Toda mercancía que ingrese al territorio aduanero nacional debe ser declarada conforme a los plazos y modalidades del Decreto 1165.

Los regímenes aduaneros incluyen: importación para el consumo, importación temporal (a corto y largo plazo), tránsito aduanero, depósito aduanero, exportación definitiva y exportación temporal. Cada régimen tiene obligaciones específicas: por ejemplo, la importación temporal obliga a reexportar la mercancía dentro del plazo autorizado; su incumplimiento genera aprehensión.

La aprehensión es la medida cautelar mediante la cual la DIAN retiene mercancías cuando existen indicios de irregularidad aduanera. Las causales de aprehensión están taxativamente señaladas en el artículo 647 del Decreto 1165 de 2019 e incluyen: mercancía sin declaración, con documentos falsos, que no corresponde a lo declarado, o que ingresó por lugar no habilitado. El Decreto 1165 establece su propio procedimiento para definir la situación jurídica de la mercancía aprehendida, sin necesidad de remitirse al CPACA.

El decomiso es la sanción mediante la cual la mercancía pasa a propiedad de la Nación de forma definitiva, cuando se comprueba la infracción aduanera y no se desvirtúan las causales de aprehensión dentro del término legal.

El régimen cambiario regula las operaciones de cambio de divisas. Las operaciones de cambio obligatoriamente canalizables (importaciones, exportaciones, endeudamiento externo, inversión extranjera) deben realizarse a través del mercado cambiario autorizado. La infracción cambiaria se sanciona con multas y puede derivar en investigación penal cuando configura lavado de activos.

El contrabando (introducción o extracción de mercancías sin el cumplimiento de las formalidades aduaneras) es un delito penal tipificado en la Ley 1762 de 2015 (Ley Anticontrabando). La DIAN tiene la facultad de investigar, aprehender mercancías y denunciar ante la Fiscalía.`;

    let aduaLesson = await prisma.lesson.findFirst({ where: { moduleId: adua.id } });
    if (!aduaLesson) {
      aduaLesson = await prisma.lesson.create({ data: { moduleId: adua.id, title: "Régimen aduanero, cambiario, aprehensión y decomiso", order: 1, type: "QUIZ", xpReward: 150, content: { passage: aduaPassage } } });
    } else {
      await prisma.lesson.update({ where: { id: aduaLesson.id }, data: { content: { passage: aduaPassage } } });
    }

    const aduaQuestions = [
      {
        text: "Un funcionario de la DIAN identifica mercancía importada sin declaración aduanera en una bodega del territorio aduanero nacional. De conformidad con el Decreto 1165 de 2019, ¿cuál es el procedimiento aplicable para definir la situación jurídica de la mercancía?",
        explanation: "El Decreto 1165 de 2019 regula autónomamente el procedimiento de aprehensión y decomiso en sus artículos 647 y siguientes. No es necesario remitirse al CPACA: el régimen aduanero tiene su propia norma de clausura sobre causales de aprehensión.",
        options: [
          { text: "Aplicar el procedimiento de aprehensión previsto en el Decreto 1165 de 2019, que regula autónomamente las causales y el trámite de definición de situación jurídica",  isCorrect: true  },
          { text: "Iniciar un proceso sancionatorio ordinario conforme a la Ley 1437 de 2011 (CPACA), por tratarse de una actuación administrativa",                                      isCorrect: false },
          { text: "La DIAN debe abstenerse de aplicar medidas cautelares y remitir el caso directamente a la Fiscalía General de la Nación para que esta realice la incautación",          isCorrect: false },
          { text: "No procede la aprehensión, ya que el funcionario debe remitirse primero al CPACA para llenar el vacío normativo sobre mercancías sin declaración",                      isCorrect: false },
        ],
      },
      {
        text: "Un importador realizó una importación temporal a corto plazo conforme al Decreto 1165 de 2019 y el plazo autorizado venció sin que reexportara la mercancía. ¿Qué consecuencia jurídica se configura?",
        explanation: "Conforme al artículo 647 del Decreto 1165 de 2019, el incumplimiento de la obligación de reexportar en importación temporal es una causal taxativa de aprehensión. El decreto regula el procedimiento sin remisión a normas generales.",
        options: [
          { text: "Procede la aprehensión de la mercancía por incumplimiento del régimen de importación temporal, conforme al artículo 647 del Decreto 1165 de 2019",                     isCorrect: true  },
          { text: "Se genera automáticamente la nacionalización de la mercancía mediante declaración de importación para el consumo",                                                      isCorrect: false },
          { text: "Se aplica únicamente una sanción pecuniaria sin afectar la tenencia de la mercancía",                                                                                   isCorrect: false },
          { text: "No hay consecuencia aduanera inmediata; el vacío normativo sobre vencimientos en regímenes temporales debe resolverse por remisión al Código Civil",                    isCorrect: false },
        ],
      },
      {
        text: "Un exportador colombiano recibe el pago de una exportación en dólares pero lo deposita en una cuenta personal en el exterior sin canalizarlo por el mercado cambiario autorizado. De conformidad con el régimen cambiario, ¿qué infracción comete?",
        explanation: "Las exportaciones son operaciones de cambio obligatoriamente canalizables. No canalizar a través del mercado cambiario autorizado constituye una infracción cambiaria sancionable con multa. Si hay indicios de lavado de activos, puede derivar en investigación penal conforme a la Ley 1762 de 2015.",
        options: [
          { text: "Infracción cambiaria por no canalizar una operación obligatoriamente canalizable, sancionable con multa y posible investigación penal por lavado de activos",           isCorrect: true  },
          { text: "Ninguna infracción, ya que el exportador puede recibir el pago en la jurisdicción que prefiera sin restricción cambiaria",                                              isCorrect: false },
          { text: "Únicamente una infracción tributaria por no declarar ingresos del exterior ante la DIAN",                                                                               isCorrect: false },
          { text: "Infracción aduanera que genera decomiso de la mercancía previamente exportada",                                                                                         isCorrect: false },
        ],
      },
      {
        text: "De conformidad con el Decreto 1165 de 2019, ¿cuál es la diferencia fundamental entre la aprehensión y el decomiso de mercancías?",
        explanation: "La aprehensión es la medida cautelar (retención temporal mientras se investiga la situación jurídica). El decomiso es la sanción definitiva mediante la cual la mercancía pasa a propiedad de la Nación, conforme al procedimiento del Decreto 1165 de 2019.",
        options: [
          { text: "La aprehensión es una medida cautelar de retención temporal; el decomiso es la sanción definitiva que transfiere la propiedad de la mercancía a la Nación",             isCorrect: true  },
          { text: "Son figuras equivalentes; ambas implican que la mercancía pasa inmediatamente a propiedad de la Nación",                                                               isCorrect: false },
          { text: "La aprehensión es competencia de la DIAN, mientras que el decomiso solo puede ser ordenado por un juez de la jurisdicción contencioso-administrativa",                  isCorrect: false },
          { text: "La aprehensión aplica solo a mercancías de importación, mientras que el decomiso aplica exclusivamente a mercancías de exportación",                                    isCorrect: false },
        ],
      },
      {
        text: "Se detecta que un ciudadano introdujo mercancía al territorio aduanero nacional por un lugar no habilitado, sin declaración aduanera. Frente a esta situación, de conformidad con el régimen aduanero y la Ley Anticontrabando (Ley 1762 de 2015), ¿qué figura jurídica se configura?",
        explanation: "La introducción de mercancía sin cumplir las formalidades aduaneras, incluyendo el ingreso por lugares no habilitados, configura el delito de contrabando tipificado en la Ley 1762 de 2015. La DIAN tiene facultad de aprehender la mercancía y denunciar ante la Fiscalía General de la Nación.",
        options: [
          { text: "Contrabando, tipificado como delito penal en la Ley 1762 de 2015, que faculta a la DIAN para aprehender la mercancía y denunciar ante la Fiscalía",                   isCorrect: true  },
          { text: "Infracción administrativa menor sancionable únicamente con multa pecuniaria, sin consecuencias penales",                                                               isCorrect: false },
          { text: "La DIAN debe abstenerse de actuar y remitir el caso directamente a la Fiscalía General de la Nación para que esta realice la incautación de los bienes",               isCorrect: false },
          { text: "No se configura infracción si el ciudadano demuestra que la mercancía es para uso personal y no comercial",                                                            isCorrect: false },
        ],
      },
      {
        text: "Un declarante presenta una declaración de importación con clasificación arancelaria incorrecta que resulta en menor pago de tributos aduaneros. De conformidad con el Decreto 1165 de 2019, ¿qué consecuencias puede generar esta situación?",
        explanation: "Conforme al artículo 647 del Decreto 1165 de 2019, declarar información incorrecta sobre clasificación arancelaria es causal de aprehensión. Adicionalmente procede liquidación oficial de corrección por la diferencia en tributos aduaneros no pagados.",
        options: [
          { text: "Aprehensión de la mercancía por información que no corresponde a lo importado, más liquidación oficial de corrección por diferencia en tributos",                       isCorrect: true  },
          { text: "Solo una corrección voluntaria de la declaración sin ninguna consecuencia sancionatoria adicional",                                                                      isCorrect: false },
          { text: "Anulación automática de la declaración y orden de reembarque de la mercancía al país de origen",                                                                        isCorrect: false },
          { text: "No procede sanción contra el importador, ya que la responsabilidad por clasificación arancelaria recae exclusivamente en la Superintendencia de Industria y Comercio",  isCorrect: false },
        ],
      },
      {
        text: "De conformidad con el régimen cambiario colombiano, ¿cuáles de las siguientes operaciones deben canalizarse obligatoriamente a través del mercado cambiario autorizado?",
        explanation: "Las operaciones obligatoriamente canalizables incluyen: importaciones, exportaciones, endeudamiento externo e inversión extranjera. Deben realizarse a través de intermediarios del mercado cambiario autorizados o cuentas de compensación registradas ante el Banco de la República.",
        options: [
          { text: "Importaciones, exportaciones, operaciones de endeudamiento externo e inversión extranjera",                                                                             isCorrect: true  },
          { text: "Únicamente las importaciones cuyo valor FOB supere los USD 10.000",                                                                                                     isCorrect: false },
          { text: "Todas las operaciones en divisas sin excepción, incluyendo remesas familiares y compras personales por internet",                                                       isCorrect: false },
          { text: "Solo las exportaciones de bienes; los servicios prestados al exterior se canalizan libremente sin control cambiario",                                                   isCorrect: false },
        ],
      },
    ];

    // Limpiar preguntas existentes y cargar las nuevas
    const oldAduaQs = await prisma.question.findMany({ where: { lessonId: aduaLesson.id }, select: { id: true } });
    if (oldAduaQs.length > 0) {
      const ids = oldAduaQs.map((x) => x.id);
      await prisma.questionOption.deleteMany({ where: { questionId: { in: ids } } });
      await prisma.question.deleteMany({ where: { id: { in: ids } } });
    }

    for (const q of aduaQuestions) {
      await prisma.question.create({
        data: {
          lessonId: aduaLesson.id,
          text: q.text,
          explanation: q.explanation,
          type: "SITUATIONAL",
          status: "PUBLISHED",
          source: "manual",
          options: { create: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect, score: 0 })) },
        },
      });
    }
    console.log(`✅ Aduanero v2: ${aduaQuestions.length} preguntas con distractores mejorados.`);
  }

  // ─── Competencias Funcionales ─────────────────────────────────────
  console.log("📋 Configurando Competencias Funcionales...");
  const funcional = await prisma.module.findUnique({ where: { slug: "competencias-funcionales" } });
  if (funcional) {
    const funcPassage = `Las competencias funcionales del Analista I de la DIAN están vinculadas al subproceso de Asistencia al Usuario, conforme al manual de funciones FT-TAH-1824. Su función esencial es tramitar las solicitudes de los ciudadanos garantizando veracidad, oportunidad y calidad.

El Modelo Integrado de Planeación y Gestión (MIPG) es el marco de referencia para dirigir, planear, ejecutar, hacer seguimiento y evaluar la gestión de las entidades públicas. Sus dimensiones incluyen: talento humano, direccionamiento estratégico, gestión con valores para resultados, evaluación de resultados, gestión del conocimiento e información, y control interno.

La gestión documental (Ley 594 de 2000 — Ley General de Archivos) establece que toda entidad pública debe organizar, conservar y disponer sus documentos conforme a las Tablas de Retención Documental (TRD). Los documentos son patrimonio del Estado y su acceso es un derecho ciudadano.

El Código de Integridad del servidor público colombiano establece los valores que guían la conducta: honestidad, respeto, compromiso, diligencia y justicia. Todo servidor debe actuar con transparencia y orientación al bien común.

La atención al ciudadano debe regirse por los principios de oportunidad, accesibilidad, calidad y calidez. Toda solicitud PQRSF debe registrarse, tramitarse y responderse dentro de los plazos legales, con trazabilidad del proceso.`;

    const funcLesson = await prisma.lesson.findFirst({ where: { moduleId: funcional.id } });
    if (!funcLesson) {
      await prisma.lesson.create({ data: { moduleId: funcional.id, title: "MIPG, gestión documental y atención al ciudadano", order: 1, type: "QUIZ", xpReward: 120, content: { passage: funcPassage } } });
      console.log("✅ Lección Competencias Funcionales creada.");
    } else {
      await prisma.lesson.update({ where: { id: funcLesson.id }, data: { content: { passage: funcPassage } } });
      console.log("⚠️ Lección Competencias Funcionales actualizada.");
    }
  }

  // ─── Gestión Documental (basado en IN-ADF-0132 + FT-TAH-1824) ────
  console.log("📁 Configurando Gestión Documental...");
  const gd = await prisma.module.upsert({
    where: { slug: "gestion-documental" },
    update: {},
    create: {
      title: "Gestión Documental",
      slug: "gestion-documental",
      order: 10,
      xpReward: 300,
      description: "Manejo de archivos en la DIAN, TRD, transferencias y Ley 594 de 2000",
    },
  });

  const gdPassage = `La gestión documental en la UAE DIAN está regulada por el instructivo IN-ADF-0132 "Manejo de los Archivos en la UAE DIAN" y la Ley 594 de 2000 (Ley General de Archivos). Su objetivo es organizar en unidades de conservación los documentos recibidos y elaborados en desarrollo de los procesos de la entidad, garantizando la conservación del documento físico y la preservación del documento electrónico como patrimonio institucional e histórico de la nación.

Según el Artículo 4 de la Ley 594 de 2000: "Los servidores públicos son responsables de la organización, conservación, uso y manejo de los documentos." El servidor público que se traslade, retire o posesione, omitiendo la entrega, la debida gestión y el recibo de los documentos, responderá ante las autoridades disciplinarias, penales, fiscales o administrativas.

Existen tres tipos de documentos: el documento de archivo (producido o recibido por una entidad en ejercicio de sus funciones), el documento electrónico de archivo (generado en medio electrónico con valor probatorio), y el documento de apoyo (de carácter general que sirve de referencia pero no forma parte del archivo institucional).

Los archivos se clasifican en tres niveles según el ciclo vital del documento: Archivo de Gestión (documentos en trámite, consulta constante), Archivo Central (documentos transferidos desde gestión, consulta esporádica) y Archivo Histórico (documentos de valor permanente para la investigación y la cultura).

Las Tablas de Retención Documental (TRD) son el instrumento que define las series y subseries documentales de cada dependencia, estableciendo los tiempos de retención en cada fase del archivo y la disposición final (conservación total, eliminación, selección o digitalización). Las series documentales pueden ser simples (documentos del mismo tipo) o complejas, también llamadas expedientes (documentos de diferentes tipos agrupados por un asunto común).

Toda unidad documental debe cumplir con: rotulación según el formato institucional, diligenciamiento de la hoja de control, foliación consecutiva en la esquina superior derecha con lápiz de mina negra HB o B, e incorporación cronológica de documentos (el más antiguo al inicio y el más reciente al final).

La transferencia documental primaria consiste en la remisión de documentos del Archivo de Gestión al Archivo Central, y la transferencia documental secundaria del Archivo Central al Archivo Histórico, en la periodicidad que establezcan las TRD. Las transferencias deben realizarse en el Formato Único de Inventario Documental (FUID, formato FT-ADF-1990).

El Analista I del subproceso de Asistencia al Usuario (ficha FT-TAH-1824) tiene entre sus funciones tramitar las PQRSF asignadas por el sistema, atender solicitudes en temas tributarios, aduaneros y cambiarios, y tramitar solicitudes del RUT. Todas estas gestiones generan documentos que deben organizarse conforme al instructivo de archivos.`;

  let gdLesson = await prisma.lesson.findFirst({ where: { moduleId: gd.id } });
  if (!gdLesson) {
    gdLesson = await prisma.lesson.create({
      data: {
        moduleId: gd.id,
        title: "Archivos, TRD, transferencias y responsabilidades",
        order: 1,
        type: "QUIZ",
        xpReward: 150,
        content: { passage: gdPassage },
      },
    });
  } else {
    await prisma.lesson.update({ where: { id: gdLesson.id }, data: { content: { passage: gdPassage } } });
  }

  const gdQuestions = [
    {
      text: "Un servidor público de la DIAN es trasladado a otra dependencia. Según la Ley 594 de 2000 y el instructivo IN-ADF-0132, ¿qué debe hacer con la documentación a su cargo?",
      explanation: "El Artículo 4 de la Ley 594 y el Acuerdo 001 del AGN establecen que el servidor debe entregar la documentación debidamente inventariada al jefe inmediato. La omisión genera responsabilidad disciplinaria, penal, fiscal o administrativa.",
      options: [
        { text: "Entregar la documentación inventariada al jefe inmediato",                          isCorrect: true  },
        { text: "Archivar todos los documentos en el Archivo Central antes de irse",                 isCorrect: false },
        { text: "Dejar los documentos en su escritorio para quien lo reemplace",                     isCorrect: false },
        { text: "Eliminar los documentos que ya no estén en trámite",                                isCorrect: false },
      ],
    },
    {
      text: "La transferencia documental primaria consiste en:",
      explanation: "La transferencia primaria va del Archivo de Gestión al Archivo Central, y la secundaria del Central al Histórico, según los tiempos de las TRD y el ciclo vital del documento.",
      options: [
        { text: "La remisión de documentos del Archivo de Gestión al Archivo Central",               isCorrect: true  },
        { text: "La remisión de documentos del Archivo Central al Archivo Histórico",                isCorrect: false },
        { text: "La digitalización de documentos para el archivo electrónico",                       isCorrect: false },
        { text: "La eliminación de documentos según las TRD",                                        isCorrect: false },
      ],
    },
    {
      text: "Al foliar documentos en una unidad documental de la DIAN, ¿qué instrumento y ubicación debe usarse?",
      explanation: "El instructivo IN-ADF-0132 indica: foliación consecutiva en la esquina superior derecha con lápiz de mina negra HB o B. No se usa esfero ni se folia en otra ubicación.",
      options: [
        { text: "Lápiz de mina negra HB o B, en la esquina superior derecha",                       isCorrect: true  },
        { text: "Esfero negro, en la esquina inferior derecha",                                      isCorrect: false },
        { text: "Marcador, en el centro superior de la hoja",                                        isCorrect: false },
        { text: "Sello numerador, en la esquina superior izquierda",                                 isCorrect: false },
      ],
    },
    {
      text: "Las Tablas de Retención Documental (TRD) establecen, entre otros aspectos:",
      explanation: "Las TRD definen las series y subseries de cada dependencia, los tiempos de retención en cada fase del archivo y la disposición final (conservación total, eliminación, selección o digitalización).",
      options: [
        { text: "Las series documentales, tiempos de retención y disposición final",                 isCorrect: true  },
        { text: "Únicamente los formatos de correspondencia interna",                                isCorrect: false },
        { text: "Los horarios de atención del Archivo Central",                                      isCorrect: false },
        { text: "Las competencias comportamentales de los archivistas",                              isCorrect: false },
      ],
    },
    {
      text: "¿Cuál es la diferencia entre un documento de archivo y un documento de apoyo en la DIAN?",
      explanation: "El documento de archivo se produce en ejercicio de las funciones de la entidad y forma parte del archivo institucional. El documento de apoyo es de carácter general y sirve de referencia, pero NO forma parte del archivo institucional.",
      options: [
        { text: "El de archivo se produce en ejercicio de funciones institucionales; el de apoyo es referencia general y no forma parte del archivo",  isCorrect: true  },
        { text: "El de archivo es electrónico y el de apoyo es físico",                              isCorrect: false },
        { text: "El de archivo es público y el de apoyo es reservado",                               isCorrect: false },
        { text: "No hay diferencia, ambos se tratan igual",                                          isCorrect: false },
      ],
    },
  ];

  const oldGdQs = await prisma.question.findMany({ where: { lessonId: gdLesson.id }, select: { id: true } });
  if (oldGdQs.length > 0) {
    const ids = oldGdQs.map((x) => x.id);
    await prisma.questionOption.deleteMany({ where: { questionId: { in: ids } } });
    await prisma.question.deleteMany({ where: { id: { in: ids } } });
  }

  for (const q of gdQuestions) {
    await prisma.question.create({
      data: {
        lessonId: gdLesson.id,
        text: q.text,
        explanation: q.explanation,
        type: "SITUATIONAL",
        status: "PUBLISHED",
        source: "manual",
        options: { create: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect, score: 0 })) },
      },
    });
  }
  console.log(`✅ Gestión Documental: ${gdQuestions.length} preguntas + pasaje del IN-ADF-0132 listo.`);

  // ─── Módulo: Integridad (Código de Integridad - 10% del examen) ───
  console.log("⚖️ Configurando módulo de Integridad...");
  const integ = await prisma.module.upsert({
    where: { slug: "integridad" },
    update: {},
    create: {
      title: "Integridad y Ética Pública",
      slug: "integridad",
      order: 11,
      xpReward: 300,
      description: "Código de Integridad del servidor público — valores, conductas y dilemas éticos",
    },
  });

  const integPassage = `El Código de Integridad del servidor público colombiano establece cinco valores fundamentales que guían la conducta de todo funcionario. A partir de 2024, la integridad se ha consolidado como un componente transversal y medible de la gestión pública, traduciendo valores abstractos en conductas mandatorias.

HONESTIDAD: El servidor público dice la verdad siempre, denuncia delitos de los que tenga conocimiento y actúa con transparencia. Lo que NO hace: aceptar sobornos, dar trato preferencial a amigos o familiares, ni ocultar información relevante.

RESPETO: Trata a todos con dignidad, amabilidad y sin discriminación. Utiliza lenguaje incluyente y escucha activa. Lo que NO hace: discriminar por género, etnia, orientación sexual o condición social, ni actuar de forma grosera con los ciudadanos.

JUSTICIA: Decide basándose en evidencia y objetividad, garantizando igualdad de condiciones para todos los ciudadanos. Lo que NO hace: favorecer a grupos de interés, promover desigualdad ni tomar decisiones arbitrarias sin fundamento.

DILIGENCIA: Cumple plazos establecidos, asegura la calidad del trabajo y usa eficientemente los recursos públicos. Lo que NO hace: malgastar patrimonio público, evadir responsabilidades ni descuidar los trámites asignados.

COMPROMISO: Empatiza con las necesidades de la ciudadanía y entiende que el servicio público es un deber, no un favor. Lo que NO hace: considerar el servicio como un "favor" al ciudadano ni anteponer intereses personales a los institucionales.

Estos valores son evaluados en el componente de Integridad del concurso de méritos de la CNSC (10% de la calificación). Las preguntas presentan situaciones donde el aspirante debe identificar la conducta que refleja el valor correcto, distinguiéndola de conductas que, aunque pueden parecer razonables, violan algún principio del Código.

Para el Nivel Técnico (Analista I, cargo 201 grado 01), las competencias específicas incluyen Disciplina (seguimiento de instrucciones, aceptación de supervisión, cumplimiento de normas) y Responsabilidad (uso eficiente del tiempo y recursos asignados). Estas se suman a las seis competencias comunes: aprendizaje continuo, orientación a resultados, orientación al usuario, compromiso con la organización, trabajo en equipo y adaptación al cambio.`;

  const integQuestions = [
    {
      text: "Un contribuyente que usted conoce personalmente le pide que agilice su trámite del RUT por encima de los demás turnos. ¿Cómo debe actuar según el Código de Integridad?",
      explanation: "Los valores de HONESTIDAD y JUSTICIA prohíben dar trato preferencial a conocidos. Todos los ciudadanos deben recibir atención bajo las mismas condiciones, sin importar la relación personal.",
      options: [
        { text: "Atenderlo bajo las mismas condiciones que a cualquier otro ciudadano, respetando el orden de turnos", isCorrect: true  },
        { text: "Agilizar el trámite discretamente, ya que es una persona de confianza",                              isCorrect: false },
        { text: "Pedirle que vuelva otro día cuando haya menos gente para ayudarlo mejor",                            isCorrect: false },
        { text: "Derivarlo a un compañero para evitar el conflicto de interés",                                       isCorrect: false },
      ],
    },
    {
      text: "Un ciudadano de origen indígena se acerca a la ventanilla y tiene dificultades para expresar su solicitud en español. Un compañero le sugiere que le diga que vuelva con un traductor. ¿Qué debe hacer usted?",
      explanation: "El valor de RESPETO exige tratar a todos con dignidad, sin discriminación por etnia o idioma. El servidor debe usar lenguaje incluyente y buscar los medios para atender la solicitud, no rechazar al ciudadano.",
      options: [
        { text: "Tomarse el tiempo necesario para entender la solicitud, usando lenguaje sencillo y recursos visuales si es necesario", isCorrect: true  },
        { text: "Seguir la sugerencia del compañero y pedirle que vuelva con alguien que traduzca",                                    isCorrect: false },
        { text: "Atenderlo rápidamente con un trámite genérico para no retrasar la fila",                                              isCorrect: false },
        { text: "Remitirlo directamente a la oficina de atención especial sin intentar atenderlo",                                     isCorrect: false },
      ],
    },
    {
      text: "Descubre que un compañero de trabajo está modificando datos en el sistema del RUT sin autorización del contribuyente. Según el valor de Honestidad, ¿cuál es la conducta correcta?",
      explanation: "HONESTIDAD exige denunciar delitos o irregularidades de los que se tenga conocimiento. Callar o ser cómplice viola el Código de Integridad y puede generar responsabilidad disciplinaria.",
      options: [
        { text: "Reportar la irregularidad al superior inmediato o al canal de denuncias de la entidad",       isCorrect: true  },
        { text: "Hablar con el compañero en privado y pedirle que no lo vuelva a hacer",                       isCorrect: false },
        { text: "Ignorar la situación porque no es su responsabilidad directa",                                isCorrect: false },
        { text: "Esperar a tener más pruebas antes de actuar, para no perjudicar al compañero",                isCorrect: false },
      ],
    },
    {
      text: "Le asignan tramitar 15 PQRSF que vencen en los próximos 5 días. Usted sabe que no podrá responderlas todas con la calidad esperada en ese plazo. Según el valor de Diligencia, ¿qué debe hacer?",
      explanation: "DILIGENCIA implica cumplir plazos y asegurar calidad. Cuando hay conflicto entre ambos, el servidor debe informar oportunamente al superior para buscar una solución, no sacrificar calidad ni incumplir en silencio.",
      options: [
        { text: "Informar al superior inmediato sobre la situación y solicitar apoyo o priorización para cumplir dentro de los plazos", isCorrect: true  },
        { text: "Responder las 15 de forma superficial para cumplir el plazo",                                                         isCorrect: false },
        { text: "Responder solo las más fáciles y dejar vencer las demás sin avisar",                                                  isCorrect: false },
        { text: "Trabajar horas extras sin reportarlo para sacarlas todas",                                                            isCorrect: false },
      ],
    },
    {
      text: "Una ciudadana le solicita información sobre el estado de su declaración de renta. Al revisar el sistema, usted nota que tiene una deuda pendiente. La ciudadana le dice 'por favor, no le diga a nadie'. ¿Cómo procede?",
      explanation: "El valor de JUSTICIA exige actuar con objetividad y basarse en la normativa. La información tributaria tiene su propio régimen de reserva, pero el servidor no puede ocultar información al contribuyente ni hacer pactos de silencio sobre obligaciones legales.",
      options: [
        { text: "Informarle objetivamente sobre su situación tributaria completa, incluyendo la deuda, conforme a los procedimientos establecidos", isCorrect: true  },
        { text: "Omitir la deuda y solo darle la información que solicitó, para no incomodarla",                                                   isCorrect: false },
        { text: "Decirle que no puede darle esa información y que consulte por otro canal",                                                        isCorrect: false },
        { text: "Prometerle que no le contará a nadie sobre la deuda",                                                                             isCorrect: false },
      ],
    },
    {
      text: "Un ciudadano se acerca muy molesto y le dice que la DIAN 'solo sirve para robar a la gente'. ¿Cuál es la conducta alineada con el valor de Compromiso?",
      explanation: "COMPROMISO implica empatizar con las necesidades del ciudadano. El servicio público es un deber, no un favor. Ante la frustración, el servidor mantiene la calma, escucha y busca resolver la necesidad real detrás del reclamo.",
      options: [
        { text: "Escuchar con calma, reconocer su frustración y orientarlo sobre cómo resolver su situación específica",   isCorrect: true  },
        { text: "Decirle que se calme primero y que vuelva cuando pueda hablar con respeto",                                isCorrect: false },
        { text: "Explicarle que los impuestos son necesarios y que debería estar agradecido con el Estado",                 isCorrect: false },
        { text: "Llamar a seguridad porque está alterando el orden en la oficina",                                          isCorrect: false },
      ],
    },
    {
      text: "Su jefe le pide que elabore un informe con datos que usted sabe que están incompletos, para presentarlo en una reunión urgente. ¿Qué debe hacer según el Código de Integridad?",
      explanation: "HONESTIDAD y DILIGENCIA obligan a reportar información veraz y completa. Presentar datos incompletos como si fueran definitivos viola la transparencia. El servidor debe informar las limitaciones al superior.",
      options: [
        { text: "Elaborar el informe señalando claramente qué datos están verificados y cuáles están pendientes de completar", isCorrect: true  },
        { text: "Elaborar el informe como se lo pidieron sin cuestionar, porque es una orden del jefe",                        isCorrect: false },
        { text: "Negarse a elaborar el informe hasta tener todos los datos completos",                                         isCorrect: false },
        { text: "Inventar los datos faltantes con estimaciones para que se vea completo",                                      isCorrect: false },
      ],
    },
    {
      text: "Un compañero del Nivel Técnico se niega a aceptar una corrección que su supervisor le hace sobre el procedimiento de foliación de documentos, diciendo 'yo llevo más tiempo aquí y sé cómo se hace'. Según las competencias del Nivel Técnico, ¿qué conducta debería tener?",
      explanation: "La competencia de DISCIPLINA del Nivel Técnico incluye la aceptación de supervisión y el seguimiento de instrucciones. El tiempo en el cargo no exime de cumplir los procedimientos vigentes ni de aceptar la retroalimentación del superior.",
      options: [
        { text: "Aceptar la corrección del supervisor y ajustar el procedimiento según la instrucción recibida",    isCorrect: true  },
        { text: "Mantener su método porque la experiencia pesa más que las instrucciones formales",                  isCorrect: false },
        { text: "Solicitar una reunión con el jefe del supervisor para que un tercero decida",                       isCorrect: false },
        { text: "Seguir la instrucción solo cuando el supervisor esté presente",                                     isCorrect: false },
      ],
    },
    {
      text: "Le asignan una función nueva que no conoce bien. Según la competencia de Aprendizaje Continuo, ¿cuál es la conducta esperada?",
      explanation: "APRENDIZAJE CONTINUO implica incorporar nuevos conocimientos y compartir saberes. El servidor proactivo busca capacitarse y pide apoyo, en vez de evadir la tarea o ejecutarla sin preparación.",
      options: [
        { text: "Investigar sobre la función, solicitar capacitación si es necesario, y compartir lo aprendido con el equipo", isCorrect: true  },
        { text: "Pedir que le reasignen la función a alguien que ya la conozca",                                                isCorrect: false },
        { text: "Intentar hacerla solo con lo que sabe para no mostrar debilidad",                                              isCorrect: false },
        { text: "Esperar a que un compañero le explique sin tomar iniciativa propia",                                           isCorrect: false },
      ],
    },
    {
      text: "Un ciudadano de la tercera edad llega minutos antes del cierre de atención con un trámite urgente. Sus compañeros ya están guardando sus cosas. ¿Qué refleja el valor de Compromiso?",
      explanation: "COMPROMISO implica empatizar con las necesidades de la gente. El servicio NO es un 'favor' sino un deber. El servidor comprometido atiende al ciudadano dentro de lo posible, especialmente a población vulnerable.",
      options: [
        { text: "Atender al ciudadano o, si no es posible completar el trámite, orientarlo para que sea el primero al día siguiente", isCorrect: true  },
        { text: "Decirle que el horario ya terminó y que vuelva mañana",                                                             isCorrect: false },
        { text: "Atenderlo pero con prisa para irse rápido, sin verificar que el trámite quede bien",                                isCorrect: false },
        { text: "Sugerirle que haga el trámite por internet porque es más rápido",                                                   isCorrect: false },
      ],
    },
  ];

  let integLesson = await prisma.lesson.findFirst({ where: { moduleId: integ.id } });
  if (!integLesson) {
    integLesson = await prisma.lesson.create({
      data: {
        moduleId: integ.id,
        title: "Código de Integridad y dilemas éticos del servidor público",
        order: 1,
        type: "QUIZ",
        xpReward: 150,
        content: { passage: integPassage },
      },
    });
  } else {
    await prisma.lesson.update({ where: { id: integLesson.id }, data: { content: { passage: integPassage } } });
  }

  const oldIntegQs = await prisma.question.findMany({ where: { lessonId: integLesson.id }, select: { id: true } });
  if (oldIntegQs.length > 0) {
    const ids = oldIntegQs.map((x) => x.id);
    await prisma.questionOption.deleteMany({ where: { questionId: { in: ids } } });
    await prisma.question.deleteMany({ where: { id: { in: ids } } });
  }

  for (const q of integQuestions) {
    await prisma.question.create({
      data: {
        lessonId: integLesson.id,
        text: q.text,
        explanation: q.explanation,
        type: "SITUATIONAL",
        status: "PUBLISHED",
        source: "manual",
        options: { create: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect, score: 0 })) },
      },
    });
  }
  console.log(`✅ Integridad: ${integQuestions.length} dilemas éticos del Código de Integridad listos.`);

  // ─── Modernización, Gobierno Digital y Ofimática ──────────────────
  console.log("💻 Configurando Modernización y Gobierno Digital...");
  const digital = await prisma.module.upsert({
    where: { slug: "gobierno-digital-ofimatica" },
    update: {},
    create: {
      title: "Gobierno Digital y Ofimática",
      slug: "gobierno-digital-ofimatica",
      order: 12,
      xpReward: 300,
      description: "Transformación digital, seguridad de la información, herramientas ofimáticas y sistemas DIAN",
    },
  });

  const digitalPassage = `La Estrategia Nacional de Gobierno Digital y el Plan Nacional de Desarrollo 2022-2026 impulsan la modernización del servicio público colombiano. El Modelo Integrado de Planeación y Gestión (MIPG) incluye la dimensión de Gestión del Conocimiento e Innovación, que promueve el uso de tecnologías de la información para mejorar la eficiencia y transparencia del Estado.

La Política de Gobierno Digital (Decreto 1008 de 2018, actualizado por el Decreto 767 de 2022) establece los lineamientos para la transformación digital de las entidades públicas. Sus habilitadores transversales incluyen: Arquitectura Empresarial, Seguridad y Privacidad de la Información, y Servicios Ciudadanos Digitales (autenticación electrónica, carpeta ciudadana, e interoperabilidad).

La seguridad de la información en las entidades públicas se rige por el Modelo de Seguridad y Privacidad de la Información (MSPI), alineado con la norma ISO 27001. Todo servidor público es responsable de proteger la confidencialidad, integridad y disponibilidad de la información institucional. Las contraseñas son personales e intransferibles, los datos de los contribuyentes tienen reserva tributaria (Art. 583 del Estatuto Tributario), y el tratamiento de datos personales debe cumplir la Ley 1581 de 2012 (Habeas Data).

El Analista I de la DIAN utiliza diariamente herramientas ofimáticas y sistemas institucionales para el cumplimiento de sus funciones en el subproceso de Asistencia al Usuario:

EXCEL: Herramienta fundamental para el manejo de datos tributarios. Las funciones más utilizadas incluyen: BUSCARV/XLOOKUP (buscar datos de contribuyentes), SUMAR.SI/CONTAR.SI (consolidar información por criterios), tablas dinámicas (analizar grandes volúmenes de datos de PQRSF), filtros y ordenamiento (depurar listados de trámites), formato condicional (identificar vencimientos o alertas), y validación de datos (evitar errores en la captura de información del RUT).

WORD: Utilizado para la elaboración de respuestas a PQRSF, informes y comunicaciones oficiales. Funciones clave: estilos y plantillas institucionales (garantizar imagen corporativa), combinación de correspondencia (generar respuestas masivas personalizadas a peticiones), control de cambios y comentarios (revisión colaborativa de documentos), tabla de contenido automática (documentos extensos), y protección de documentos (evitar modificaciones no autorizadas).

CORREO ELECTRÓNICO INSTITUCIONAL: Canal oficial de comunicación. Buenas prácticas: usar siempre el correo institucional para asuntos de trabajo (nunca el personal), verificar destinatarios antes de enviar información reservada, no abrir archivos adjuntos sospechosos (prevención de phishing), y organizar bandejas con carpetas y reglas para gestionar el volumen de PQRSF.

SISTEMAS DIAN: El funcionario opera el sistema de información del RUT (inscripción, actualización, consulta), el sistema de gestión de PQRSF (radicación, asignación, seguimiento, respuesta), y los sistemas de gestión documental electrónica para el archivo y trazabilidad de actuaciones.

La protección de datos es crítica: compartir contraseñas, enviar información de contribuyentes por canales no autorizados, o no cerrar sesión en equipos compartidos son faltas graves contra la seguridad de la información.`;

  const digitalQuestions = [
    {
      text: "Un Analista I de la DIAN necesita buscar los datos de un contribuyente específico en una hoja de cálculo con 10.000 registros, usando el número de NIT como criterio de búsqueda. ¿Cuál función de Excel es la más apropiada para esta tarea?",
      explanation: "BUSCARV (o XLOOKUP) permite buscar un valor específico (NIT) en la primera columna de un rango y devolver datos de las columnas adyacentes. Es la función estándar para consultas en bases de datos tabulares.",
      options: [
        { text: "BUSCARV, utilizando el NIT como valor de búsqueda en la primera columna del rango de datos",           isCorrect: true  },
        { text: "SUMAR.SI, sumando todos los registros que coincidan con el NIT buscado",                                isCorrect: false },
        { text: "CONTAR.SI, para contar cuántas veces aparece el NIT en la base de datos",                               isCorrect: false },
        { text: "CONCATENAR, para unir el NIT con los demás datos del contribuyente en una sola celda",                  isCorrect: false },
      ],
    },
    {
      text: "La dependencia del Analista I debe enviar 200 respuestas individuales a peticiones de ciudadanos, cada una personalizada con el nombre, número de radicado y fecha de respuesta. ¿Cuál funcionalidad de Word optimiza esta tarea?",
      explanation: "La combinación de correspondencia (mail merge) permite crear documentos personalizados masivamente a partir de una plantilla y una base de datos (Excel o CSV) con los datos variables de cada destinatario.",
      options: [
        { text: "Combinación de correspondencia, vinculando una plantilla de respuesta con la base de datos de peticionarios",  isCorrect: true  },
        { text: "Copiar y pegar la plantilla 200 veces, cambiando manualmente los datos en cada una",                           isCorrect: false },
        { text: "Macros de Visual Basic, programando un script que modifique automáticamente el documento",                      isCorrect: false },
        { text: "Insertar campos de formulario en el documento para que cada ciudadano llene sus propios datos",                 isCorrect: false },
      ],
    },
    {
      text: "Un compañero le pide su contraseña del sistema del RUT para consultar un caso urgente mientras usted está en reunión. De conformidad con el Modelo de Seguridad y Privacidad de la Información (MSPI), ¿cómo debe proceder?",
      explanation: "Las contraseñas son personales e intransferibles según el MSPI y la política de seguridad de la información. Compartirlas es una falta grave, incluso con compañeros de confianza. El compañero debe usar sus propias credenciales o esperar.",
      options: [
        { text: "No compartir la contraseña bajo ninguna circunstancia e indicarle que use sus propias credenciales o espere su retorno",  isCorrect: true  },
        { text: "Compartirla solo esta vez porque es urgente, pidiéndole que la cambie después",                                            isCorrect: false },
        { text: "Enviarla por correo institucional cifrado, ya que el canal es seguro",                                                     isCorrect: false },
        { text: "Darle solo el usuario y pedirle que solicite una contraseña temporal al área de sistemas",                                 isCorrect: false },
      ],
    },
    {
      text: "El Analista I necesita analizar el volumen de PQRSF recibidas durante el último trimestre, clasificadas por tipo (petición, queja, reclamo, sugerencia, felicitación) y por mes. ¿Cuál herramienta de Excel es la más eficiente para este análisis?",
      explanation: "Las tablas dinámicas permiten resumir, analizar y presentar grandes volúmenes de datos agrupándolos por múltiples criterios (tipo de PQRSF y mes). Son la herramienta estándar para análisis multidimensional en Excel.",
      options: [
        { text: "Tabla dinámica, agrupando los datos por tipo de PQRSF en filas y por mes en columnas",                                    isCorrect: true  },
        { text: "Formato condicional, coloreando cada tipo de PQRSF con un color diferente",                                                isCorrect: false },
        { text: "Función SUMAR.SI anidada, creando una fórmula por cada combinación de tipo y mes",                                         isCorrect: false },
        { text: "Ordenar alfabéticamente por tipo de PQRSF y contar manualmente los registros de cada mes",                                 isCorrect: false },
      ],
    },
    {
      text: "Un ciudadano envía una solicitud al correo personal (Gmail) del Analista I porque no encontró el correo institucional. El funcionario, de conformidad con las políticas de seguridad de la información, debe:",
      explanation: "Los asuntos institucionales deben tramitarse exclusivamente por canales oficiales. El servidor debe orientar al ciudadano hacia el canal correcto y nunca gestionar trámites desde correo personal, para garantizar trazabilidad y protección de datos.",
      options: [
        { text: "No tramitar la solicitud desde el correo personal, responder indicando el correo institucional correcto y los canales oficiales de la DIAN",  isCorrect: true  },
        { text: "Reenviar la solicitud desde su correo personal al correo institucional para darle trámite",                                                    isCorrect: false },
        { text: "Responder desde el correo personal para no demorar al ciudadano, y luego registrar el trámite en el sistema",                                 isCorrect: false },
        { text: "Ignorar el correo porque no llegó por canal oficial y el ciudadano debe buscar la información por su cuenta",                                 isCorrect: false },
      ],
    },
    {
      text: "De conformidad con la Ley 1581 de 2012 (Habeas Data) y el artículo 583 del Estatuto Tributario, ¿cuál afirmación es correcta respecto a la información de los contribuyentes que maneja el Analista I?",
      explanation: "El artículo 583 del Estatuto Tributario establece la reserva tributaria: la información de los contribuyentes tiene carácter reservado y solo puede ser utilizada para los fines propios de la administración tributaria. La Ley 1581 de 2012 regula el tratamiento de datos personales.",
      options: [
        { text: "La información tributaria tiene carácter reservado y solo puede usarse para los fines propios de la administración tributaria, conforme a la reserva del artículo 583 E.T.",  isCorrect: true  },
        { text: "La información tributaria es pública y cualquier ciudadano puede solicitar datos de otro contribuyente mediante derecho de petición",                                          isCorrect: false },
        { text: "La reserva tributaria aplica solo para contribuyentes personas jurídicas; los datos de personas naturales son de libre consulta",                                              isCorrect: false },
        { text: "El Analista I puede compartir información tributaria con otras entidades públicas sin restricción, por el principio de coordinación administrativa",                           isCorrect: false },
      ],
    },
    {
      text: "El Analista I recibe un correo electrónico que aparenta ser del administrador de sistemas de la DIAN, solicitando que haga clic en un enlace para 'actualizar su contraseña del sistema RUT'. ¿Cuál es la conducta correcta frente a esta situación?",
      explanation: "Este es un caso típico de phishing (suplantación de identidad). Los administradores de sistemas nunca solicitan contraseñas ni credenciales por correo electrónico. El servidor debe reportar el correo sospechoso al área de seguridad informática sin hacer clic en ningún enlace.",
      options: [
        { text: "No hacer clic en el enlace, no responder al correo, y reportarlo inmediatamente al área de seguridad informática de la entidad",                                              isCorrect: true  },
        { text: "Hacer clic en el enlace y cambiar la contraseña porque proviene del administrador del sistema",                                                                                isCorrect: false },
        { text: "Reenviar el correo a todos los compañeros para que también actualicen sus contraseñas",                                                                                       isCorrect: false },
        { text: "Responder al correo solicitando verificación de identidad antes de hacer clic en el enlace",                                                                                  isCorrect: false },
      ],
    },
    {
      text: "De conformidad con la Política de Gobierno Digital (Decreto 767 de 2022), ¿cuál de los siguientes es un habilitador transversal de la transformación digital del Estado colombiano?",
      explanation: "Los habilitadores transversales de la Política de Gobierno Digital incluyen: Arquitectura Empresarial, Seguridad y Privacidad de la Información, y Servicios Ciudadanos Digitales (autenticación electrónica, carpeta ciudadana, interoperabilidad).",
      options: [
        { text: "Seguridad y Privacidad de la Información, como componente del Modelo de Seguridad y Privacidad (MSPI)",                                                                      isCorrect: true  },
        { text: "La adquisición obligatoria de software propietario para todas las entidades del Estado",                                                                                      isCorrect: false },
        { text: "La eliminación total del papel en las entidades públicas antes de 2025",                                                                                                      isCorrect: false },
        { text: "La tercerización de todos los servicios tecnológicos del Estado a empresas privadas",                                                                                         isCorrect: false },
      ],
    },
    {
      text: "El Analista I necesita proteger un documento de Word que contiene una respuesta oficial a una PQRSF, evitando que otros funcionarios modifiquen el contenido antes de su envío. ¿Cuál funcionalidad de Word debe utilizar?",
      explanation: "La protección de documentos en Word permite restringir la edición, marcando el documento como 'solo lectura' o permitiendo solo comentarios. Esto garantiza la integridad del documento oficial antes de su envío al ciudadano.",
      options: [
        { text: "Proteger documento con restricción de edición, permitiendo solo lectura o solo comentarios según el caso",                                                                    isCorrect: true  },
        { text: "Guardar el documento en formato PDF, que no se puede editar bajo ninguna circunstancia",                                                                                      isCorrect: false },
        { text: "Enviar el documento inmediatamente sin protección, confiando en que los compañeros no lo modificarán",                                                                        isCorrect: false },
        { text: "Colocar una marca de agua con la palabra 'CONFIDENCIAL' para disuadir modificaciones",                                                                                       isCorrect: false },
      ],
    },
    {
      text: "Un Analista I necesita identificar rápidamente cuáles PQRSF de su listado en Excel están próximas a vencer (faltan menos de 3 días hábiles). ¿Cuál herramienta de Excel permite visualizar estas alertas de forma automática?",
      explanation: "El formato condicional permite aplicar colores, iconos o barras automáticamente a las celdas que cumplan una condición específica (por ejemplo, resaltar en rojo las fechas con menos de 3 días para el vencimiento). Es la herramienta ideal para alertas visuales.",
      options: [
        { text: "Formato condicional, configurando una regla que resalte en rojo las celdas con fechas de vencimiento próximas",                                                               isCorrect: true  },
        { text: "Validación de datos, bloqueando las celdas que contengan fechas vencidas",                                                                                                    isCorrect: false },
        { text: "Filtro avanzado, mostrando solo las PQRSF vencidas y ocultando las demás",                                                                                                   isCorrect: false },
        { text: "Comentarios en cada celda, anotando manualmente cuáles están próximas a vencer",                                                                                              isCorrect: false },
      ],
    },
  ];

  let digitalLesson = await prisma.lesson.findFirst({ where: { moduleId: digital.id } });
  if (!digitalLesson) {
    digitalLesson = await prisma.lesson.create({
      data: {
        moduleId: digital.id,
        title: "Gobierno Digital, seguridad de la información y ofimática aplicada",
        order: 1,
        type: "QUIZ",
        xpReward: 150,
        content: { passage: digitalPassage },
      },
    });
  } else {
    await prisma.lesson.update({ where: { id: digitalLesson.id }, data: { content: { passage: digitalPassage } } });
  }

  const oldDigQs = await prisma.question.findMany({ where: { lessonId: digitalLesson.id }, select: { id: true } });
  if (oldDigQs.length > 0) {
    const ids = oldDigQs.map((x) => x.id);
    await prisma.questionOption.deleteMany({ where: { questionId: { in: ids } } });
    await prisma.question.deleteMany({ where: { id: { in: ids } } });
  }

  for (const q of digitalQuestions) {
    await prisma.question.create({
      data: {
        lessonId: digitalLesson.id,
        text: q.text,
        explanation: q.explanation,
        type: "SITUATIONAL",
        status: "PUBLISHED",
        source: "manual",
        options: { create: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect, score: 0 })) },
      },
    });
  }
  console.log(`✅ Gobierno Digital y Ofimática: ${digitalQuestions.length} preguntas situacionales listas.`);

  // ─── Razonamiento Lógico ─────────────────────────────────────────
  console.log("🧠 Configurando Razonamiento Lógico...");
  const rl = await prisma.module.findUnique({ where: { slug: "razonamiento-logico" } });
  if (rl) {
    const rlPassage = `El componente de Razonamiento Lógico evalúa la capacidad del aspirante para analizar información, identificar patrones, resolver problemas y llegar a conclusiones válidas. No se basa en conocimientos legales específicos sino en habilidades cognitivas fundamentales para el ejercicio del cargo público.

Las áreas evaluadas incluyen:

SERIES NUMÉRICAS: Identificar el patrón que rige una secuencia de números y determinar el siguiente elemento. Los patrones pueden ser aritméticos (suma/resta constante), geométricos (multiplicación/división constante), mixtos (combinación de operaciones), o alternos (dos patrones intercalados).

ANALOGÍAS: Identificar la relación que existe entre un par de conceptos y aplicar esa misma relación a otro par. Ejemplo: Médico es a Hospital como Profesor es a Escuela (relación: profesional - lugar de trabajo).

SILOGISMOS: Evaluar la validez de conclusiones a partir de premisas dadas. Un silogismo válido tiene dos premisas y una conclusión que se deriva lógicamente de ellas. Ejemplo: Premisa 1: Todos los servidores públicos deben cumplir la ley. Premisa 2: Juan es servidor público. Conclusión válida: Juan debe cumplir la ley.

INTERPRETACIÓN DE TABLAS Y GRÁFICOS: Leer, analizar y extraer conclusiones de información presentada en tablas, gráficos de barras, gráficos circulares o diagramas. Se evalúa la capacidad de comparar datos, calcular porcentajes y identificar tendencias.

LÓGICA PROPOSICIONAL: Evaluar el valor de verdad de proposiciones compuestas usando conectores lógicos: Y (conjunción, ambas deben ser verdaderas), O (disyunción, al menos una verdadera), NO (negación), SI...ENTONCES (condicional, solo es falso cuando el antecedente es verdadero y el consecuente falso).

ORDENAMIENTO Y ORGANIZACIÓN: Determinar posiciones, secuencias o clasificaciones a partir de un conjunto de condiciones o restricciones dadas.`;

    let rlLesson = await prisma.lesson.findFirst({ where: { moduleId: rl.id } });
    if (!rlLesson) {
      rlLesson = await prisma.lesson.create({
        data: { moduleId: rl.id, title: "Series, analogías, silogismos y lógica", order: 1, type: "QUIZ", xpReward: 150, content: { passage: rlPassage } },
      });
    } else {
      await prisma.lesson.update({ where: { id: rlLesson.id }, data: { content: { passage: rlPassage } } });
    }

    const rlQuestions = [
      {
        text: "¿Cuál es el siguiente número en la serie: 2, 6, 18, 54, ...?",
        explanation: "Es una serie geométrica donde cada término se multiplica por 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162.",
        options: [
          { text: "162", isCorrect: true },
          { text: "108", isCorrect: false },
          { text: "72", isCorrect: false },
          { text: "148", isCorrect: false },
        ],
      },
      {
        text: "¿Cuál es el siguiente número en la serie: 3, 7, 15, 31, ...?",
        explanation: "Cada término se obtiene multiplicando el anterior por 2 y sumando 1: 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63.",
        options: [
          { text: "63", isCorrect: true },
          { text: "62", isCorrect: false },
          { text: "47", isCorrect: false },
          { text: "59", isCorrect: false },
        ],
      },
      {
        text: "Complete la analogía: Médico es a Hospital como Juez es a ___",
        explanation: "La relación es profesional → lugar donde ejerce. El médico ejerce en el hospital; el juez ejerce en el juzgado (o tribunal).",
        options: [
          { text: "Juzgado", isCorrect: true },
          { text: "Cárcel", isCorrect: false },
          { text: "Fiscalía", isCorrect: false },
          { text: "Abogado", isCorrect: false },
        ],
      },
      {
        text: "Complete la analogía: Impuesto es a DIAN como Delito es a ___",
        explanation: "La relación es materia → entidad competente. La DIAN administra los impuestos; la Fiscalía investiga los delitos.",
        options: [
          { text: "Fiscalía", isCorrect: true },
          { text: "Procuraduría", isCorrect: false },
          { text: "Contraloría", isCorrect: false },
          { text: "Defensoría", isCorrect: false },
        ],
      },
      {
        text: "Premisa 1: Todos los funcionarios de la DIAN deben conocer el Estatuto Tributario. Premisa 2: Ana es funcionaria de la DIAN. ¿Qué conclusión es lógicamente válida?",
        explanation: "Si todos los funcionarios DIAN deben conocer el E.T. (premisa universal) y Ana es funcionaria DIAN (premisa particular), entonces Ana debe conocer el E.T. (conclusión válida por silogismo categórico).",
        options: [
          { text: "Ana debe conocer el Estatuto Tributario", isCorrect: true },
          { text: "Ana es experta en el Estatuto Tributario", isCorrect: false },
          { text: "Todos los que conocen el Estatuto Tributario trabajan en la DIAN", isCorrect: false },
          { text: "Ana escogió trabajar en la DIAN porque conoce el Estatuto Tributario", isCorrect: false },
        ],
      },
      {
        text: "Premisa 1: Ningún documento reservado puede ser divulgado al público. Premisa 2: Las declaraciones de renta son documentos reservados. ¿Qué conclusión es válida?",
        explanation: "Si ningún documento reservado puede divulgarse (universal negativa) y las declaraciones son reservadas, entonces las declaraciones no pueden divulgarse. Es un silogismo válido en modo Celarent.",
        options: [
          { text: "Las declaraciones de renta no pueden ser divulgadas al público", isCorrect: true },
          { text: "Solo la DIAN puede ver las declaraciones de renta", isCorrect: false },
          { text: "Los documentos públicos incluyen las declaraciones de renta", isCorrect: false },
          { text: "Todos los documentos reservados son declaraciones de renta", isCorrect: false },
        ],
      },
      {
        text: "Si la proposición 'Si llueve, entonces llevo paraguas' es VERDADERA, ¿cuál de las siguientes situaciones la hace FALSA?",
        explanation: "Un condicional (SI...ENTONCES) solo es FALSO cuando el antecedente es verdadero y el consecuente es falso. Es decir: llueve (verdadero) Y no llevo paraguas (falso) = la proposición es falsa.",
        options: [
          { text: "Llueve y NO llevo paraguas", isCorrect: true },
          { text: "No llueve y no llevo paraguas", isCorrect: false },
          { text: "No llueve y llevo paraguas", isCorrect: false },
          { text: "Llueve y llevo paraguas", isCorrect: false },
        ],
      },
      {
        text: "¿Cuál es el siguiente número en la serie: 1, 1, 2, 3, 5, 8, 13, ...?",
        explanation: "Es la serie de Fibonacci: cada término es la suma de los dos anteriores. 5+8=13, 8+13=21.",
        options: [
          { text: "21", isCorrect: true },
          { text: "18", isCorrect: false },
          { text: "20", isCorrect: false },
          { text: "26", isCorrect: false },
        ],
      },
      {
        text: "En una oficina de la DIAN hay 5 funcionarios: Ana, Bernardo, Carla, Diego y Elena. Ana se sienta a la izquierda de Bernardo. Carla se sienta entre Diego y Elena. Diego no se sienta en los extremos. ¿Quién se sienta en el extremo derecho?",
        explanation: "Diego no está en los extremos y Carla está entre Diego y Elena. Si Diego está en posición 2, 3 o 4, y Carla está entre Diego y Elena, probando las combinaciones: Ana-Bernardo pueden estar juntos (Ana a la izquierda). Una solución válida: Ana, Bernardo, Diego, Carla, Elena. Elena está en el extremo derecho.",
        options: [
          { text: "Elena", isCorrect: true },
          { text: "Carla", isCorrect: false },
          { text: "Diego", isCorrect: false },
          { text: "Bernardo", isCorrect: false },
        ],
      },
      {
        text: "Si 'Todos los contribuyentes deben declarar renta' es VERDADERO, ¿cuál de las siguientes afirmaciones es necesariamente VERDADERA?",
        explanation: "Si TODOS los contribuyentes deben declarar, y Pedro es contribuyente, entonces Pedro debe declarar. Las otras opciones no se derivan lógicamente: no sabemos si los no contribuyentes declaran, ni si declarar te hace contribuyente.",
        options: [
          { text: "Si Pedro es contribuyente, entonces Pedro debe declarar renta", isCorrect: true },
          { text: "Si Pedro declara renta, entonces Pedro es contribuyente", isCorrect: false },
          { text: "Si Pedro no es contribuyente, entonces no debe declarar renta", isCorrect: false },
          { text: "Todos los que declaran renta son contribuyentes", isCorrect: false },
        ],
      },
    ];

    const oldRlQs = await prisma.question.findMany({ where: { lessonId: rlLesson.id }, select: { id: true } });
    if (oldRlQs.length > 0) {
      const ids = oldRlQs.map((x) => x.id);
      await prisma.questionOption.deleteMany({ where: { questionId: { in: ids } } });
      await prisma.question.deleteMany({ where: { id: { in: ids } } });
    }

    for (const q of rlQuestions) {
      await prisma.question.create({
        data: {
          lessonId: rlLesson.id, text: q.text, explanation: q.explanation,
          type: "SITUATIONAL", status: "PUBLISHED", source: "manual",
          options: { create: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect, score: 0 })) },
        },
      });
    }
    console.log(`✅ Razonamiento Lógico: ${rlQuestions.length} preguntas listas.`);
  }
  // ─── Logros (Achievements) ────────────────────────────────────────
  console.log("🏅 Configurando logros...");
  const achievements = [
    { key: "first_quiz",     name: "Primera leccion",     description: "Completaste tu primera leccion",           icon: "🎯", xpReward: 50,  conditionType: "MODULES_COMPLETED" as const, conditionValue: 0 },
    { key: "module_1",       name: "Primer modulo",       description: "Completaste un modulo completo",           icon: "📗", xpReward: 100, conditionType: "MODULES_COMPLETED" as const, conditionValue: 1 },
    { key: "module_3",       name: "Triple corona",       description: "Completaste 3 modulos",                    icon: "👑", xpReward: 200, conditionType: "MODULES_COMPLETED" as const, conditionValue: 3 },
    { key: "module_5",       name: "Medio camino",        description: "Completaste 5 modulos",                    icon: "🏔️", xpReward: 300, conditionType: "MODULES_COMPLETED" as const, conditionValue: 5 },
    { key: "module_10",      name: "Conquistador DIAN",   description: "Completaste los 10 modulos",               icon: "🏆", xpReward: 500, conditionType: "MODULES_COMPLETED" as const, conditionValue: 10 },
    { key: "perfect_score",  name: "Perfeccion",          description: "Obtuviste 100% en una leccion",            icon: "💎", xpReward: 150, conditionType: "PERFECT_SCORE" as const,     conditionValue: 100 },
    { key: "streak_3",       name: "Racha de 3",          description: "Estudiaste 3 dias seguidos",               icon: "🔥", xpReward: 100, conditionType: "STREAK" as const,            conditionValue: 3 },
    { key: "streak_7",       name: "Semana imparable",    description: "Estudiaste 7 dias seguidos",               icon: "⚡", xpReward: 250, conditionType: "STREAK" as const,            conditionValue: 7 },
    { key: "xp_500",         name: "Aspirante dedicado",  description: "Acumulaste 500 XP",                        icon: "⭐", xpReward: 100, conditionType: "XP_TOTAL" as const,          conditionValue: 500 },
    { key: "xp_2000",        name: "Analista en formacion", description: "Acumulaste 2000 XP",                     icon: "🌟", xpReward: 300, conditionType: "XP_TOTAL" as const,          conditionValue: 2000 },
    { key: "xp_5000",        name: "Listo para el examen", description: "Acumulaste 5000 XP",                      icon: "🎓", xpReward: 500, conditionType: "XP_TOTAL" as const,          conditionValue: 5000 },
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { key: a.key },
      update: {},
      create: a,
    });
  }
  console.log(`✅ ${achievements.length} logros configurados.`);
  console.log("✅ Seed completado.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });