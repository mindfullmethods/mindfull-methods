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
    <div className="min-h-screen bg-[#f7f8f5] text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <Sidebar isAdmin={isAdmin} />
      <main className="min-h-screen lg:pl-80">{children}</main>
    </div>
  );
}
