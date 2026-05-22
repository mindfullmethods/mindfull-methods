"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import Sidebar from "@/components/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      }
    }

    checkUser();
  }, [router]);

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}