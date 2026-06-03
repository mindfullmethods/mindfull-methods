"use server";

import { revalidatePath } from "next/cache";

import { adminActorEmail, recordAdminAudit } from "@/lib/audit-log";
import { requireAdmin } from "@/lib/auth";
import { notifyApplicationStatusChange } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_STATUSES = ["Pending", "Approved", "Rejected", "Submitted"] as const;

export type ApplicationStatus = (typeof ALLOWED_STATUSES)[number];

export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
  const admin = await requireAdmin();

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

  const { data: existing, error: fetchError } = await supabase
    .from("applications")
    .select("id, status, email, student_name, internship_id")
    .eq("id", applicationId)
    .maybeSingle();

  if (fetchError) {
    console.error("[updateApplicationStatus] fetch", fetchError);
    return { ok: false as const, error: fetchError.message ?? "Could not load application." };
  }

  if (!existing) {
    return { ok: false as const, error: "Application not found." };
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

  void recordAdminAudit({
    actorEmail: adminActorEmail(admin),
    action: `application.status.${status.toLowerCase()}`,
    entityType: "application",
    entityId: applicationId,
    detail: { previousStatus: existing.status },
  });

  const shouldNotify =
    (status === "Approved" || status === "Rejected") &&
    status !== existing.status &&
    existing.email?.includes("@");

  if (shouldNotify) {
    let internshipTitle = "Internship";
    let company: string | null = null;

    if (existing.internship_id) {
      const { data: internship } = await supabase
        .from("internships")
        .select("title, company")
        .eq("id", existing.internship_id)
        .maybeSingle();

      if (internship) {
        internshipTitle = internship.title;
        company = internship.company;
      }
    }

    try {
      await notifyApplicationStatusChange({
        studentName: existing.student_name ?? "Student",
        studentEmail: existing.email!,
        internshipTitle,
        company,
        status,
      });
    } catch (err) {
      console.error("[updateApplicationStatus] email", err);
    }
  }

  return { ok: true as const, status };
}
