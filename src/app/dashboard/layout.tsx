"use client";

import Sidebar from "@/components/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f8f5] text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <Sidebar />
      <main className="min-h-screen lg:pl-80">{children}</main>
    </div>
  );
}
