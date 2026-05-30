"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { notifyEnrollmentCompleted } from "@/lib/email";
import { getCourseBySlug } from "@/lib/courses";
import { createAdminClient } from "@/lib/supabase/admin";

export async function markEnrollmentRefunded(enrollmentId: string) {
  await requireAdmin();

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Admin database client is not configured.";
    return { ok: false as const, error: message };
  }

  const { error } = await supabase
    .from("enrollments")
    .update({ status: "refunded" })
    .eq("id", enrollmentId);

  if (error) {
    console.error("[markEnrollmentRefunded]", error);
    return { ok: false as const, error: error.message };
  }

  revalidatePath("/dashboard/enrollments");
  revalidatePath("/dashboard/admin-home");

  return { ok: true as const };
}

export async function resendEnrollmentReceipt(enrollmentId: string) {
  await requireAdmin();

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Admin database client is not configured.";
    return { ok: false as const, error: message };
  }

  const { data: enrollment, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("id", enrollmentId)
    .maybeSingle();

  if (error || !enrollment) {
    return { ok: false as const, error: error?.message ?? "Enrollment not found." };
  }

  if (!enrollment.email?.includes("@")) {
    return { ok: false as const, error: "No email on file for this enrollment." };
  }

  const course = getCourseBySlug(enrollment.course_slug);
  const amountLabel =
    course?.priceLabel ??
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: enrollment.currency ?? "INR",
      maximumFractionDigits: 0,
    }).format(enrollment.amount_paise / 100);

  let studentName = "Student";
  if (enrollment.user_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", enrollment.user_id)
      .maybeSingle();
    if (profile?.full_name) studentName = profile.full_name;
  }

  try {
    await notifyEnrollmentCompleted({
      studentName,
      studentEmail: enrollment.email,
      courseTitle: course?.title ?? enrollment.course_title,
      courseSlug: enrollment.course_slug,
      amountLabel,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email.";
    return { ok: false as const, error: message };
  }

  return { ok: true as const };
}
