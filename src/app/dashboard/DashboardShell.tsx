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
      <main className="relative min-h-screen pt-[4.25rem] lg:pl-80 lg:pt-0">{children}</main>
    </div>
  );
}
