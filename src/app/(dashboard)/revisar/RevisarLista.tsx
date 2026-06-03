"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Q {
  id: string;
  text: string;
  explanation: string;
  moduleTitle: string;
  options: { text: string; isCorrect: boolean }[];
}

export default function RevisarLista({ questions }: { questions: Q[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);

  async function review(id: string, action: "approve" | "reject") {
    setBusy(id);
    await fetch("/api/questions/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: id, action }),
    });
    setHidden((h) => [...h, id]);
    setBusy(null);
    router.refresh();
  }

  const visible = questions.filter((q) => !hidden.includes(q.id));

  if (visible.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center">
        <p className="text-sm text-gray-500">No hay borradores pendientes. ¡Todo revisado! ✅</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {visible.map((q) => (
        <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">{q.moduleTitle}</p>
          <p className="text-sm font-medium text-gray-900 mb-2">{q.text}</p>
          <div className="space-y-1 mb-2">
            {q.options.map((o, j) => (
              <p key={j} className={`text-sm px-3 py-1.5 rounded-lg ${o.isCorrect ? "bg-green-50 text-green-800 font-medium" : "text-gray-600"}`}>
                {String.fromCharCode(65 + j)}. {o.text} {o.isCorrect && "✓"}
              </p>
            ))}
          </div>
          <p className="text-xs text-gray-500 italic mb-3">{q.explanation}</p>
          <div className="flex gap-2">
            <button
              onClick={() => review(q.id, "approve")}
              disabled={busy === q.id}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {busy === q.id ? "..." : "✓ Aprobar"}
            </button>
            <button
              onClick={() => review(q.id, "reject")}
              disabled={busy === q.id}
              className="flex-1 border border-red-300 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50"
            >
              ✕ Rechazar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}