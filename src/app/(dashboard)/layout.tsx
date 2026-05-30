import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  const navItems = [
    { href: "/dashboard", label: "Inicio",        icon: "🏠" },
    { href: "/modulos",   label: "Ruta",          icon: "🗺️" },
    { href: "/simulacro", label: "Simulacro",     icon: "📝" },
    { href: "/logros",    label: "Logros",        icon: "🏅" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* Logo + usuario */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#0C447C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm">DIAN Academy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#E6F1FB] rounded-full flex items-center justify-center text-[#0C447C] font-medium text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500">Nivel {user.stats?.level ?? 1}</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-gray-100">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <span>🚪</span>
            Cerrar sesión
          </Link>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}