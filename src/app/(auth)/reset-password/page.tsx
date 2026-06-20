"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Error al cambiar la contrasena");
    } else {
      setDone(true);
    }
    setLoading(false);
  }

  if (!token) {
    return (
      <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-gray-100 text-center">
        <p className="text-sm text-red-600 mb-4">Enlace invalido. Solicita uno nuevo.</p>
        <Link href="/forgot-password" className="text-sm text-[#0C447C] font-medium hover:underline">
          Solicitar nuevo enlace
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-gray-100">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-[#0C447C] rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">D</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Nueva contrasena</h1>
      </div>

      {done ? (
        <div className="text-center">
          <p className="text-sm text-green-600 mb-4">Contrasena actualizada correctamente.</p>
          <Link href="/login" className="text-sm bg-[#0C447C] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#185FA5]">
            Iniciar sesion
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Nueva contrasena</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimo 6 caracteres"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0C447C]"
            />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0C447C] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#185FA5] disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Cambiar contrasena"}
          </button>
        </form>
      )}
    </div>
  );
}