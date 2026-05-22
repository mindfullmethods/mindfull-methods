"use client";

import { useEffect } from "react";
 import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

  return <>{children}</>;
}