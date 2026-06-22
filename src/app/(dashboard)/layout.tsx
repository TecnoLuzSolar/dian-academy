import { getCurrentUser } from "@/lib/auth-helpers";
import DashboardShell from "@/components/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <DashboardShell
      userName={user.name}
      userLevel={user.stats?.level ?? 1}
    >
      {children}
    </DashboardShell>
  );
}
