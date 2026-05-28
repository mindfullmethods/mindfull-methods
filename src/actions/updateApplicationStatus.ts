"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_STATUSES = ["Pending", "Approved", "Rejected", "Submitted"] as const;

export type ApplicationStatus = (typeof ALLOWED_STATUSES)[number];

export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
  await requireAdmin();

  if (!ALLOWED_STATUSES.includes(status)) {
    return { ok: false as const, error: "Invalid status." };
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Admin database client is not configured.";
    return { ok: false as const, error: message };
  }

  const { error } = await supabase.from("applications").update({ status }).eq("id", applicationId);

  if (error) {
    console.error("[updateApplicationStatus]", error);
    const message = error.message ?? "Update failed.";

    if (message.includes("status") && message.includes("schema cache")) {
      return {
        ok: false as const,
        error:
          "The status column is missing in Supabase. Run supabase/applications-schema.sql in the SQL Editor, then refresh this page.",
      };
    }

    return { ok: false as const, error: message };
  }

  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard/my-applications");
  revalidatePath("/dashboard");

  return { ok: true as const, status };
}
