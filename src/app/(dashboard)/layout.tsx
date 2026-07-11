import { getCurrentUser } from "@/lib/auth-helpers";
import DashboardShell from "@/components/DashboardShell";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Control de acceso: trial de 7 días / suscripción
  const now = new Date();
  const accessUntil = user.accessUntil ? new Date(user.accessUntil) : null;
  const hasAccess = accessUntil ? now < accessUntil : false;

  // Si el acceso expiró, lo mandamos a la pantalla de suscripción
  if (!hasAccess) {
    redirect("/suscripcion");
  }

  // Días restantes (redondeado hacia arriba) para mostrar el aviso
  const daysLeft = accessUntil
    ? Math.ceil((accessUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <DashboardShell
      userName={user.name}
      userLevel={user.stats?.level ?? 1}
      daysLeft={daysLeft}
    >
      {children}
    </DashboardShell>
  );
}
