"use client";
import { useState } from "react";
import Link from "next/link";

interface Props {
  moduleSlug: string;
  questionType?: string;
}

export default function GenerarBoton({ moduleSlug, questionType = "SITUATIONAL" }: Props) {
  const [loading, setLoading]       = useState(false);
  const [msg, setMsg]               = useState("");
  const [error, setError]           = useState("");
  const [showText, setShowText]     = useState(false);
  const [sourceText, setSourceText] = useState("");
  const isLikert = questionType === "LIKERT";

  async function generate() {
    setLoading(true); setMsg(""); setError("");
    try {
      const body: any = { moduleSlug, count: 5, questionType };
      if (sourceText.trim().length > 50) body.sourceText = sourceText;

      const res  = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) setError(data.error || "Error al generar");
      else {
        const label = isLikert ? "afirmaciones" : "preguntas";
        setMsg(`✅ ${data.created} ${label} generadas como borrador.${sourceText ? " Texto guardado como referencia." : ""}`);
        setSourceText("");
        setShowText(false);
      }
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  }

  return (
    <div className="mb-5 bg-[#F4F7FB] border border-[#D5E3F2] rounded-xl p-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs text-gray-600 flex items-center gap-1.5">
          🤖 Modo profesor — {isLikert ? "generar afirmaciones Likert" : "ampliar banco con IA"}
        </span>
        <div className="flex items-center gap-3">
          {!isLikert && (
            <button
              onClick={() => setShowText(!showText)}
              className="text-xs text-[#0C447C] font-medium hover:underline"
            >
              📄 {showText ? "Cerrar" : "Pegar texto de ley"}
            </button>
          )}
          <button
            onClick={generate}
            disabled={loading}
            className="bg-[#0C447C] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#185FA5] transition-colors disabled:opacity-50"
          >
            {loading ? "Generando..." : isLikert ? "Generar 5 afirmaciones" : "Generar 5 preguntas"}
          </button>
          <Link href="/revisar" className="text-xs text-[#0C447C] font-medium hover:underline">
            Revisar →
          </Link>
        </div>
      </div>

      {showText && (
        <div className="mt-3">
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Abre el PDF de la ley en tu navegador → Ctrl+A → Ctrl+C → pega aquí (Ctrl+V). El texto queda guardado como referencia permanente del módulo."
            rows={6}
            className="w-full text-xs border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0C447C] resize-y"
          />
          <p className="text-xs text-gray-400 mt-1">
            {sourceText.length > 0 ? `${sourceText.length.toLocaleString()} caracteres pegados` : "Sin texto aún"}
          </p>
        </div>
      )}

      {msg   && <p className="text-xs text-green-700 mt-2">{msg}</p>}
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}