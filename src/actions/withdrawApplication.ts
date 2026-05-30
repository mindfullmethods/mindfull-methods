"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function withdrawApplicationAction(applicationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, error: "Please sign in." };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { ok: false as const, error: "Server configuration error." };
  }

  const { data: application } = await admin
    .from("applications")
    .select("id, user_id, status")
    .eq("id", applicationId)
    .maybeSingle();

  if (!application || application.user_id !== user.id) {
    return { ok: false as const, error: "Application not found." };
  }

  if (application.status?.toLowerCase() === "withdrawn") {
    return { ok: false as const, error: "This application was already withdrawn." };
  }

  const { error } = await admin
    .from("applications")
    .update({ status: "Withdrawn" })
    .eq("id", applicationId);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidatePath("/dashboard/my-applications");
  revalidatePath("/dashboard/applications");

  return { ok: true as const };
}
