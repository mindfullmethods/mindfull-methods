"use client";

import Sidebar from "@/components/components/dashboard/Sidebar";

export default function DashboardShell({
  children,
  isAdmin,
}: {
  children: React.ReactNode;
  isAdmin: boolean;
}) {
  return (
    <div className="mm-dashboard-shell">
      <Sidebar isAdmin={isAdmin} />
      <main className="relative min-h-screen lg:pl-80">{children}</main>
    </div>
  );
}
