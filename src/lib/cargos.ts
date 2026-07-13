export const CARGOS = [
  {
    id: "analista-1",
    name: "Analista I — Nivel Tecnico",
    description: "Asistencia al Usuario, RUT, PQRSF",
    modules: [
      "comprension-lectora",
      "razonamiento-logico",
      "constitucion-politica",
      "derecho-administrativo",
      "tributario-rut",
      "aduanero-cambiario",
      "competencias-funcionales",
      "gestion-documental",
      "competencias-comportamentales",
      "integridad",
      "gobierno-digital-ofimatica",
    ],
  },
  {
    id: "gestor-1",
    name: "Gestor I — Nivel Profesional",
    description: "Gestion tributaria, aduanera y cambiaria",
    modules: [
      "comprension-lectora",
      "razonamiento-logico",
      "constitucion-politica",
      "derecho-administrativo",
      "tributario-rut",
      "aduanero-cambiario",
      "competencias-funcionales-gestor-1",
      "competencias-comportamentales",
      "integridad",
    ],
  },
  {
    id: "facilitador",
    name: "Facilitador I — Nivel Asistencial",
    description: "Apoyo administrativo y operativo, gestion documental",
    modules: [
      "comprension-lectora",
      "razonamiento-logico",
      "constitucion-politica",
      "derecho-administrativo",
      "competencias-funcionales-facilitador",
      "gestion-documental",
      "competencias-comportamentales",
      "integridad",
    ],
  },
  {
    id: "otro-cnsc",
    name: "Otro concurso CNSC",
    description: "Modulos generales para cualquier concurso de meritos",
    modules: [
      "comprension-lectora",
      "razonamiento-logico",
      "constitucion-politica",
      "derecho-administrativo",
      "competencias-comportamentales",
      "integridad",
    ],
  },
];

export function getCargoModules(cargoId: string): string[] {
  const cargo = CARGOS.find((c) => c.id === cargoId);
  return cargo?.modules ?? CARGOS[0].modules;
}

export function getCargoName(cargoId: string): string {
  const cargo = CARGOS.find((c) => c.id === cargoId);
  return cargo?.name ?? "Analista I";
}
