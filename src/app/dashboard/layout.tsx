"use client";

import Sidebar from "@/components/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}