"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Option   { id: string; text: string; isCorrect: boolean; score: number; }
interface Question { id: string; text: string; explanation: string; type: string; options: Option[]; }

interface Props {
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  passage: string;
  questions: Question[];
  questionsPerAttempt?: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions(pool: Question[], n: number): Question[] {
  const count = Math.min(n, pool.length);
  return shuffle(pool).slice(0, count).map((q) => ({
    ...q,
    // En Likert NO mezclamos las opciones: la escala va de acuerdo a desacuerdo
    options: q.type === "LIKERT" ? q.options : shuffle(q.options),
  }));
}

export default function LessonQuiz({
  moduleId, moduleTitle, lessonId, lessonTitle, passage, questions, questionsPerAttempt = 5,
}: Props) {
  const router = useRouter();
  const [step, setStep]       = useState(0);
  const [active, setActive]   = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [correct, setCorrect] = useState(0);
  const [points, setPoints]   = useState(0);
  const [saving, setSaving]   = useState(false);

  const isLikert   = questions.length > 0 && questions[0].type === "LIKERT";
  const totalSteps = active.length + 1;

  function startQuestions() {
    setActive(pickQuestions(questions, questionsPerAttempt));
    setStep(1);
  }
  function retry() {
    setStep(0); setActive([]); setAnswers({}); setCorrect(0); setPoints(0);
  }
  function selectOption(qId: string, opt: Option) {
    if (answers[qId]) return;
    setAnswers((prev) => ({ ...prev, [qId]: opt.id }));
    if (isLikert) setPoints((p) => p + opt.score);
    else if (opt.isCorrect) setCorrect((c) => c + 1);
  }
  async function finish() {
    setSaving(true);
    const score = isLikert
      ? Math.round((points / (4 * active.length)) * 100)
      : Math.round((correct / active.length) * 100);
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, lessonId, score, xpReward: 120 }),
    });
    setSaving(false);
    setStep(totalSteps);
  }

  // ─── LECTURA ───
  if (step === 0) {
    return (
      <div>
        <p className="text-xs text-gray-500 mb-1">{moduleTitle}</p>
        <h1 className="text-xl font-semibold text-gray-900 mb-4">{lessonTitle}</h1>
        <div className="bg-white border-l-4 border-[#0C447C] rounded-r-xl p-5 mb-4">
          <p className="text-xs font-medium text-gray-400 mb-3 tracking-wide">
            {isLikert ? "AUTOEVALUACIÓN — Lee con atención" : "LECTURA NORMATIVA — Lee con atención"}
          </p>
          {passage.split("\n\n").map((par, i) => (
            <p key={i} className="text-sm text-gray-700 leading-relaxed mb-3">{par}</p>
          ))}
        </div>
        <div className="bg-[#E6F1FB] rounded-xl p-3 mb-4 text-center">
          <p className="text-xs text-[#0C447C]">
            🎲 {questions.length} {isLikert ? "afirmaciones" : "preguntas"} · cada intento muestra {Math.min(questionsPerAttempt, questions.length)} distintas
          </p>
        </div>
        <button onClick={startQuestions} className="w-full bg-[#0C447C] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#185FA5] transition-colors">
          {isLikert ? "Empezar autoevaluación →" : "Empezar preguntas →"}
        </button>
      </div>
    );
  }

  // ─── RESULTADO ───
  if (step === totalSteps) {
    const score  = isLikert
      ? Math.round((points / (4 * active.length)) * 100)
      : Math.round((correct / active.length) * 100);
    const passed = score >= 70;
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-3">{isLikert ? "🧭" : passed ? "🎉" : "📚"}</div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {isLikert ? `Alineación: ${score}%` : `${correct}/${active.length} correctas (${score}%)`}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {isLikert
            ? (passed
                ? "Tu perfil refleja una fuerte alineación con las competencias del servidor público. +120 XP"
                : "Reflexiona sobre las afirmaciones donde elegiste menor acuerdo: ahí están las conductas a fortalecer.")
            : (passed
                ? "¡Lección completada! Ganaste +120 XP."
                : "Necesitas 70% para avanzar. ¡Inténtalo de nuevo con preguntas nuevas!")}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={retry} className="px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50">
            Intentar de nuevo
          </button>
          <button onClick={() => { router.refresh(); router.push("/modulos"); }} className="px-4 py-2 bg-[#0C447C] text-white rounded-xl text-sm font-medium hover:bg-[#185FA5]">
            Volver a la ruta →
          </button>
        </div>
      </div>
    );
  }

  // ─── PREGUNTA / AFIRMACIÓN ───
  const q        = active[step - 1];
  const answered = !!answers[q.id];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full flex-1 ${i < step ? "bg-[#0C447C]" : "bg-gray-200"}`} />
        ))}
      </div>
      <p className="text-xs text-gray-500 mb-2">
        {isLikert ? "Afirmación" : "Pregunta"} {step} de {active.length}
      </p>
      <h2 className="text-base font-medium text-gray-900 mb-4 leading-snug">{q.text}</h2>

      <div className="space-y-2">
        {q.options.map((opt, idx) => {
          const isSelected = answers[q.id] === opt.id;
          let style = "border-gray-200 hover:bg-gray-50";
          if (answered) {
            if (isLikert) {
              style = isSelected ? "border-[#0C447C] bg-[#E6F1FB] text-[#0C447C] font-medium" : "border-gray-200 opacity-50";
            } else {
              if (opt.isCorrect) style = "border-green-400 bg-green-50 text-green-800";
              else if (isSelected) style = "border-red-400 bg-red-50 text-red-800";
            }
          }
          return (
            <button
              key={opt.id}
              onClick={() => selectOption(q.id, opt)}
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
        <div className={`mt-4 p-3 rounded-xl text-sm leading-relaxed ${isLikert ? "bg-[#E6F1FB] text-[#0C447C]" : "bg-green-50 text-green-800"}`}>
          {q.explanation}
        </div>
      )}

      {answered && (
        <button
          onClick={() => (step < active.length ? setStep(step + 1) : finish())}
          disabled={saving}
          className="w-full mt-4 bg-[#0C447C] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#185FA5] transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : step < active.length ? "Siguiente →" : "Ver resultados →"}
        </button>
      )}
    </div>
  );
}