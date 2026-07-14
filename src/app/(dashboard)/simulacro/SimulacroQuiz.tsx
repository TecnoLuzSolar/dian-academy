"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Option { id: string; text: string; isCorrect: boolean; }
interface Question { id: string; text: string; explanation: string; moduleName: string; options: Option[]; }

export default function SimulacroQuiz({
  questions,
  userId,
  userName,
  cargoName,
}: {
  questions: Question[];
  userId: string;
  userName: string;
  cargoName: string;
}) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60);

  const total = questions.length;
  const passCount = Math.ceil(total * 0.7);

  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft <= 0) { endExam(); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, started, finished]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  function selectOption(qId: string, optId: string, isCorrect: boolean) {
    if (answers[qId]) return;
    setAnswers((p) => ({ ...p, [qId]: optId }));
    if (isCorrect) setCorrect((c) => c + 1);
  }

  function endExam() { setFinished(true); }

  function getModuleBreakdown() {
    const breakdown: Record<string, { total: number; correct: number }> = {};
    questions.forEach((q) => {
      if (!breakdown[q.moduleName]) breakdown[q.moduleName] = { total: 0, correct: 0 };
      breakdown[q.moduleName].total++;
      const selected = answers[q.id];
      if (selected) {
        const opt = q.options.find((o) => o.id === selected);
        if (opt?.isCorrect) breakdown[q.moduleName].correct++;
      }
    });
    return breakdown;
  }

  // ─── PANTALLA INICIO ───
  if (!started) {
    return (
      <div className="text-center py-8">
        <img src="/icon-mark.png" alt="DIGNUS" className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Simulacro CNSC</h1>
        <p className="text-sm text-gray-500 mb-6">Prueba tipo CNSC — {cargoName}</p>
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 text-left max-w-md mx-auto">
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium text-gray-900">Preguntas:</span> {total} (aleatorias de los módulos de tu perfil)</p>
            <p><span className="font-medium text-gray-900">Tiempo:</span> 45 minutos</p>
            <p><span className="font-medium text-gray-900">Aprobación:</span> 70% ({passCount}/{total} correctas)</p>
            <p><span className="font-medium text-gray-900">Contenido:</span> Los módulos de tu ruta de aprendizaje</p>
          </div>
        </div>
        <button
          onClick={() => setStarted(true)}
          className="bg-[#0C447C] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#185FA5] transition-colors"
        >
          Iniciar simulacro
        </button>
      </div>
    );
  }

  // ─── PANTALLA RESULTADOS ───
  if (finished) {
    const score = Math.round((correct / total) * 100);
    const passed = score >= 70;
    const breakdown = getModuleBreakdown();
    const timeUsed = 45 * 60 - timeLeft;
    const minsUsed = Math.floor(timeUsed / 60);

    return (
      <div className="py-6">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{passed ? "🏆" : "📚"}</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            {correct}/{total} correctas — {score}%
          </h1>
          <p className="text-sm text-gray-500">
            {passed ? "¡Aprobado — excelente preparación!" : "No alcanzaste el 70%. Sigue practicando."}
            {" "}Tiempo: {minsUsed} min
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Resultado por módulo</h3>
          <div className="space-y-2">
            {Object.entries(breakdown).map(([mod, data]) => {
              const pct = Math.round((data.correct / data.total) * 100);
              return (
                <div key={mod} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 truncate">{mod}</p>
                  </div>
                  <div className="w-24 bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${pct >= 70 ? "bg-green-500" : "bg-red-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-16 text-right">{data.correct}/{data.total} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/simulacro")}
            className="flex-1 border border-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
          >
            Nuevo simulacro
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 bg-[#0C447C] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#185FA5]"
          >
            Ir al dashboard
          </button>
        </div>
      </div>
    );
  }

  // ─── PANTALLA PREGUNTA ───
  const q = questions[current];
  const answered = !!answers[q.id];
  const answeredCount = Object.keys(answers).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-gray-500">
          Pregunta {current + 1} de {total} — {answeredCount} respondidas
        </span>
        <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
          {mins}:{secs.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
        <div className="bg-[#0C447C] h-1.5 rounded-full" style={{ width: `${((current + 1) / total) * 100}%` }} />
      </div>

      <p className="text-xs text-[#0C447C] bg-[#E6F1FB] px-2 py-1 rounded inline-block mb-3">{q.moduleName}</p>
      <h2 className="text-base font-medium text-gray-900 mb-4 leading-snug">{q.text}</h2>

      <div className="space-y-2">
        {q.options.map((opt, idx) => {
          const isSelected = answers[q.id] === opt.id;
          let style = "border-gray-200 hover:bg-gray-50";
          if (answered) {
            if (opt.isCorrect) style = "border-green-400 bg-green-50 text-green-800";
            else if (isSelected) style = "border-red-400 bg-red-50 text-red-800";
          }
          return (
            <button
              key={opt.id}
              onClick={() => selectOption(q.id, opt.id, opt.isCorrect)}
              disabled={answered}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-colors ${style}`}
            >
              <span className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
              {opt.text}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-xl text-sm">{q.explanation}</div>
      )}

      {answered && (
        <button
          onClick={() => current < total - 1 ? setCurrent(current + 1) : endExam()}
          className="w-full mt-4 bg-[#0C447C] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#185FA5]"
        >
          {current < total - 1 ? "Siguiente" : "Finalizar simulacro"}
        </button>
      )}
    </div>
  );
}
