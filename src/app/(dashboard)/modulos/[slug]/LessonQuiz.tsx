"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Option   { id: string; text: string; isCorrect: boolean; }
interface Question { id: string; text: string; explanation: string; options: Option[]; }

interface Props {
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  passage: string;
  questions: Question[];
  questionsPerAttempt?: number;
}

// Mezcla aleatoria (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Elige N preguntas al azar del banco y mezcla sus opciones
function pickQuestions(pool: Question[], n: number): Question[] {
  const count = Math.min(n, pool.length);
  return shuffle(pool).slice(0, count).map((q) => ({ ...q, options: shuffle(q.options) }));
}

export default function LessonQuiz({
  moduleId, moduleTitle, lessonId, lessonTitle, passage, questions, questionsPerAttempt = 5,
}: Props) {
  const router = useRouter();
  const [step, setStep]       = useState(0);
  const [active, setActive]   = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [correct, setCorrect] = useState(0);
  const [saving, setSaving]   = useState(false);

  const totalSteps = active.length + 1;

  function startQuestions() {
    setActive(pickQuestions(questions, questionsPerAttempt));
    setStep(1);
  }

  function retry() {
    setStep(0);
    setActive([]);
    setAnswers({});
    setCorrect(0);
  }

  function selectOption(qId: string, optId: string, isCorrect: boolean) {
    if (answers[qId]) return;
    setAnswers((prev) => ({ ...prev, [qId]: optId }));
    if (isCorrect) setCorrect((c) => c + 1);
  }

  async function finish() {
    setSaving(true);
    const score = Math.round((correct / active.length) * 100);
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, lessonId, score, xpReward: 120 }),
    });
    setSaving(false);
    setStep(totalSteps);
  }

  // ─── PANTALLA DE LECTURA ───
  if (step === 0) {
    return (
      <div>
        <p className="text-xs text-gray-500 mb-1">{moduleTitle}</p>
        <h1 className="text-xl font-semibold text-gray-900 mb-4">{lessonTitle}</h1>

        <div className="bg-white border-l-4 border-[#0C447C] rounded-r-xl p-5 mb-4">
          <p className="text-xs font-medium text-gray-400 mb-3 tracking-wide">
            LECTURA NORMATIVA — Lee con atención
          </p>
          {passage.split("\n\n").map((par, i) => (
            <p key={i} className="text-sm text-gray-700 leading-relaxed mb-3">{par}</p>
          ))}
        </div>

        <div className="bg-[#E6F1FB] rounded-xl p-3 mb-4 text-center">
          <p className="text-xs text-[#0C447C]">
            🎲 Banco de {questions.length} preguntas · cada intento muestra {Math.min(questionsPerAttempt, questions.length)} distintas
          </p>
        </div>

        <button
          onClick={startQuestions}
          className="w-full bg-[#0C447C] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#185FA5] transition-colors"
        >
          Empezar preguntas →
        </button>
      </div>
    );
  }

  // ─── PANTALLA DE RESULTADO ───
  if (step === totalSteps) {
    const score  = Math.round((correct / active.length) * 100);
    const passed = score >= 70;
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-3">{passed ? "🎉" : "📚"}</div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {correct}/{active.length} correctas ({score}%)
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {passed
            ? "¡Lección completada! Ganaste +120 XP."
            : "Necesitas 70% para avanzar. ¡Inténtalo de nuevo con preguntas nuevas!"}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={retry}
            className="px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50"
          >
            Intentar de nuevo
          </button>
          <button
            onClick={() => { router.refresh(); router.push("/modulos"); }}
            className="px-4 py-2 bg-[#0C447C] text-white rounded-xl text-sm font-medium hover:bg-[#185FA5]"
          >
            Volver a la ruta →
          </button>
        </div>
      </div>
    );
  }

  // ─── PANTALLA DE PREGUNTA ───
  const q        = active[step - 1];
  const answered = !!answers[q.id];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full flex-1 ${i < step ? "bg-[#0C447C]" : "bg-gray-200"}`}
          />
        ))}
      </div>

      <p className="text-xs text-gray-500 mb-2">Pregunta {step} de {active.length}</p>
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
        <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-xl text-sm leading-relaxed">
          {q.explanation}
        </div>
      )}

      {answered && (
        <button
          onClick={() => (step < active.length ? setStep(step + 1) : finish())}
          disabled={saving}
          className="w-full mt-4 bg-[#0C447C] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#185FA5] transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : step < active.length ? "Siguiente pregunta →" : "Ver resultados →"}
        </button>
      )}
    </div>
  );
}