import { getCurrentUser } from "@/lib/auth-helpers";
import Link from "next/link";

export default async function SuscripcionPage() {
  const user = await getCurrentUser();

  const now = new Date();
  const accessUntil = user.accessUntil ? new Date(user.accessUntil) : null;
  const stillActive = accessUntil ? now < accessUntil : false;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <img src="/icon-192.png" alt="DIGNUS" className="w-16 h-16 mx-auto mb-3" />
          <h1 className="text-2xl font-semibold text-gray-900">
            {stillActive ? "Activa tu acceso completo" : "Tu prueba gratis terminó"}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {stillActive
              ? "Asegura tu preparación hasta el día del concurso."
              : "Sigue preparándote para el concurso con acceso completo."}
          </p>
        </div>

        {/* Precio */}
        <div className="bg-[#E6F1FB] rounded-xl p-5 text-center mb-6">
          <p className="text-sm text-[#0C447C] font-medium">Acceso completo</p>
          <p className="text-3xl font-bold text-[#0C447C] mt-1">$ 39.000</p>
          <p className="text-xs text-gray-500 mt-1">Acceso hasta el día del concurso</p>
        </div>

        {/* Instrucciones de pago */}
        <div className="space-y-4 mb-6">
          <p className="text-sm font-medium text-gray-900">¿Cómo activar tu acceso?</p>

          <ol className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#0C447C] text-white text-xs flex items-center justify-center font-medium">1</span>
              <span>
                Envía el pago por <strong>Nequi</strong> o <strong>Daviplata</strong> al número{" "}
                <strong className="text-gray-900">315 290 4173</strong> a nombre de{" "}
                <strong className="text-gray-900">Marcela Vallejos</strong>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#0C447C] text-white text-xs flex items-center justify-center font-medium">2</span>
              <span>
                Envía el comprobante por WhatsApp al{" "}
                <strong className="text-gray-900">315 686 4733</strong> indicando tu correo:{" "}
                <strong className="text-gray-900 break-all">{user.email}</strong>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#0C447C] text-white text-xs flex items-center justify-center font-medium">3</span>
              <span>Activamos tu acceso completo en menos de 24 horas. 🎉</span>
            </li>
          </ol>
        </div>

        {/* Botón WhatsApp */}
        <a
          href="https://wa.me/573156864733?text=Hola,%20quiero%20activar%20mi%20acceso%20a%20DIGNUS"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-[#0C447C] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#185FA5] transition-colors mb-3"
        >
          Enviar comprobante por WhatsApp
        </a>

        {/* Volver / salir */}
        {stillActive ? (
          <Link
            href="/dashboard"
            className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2"
          >
            Volver al inicio
          </Link>
        ) : (
          <Link
            href="/api/auth/signout"
            className="block w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2"
          >
            Cerrar sesión
          </Link>
        )}
      </div>
    </div>
  );
}
