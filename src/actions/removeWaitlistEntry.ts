"use server";

import { revalidatePath } from "next/cache";

import { adminActorEmail, recordAdminAudit } from "@/lib/audit-log";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function removeWaitlistEntryAction(id: string) {
  const adminUser = await requireAdmin();

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Admin client not configured.";
    return { ok: false as const, error: message };
  }

  const { error } = await supabase.from("course_waitlist").delete().eq("id", id);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  void recordAdminAudit({
    actorEmail: adminActorEmail(adminUser),
    action: "waitlist.removed",
    entityType: "course_waitlist",
    entityId: id,
  });

  revalidatePath("/dashboard/growth");
  return { ok: true as const };
}
