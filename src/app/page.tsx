import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const MODULES = [
  "Comprensión Lectora — 55 preguntas",
  "Constitución Política — 50 preguntas",
  "Derecho Administrativo — 50 preguntas",
  "Tributario - RUT — 40 preguntas",
  "Aduanero y Cambiario — 47 preguntas",
  "Competencias Funcionales — 60 preguntas",
  "Gestión Documental — 50 preguntas",
  "Comportamentales — 26 preguntas",
  "Integridad y Ética — 50 preguntas",
  "Gobierno Digital — 55 preguntas",
];

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0C447C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-semibold text-gray-900">DIAN Academy</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Iniciar sesion
            </Link>
            <Link href="/register" className="text-sm bg-[#0C447C] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#185FA5]">
              Empezar gratis
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <div className="inline-block bg-[#E6F1FB] text-[#0C447C] text-xs font-medium px-3 py-1 rounded-full mb-4">
          Concurso DIAN 2676 - Analista I
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Preparate para el concurso de meritos de la DIAN con IA
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
          Plataforma gamificada con +480 preguntas situacionales tipo CNSC, generadas con inteligencia artificial y fundamentadas en la normativa oficial vigente.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/register" className="bg-[#0C447C] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#185FA5]">
            Empezar gratis
          </Link>
          <a href="#modulos" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50">
            Ver modulos
          </a>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-[#0C447C]">483+</p>
            <p className="text-sm text-gray-500">Preguntas tipo CNSC</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#0C447C]">10</p>
            <p className="text-sm text-gray-500">Modulos tematicos</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#0C447C]">100%</p>
            <p className="text-sm text-gray-500">Fundamentado en ley</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#0C447C]">IA</p>
            <p className="text-sm text-gray-500">Preguntas nuevas cada semana</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Por que DIAN Academy?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Preguntas situacionales</h3>
            <p className="text-sm text-gray-500">Cada pregunta plantea un caso real que enfrentaras como Analista I. No memorizacion: aplicacion.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Generadas con IA</h3>
            <p className="text-sm text-gray-500">Fundamentadas en los textos oficiales de la ley. Cada intento muestra preguntas diferentes.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Progreso gamificado</h3>
            <p className="text-sm text-gray-500">XP, niveles, rachas y desbloqueo progresivo. Estudiar se siente como jugar.</p>
          </div>
        </div>
      </section>

      <section id="modulos" className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">10 modulos que cubren todo el examen</h2>
          <p className="text-sm text-gray-500 text-center mb-8">Funcionales (60-70%) + Comportamentales (15-20%) + Integridad (10%)</p>
          <div className="grid md:grid-cols-2 gap-3">
            {MODULES.map((mod) => (
              <div key={mod} className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4">
                <div className="w-8 h-8 rounded-full bg-[#E6F1FB] text-[#0C447C] flex items-center justify-center text-xs font-bold shrink-0">
                  {MODULES.indexOf(mod) + 1}
                </div>
                <p className="text-sm font-medium text-gray-900">{mod}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Empieza hoy, gratis</h2>
        <p className="text-sm text-gray-500 mb-6">Crea tu cuenta en 30 segundos y comienza a practicar.</p>
        <Link href="/register" className="inline-block bg-[#0C447C] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#185FA5]">
          Crear cuenta gratuita
        </Link>
      </section>

      <footer className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-6 text-center">
          <p className="text-xs text-gray-400">
            DIAN Academy - Plataforma independiente de preparacion. No es un producto oficial de la DIAN ni de la CNSC.
          </p>
        </div>
      </footer>
    </div>
  );
}