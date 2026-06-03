"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form   = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email:    form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Email o contraseña incorrectos");
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-gray-100">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-[#0C447C] rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">D</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">DIAN Academy</h1>
        <p className="text-gray-500 text-sm mt-1">Inicia sesión para continuar</p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="tu@email.com"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0C447C] focus:border-transparent"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Contraseña
          </label>
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0C447C] focus:border-transparent"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0C447C] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#185FA5] transition-colors disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-[#0C447C] font-medium hover:underline">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}