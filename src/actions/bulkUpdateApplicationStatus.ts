"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateApplicationStatus, type ApplicationStatus } from "@/actions/updateApplicationStatus";

export async function bulkUpdateApplicationStatus(applicationIds: string[], status: ApplicationStatus) {
  await requireAdmin();

  if (!applicationIds.length) {
    return { ok: false as const, error: "Select at least one application." };
  }

  const results = await Promise.all(
    applicationIds.map((id) => updateApplicationStatus(id, status))
  );

  const failed = results.filter((r) => !r.ok);
  if (failed.length) {
    return {
      ok: false as const,
      error: `Updated ${results.length - failed.length} of ${results.length}. ${failed[0]?.error ?? ""}`,
    };
  }

  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard/admin-home");

  return { ok: true as const, count: results.length };
}
