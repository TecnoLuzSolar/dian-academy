import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const modules = [
  { title: "Comprensión Lectora",       slug: "comprension-lectora",   order: 1, xpReward: 200, description: "Análisis de textos normativos e inferencia" },
  { title: "Razonamiento Lógico",       slug: "razonamiento-logico",   order: 2, xpReward: 250, description: "Series, silogismos y deducción" },
  { title: "Constitución Política",     slug: "constitucion-politica", order: 3, xpReward: 300, description: "Derechos fundamentales y estructura del Estado" },
  { title: "Derecho Administrativo",    slug: "derecho-administrativo",order: 4, xpReward: 350, description: "CPACA Ley 1437/2011 y PQRSF" },
  { title: "Tributario - RUT",          slug: "tributario-rut",        order: 5, xpReward: 400, description: "RUT, evasión, elusión y contrabando" },
  { title: "Aduanero y Cambiario",      slug: "aduanero-cambiario",    order: 6, xpReward: 350, description: "Régimen aduanero y control de divisas" },
  { title: "Competencias Funcionales",  slug: "competencias-funcionales", order: 7, xpReward: 300, description: "Gestión documental, MIPG y ética" },
  { title: "Simulacros DIAN",           slug: "simulacros-dian",       order: 8, xpReward: 500, description: "Pruebas completas tipo CNSC" },
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

  console.log(`✅ ${modules.length} módulos creados correctamente.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });