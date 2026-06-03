"use server";

import { revalidatePath } from "next/cache";

import { adminActorEmail, recordAdminAudit } from "@/lib/audit-log";
import { requireAdmin } from "@/lib/auth";
import { getCourseBySlug } from "@/lib/courses";
import { notifyWaitlistSeatsOpen } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";

export async function notifyWaitlistForCourseAction(courseSlug: string) {
  const adminUser = await requireAdmin();
  const slug = courseSlug.trim();
  const course = getCourseBySlug(slug);

  if (!slug || !course) {
    return { ok: false as const, error: "Course not found." };
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Admin client not configured.";
    return { ok: false as const, error: message };
  }

  const { data: rows, error } = await supabase
    .from("course_waitlist")
    .select("email, full_name")
    .eq("course_slug", slug);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  if (!rows?.length) {
    return { ok: false as const, error: "No one on the waitlist for this course." };
  }

  let sent = 0;
  for (const row of rows) {
    if (!row.email?.includes("@")) continue;
    try {
      await notifyWaitlistSeatsOpen({
        email: row.email,
        fullName: row.full_name,
        courseTitle: course.title,
        courseSlug: slug,
      });
      sent += 1;
    } catch (err) {
      console.error("[notifyWaitlist]", row.email, err);
    }
  }

  void recordAdminAudit({
    actorEmail: adminActorEmail(adminUser),
    action: "waitlist.notify_open",
    entityType: "course",
    entityId: slug,
    detail: { sent, total: rows.length },
  });

  revalidatePath("/dashboard/growth");
  revalidatePath("/dashboard/admin-home");

  return { ok: true as const, sent };
}
