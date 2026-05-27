import { getSessionUser, isAdminUser, requireUser } from "@/lib/auth";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const isAdmin = isAdminUser(user);

  return <DashboardShell isAdmin={isAdmin}>{children}</DashboardShell>;
}
