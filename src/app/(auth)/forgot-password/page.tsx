"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-gray-100">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-[#0C447C] rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">D</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Recuperar contrasena</h1>
      </div>

      {sent ? (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Si el email existe, recibiras un enlace para restablecer tu contrasena. Revisa tu bandeja de entrada y spam.
          </p>
          <Link href="/login" className="text-sm text-[#0C447C] font-medium hover:underline">
            Volver al login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0C447C]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0C447C] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#185FA5] disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar enlace de recuperacion"}
          </button>
          <p className="text-center text-sm text-gray-500">
            <Link href="/login" className="text-[#0C447C] font-medium hover:underline">
              Volver al login
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}