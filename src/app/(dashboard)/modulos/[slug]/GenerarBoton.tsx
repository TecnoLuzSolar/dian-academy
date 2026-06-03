"use client";
import { useState } from "react";
import Link from "next/link";

export default function GenerarBoton({ moduleSlug }: { moduleSlug: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState("");
  const [error, setError]     = useState("");

  async function generate() {
    setLoading(true); setMsg(""); setError("");
    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug, count: 5 }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Error al generar");
      else setMsg(`✅ ${data.created} preguntas generadas como borrador.`);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  return (
    <div className="mb-5 bg-[#F4F7FB] border border-[#D5E3F2] rounded-xl p-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs text-gray-600 flex items-center gap-1.5">
          🤖 Modo profesor — amplía el banco con IA
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={generate}
            disabled={loading}
            className="bg-[#0C447C] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#185FA5] transition-colors disabled:opacity-50"
          >
            {loading ? "Generando..." : "Generar 5 preguntas"}
          </button>
          <Link href="/revisar" className="text-xs text-[#0C447C] font-medium hover:underline">
            Revisar →
          </Link>
        </div>
      </div>
      {msg   && <p className="text-xs text-green-700 mt-2">{msg}</p>}
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}