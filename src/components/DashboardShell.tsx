"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavItem = { href: string; label: string; icon: string };

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Inicio",    icon: "🏠" },
  { href: "/modulos",   label: "Ruta",      icon: "🗺️" },
  { href: "/simulacro", label: "Simulacro", icon: "📝" },
  { href: "/logros",    label: "Logros",    icon: "🏅" },
];

export default function DashboardShell({
  userName,
  userLevel,
  children,
}: {
  userName: string;
  userLevel: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setOpen(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Topbar móvil: solo visible en pantallas pequeñas */}
      <header className="md:hidden fixed top-0 inset-x-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0C447C] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="font-semibold text-gray-900 text-sm">DIAN Academy</span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          {open ? (
            // Ícono X
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            // Ícono hamburguesa
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </header>

      {/* Overlay oscuro detrás del drawer en móvil */}
      {open && (
        <div
          onClick={closeMenu}
          className="md:hidden fixed inset-0 z-30 bg-black/40"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-60 bg-white border-r border-gray-200 flex flex-col shrink-0
          transform transition-transform duration-200 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
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
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-500">Nivel {userLevel}</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-2">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-[#E6F1FB] text-[#0C447C] font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-gray-100">
          <Link
            href="/api/auth/signout"
            onClick={closeMenu}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <span>🚪</span>
            Cerrar sesión
          </Link>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">{children}</main>
    </div>
  );
}
