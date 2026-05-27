"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function deleteInternship(id: string) {
  await requireAdmin();

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Admin database client is not configured.";
    redirect(`/dashboard/admin?error=${encodeURIComponent(message)}`);
  }

  const { error } = await supabase.from("internships").delete().eq("id", id);

  if (error) {
    console.error("[deleteInternship]", error);
    redirect(`/dashboard/admin?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/internships");
  revalidatePath("/dashboard");
  redirect("/dashboard/admin?deleted=1");
}
