import { getCurrentUser } from "@/lib/auth-helpers";
import { hasActiveAccess, isPremiumUser } from "@/lib/access";
import DashboardShell from "@/components/DashboardShell";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Si el acceso por fecha expiró (trial o premium vencido), a la pantalla de pago
  if (!hasActiveAccess(user)) {
    redirect("/suscripcion");
  }

  const now = new Date();
  const accessUntil = user.accessUntil ? new Date(user.accessUntil) : null;

  // Días restantes (redondeado hacia arriba) para mostrar el aviso
  const daysLeft = accessUntil
    ? Math.ceil((accessUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <DashboardShell
      userName={user.name}
      userLevel={user.stats?.level ?? 1}
      daysLeft={daysLeft}
      isPremium={isPremiumUser(user)}
    >
      {children}
    </DashboardShell>
  );
}
