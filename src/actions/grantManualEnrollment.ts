"use server";

import { revalidatePath } from "next/cache";

import { adminActorEmail, recordAdminAudit } from "@/lib/audit-log";
import { requireAdmin } from "@/lib/auth";
import { getCourseBySlug } from "@/lib/courses";
import { notifyEnrollmentCompleted } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";

export async function grantManualEnrollment(formData: FormData) {
  const adminUser = await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const courseSlug = String(formData.get("courseSlug") ?? formData.get("course_slug") ?? "").trim();

  if (!email || !courseSlug) {
    return { ok: false as const, error: "Email and course are required." };
  }

  const course = getCourseBySlug(courseSlug);
  if (!course) {
    return { ok: false as const, error: "Course not found." };
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Admin client not configured.";
    return { ok: false as const, error: message };
  }

  const { data: profile } = await supabase.from("profiles").select("id, full_name").eq("email", email).maybeSingle();

  let userId = profile?.id as string | undefined;
  if (!userId) {
    const { data: usersData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const match = usersData.users.find((u) => u.email?.toLowerCase() === email);
    userId = match?.id;
  }

  const { data: existing } = await supabase
    .from("enrollments")
    .select("id")
    .eq("course_slug", courseSlug)
    .or(userId ? `user_id.eq.${userId},email.eq.${email}` : `email.eq.${email}`)
    .eq("status", "paid")
    .limit(1);

  if (existing?.length) {
    return { ok: false as const, error: "Student is already enrolled in this course." };
  }

  const orderId = `manual_${crypto.randomUUID()}`;

  const { error } = await supabase.from("enrollments").insert({
    user_id: userId ?? null,
    course_slug: courseSlug,
    course_title: course.title,
    amount_paise: 0,
    currency: "INR",
    razorpay_order_id: orderId,
    email,
    status: "paid",
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  void notifyEnrollmentCompleted({
    studentName: (profile?.full_name as string | undefined) ?? email.split("@")[0] ?? "Student",
    studentEmail: email,
    courseTitle: course.title,
    courseSlug,
    amountLabel: "Complimentary access",
    razorpayOrderId: orderId,
  }).catch((err) => console.error("[grantManualEnrollment] email", err));

  void recordAdminAudit({
    actorEmail: adminActorEmail(adminUser),
    action: "enrollment.grant_manual",
    entityType: "enrollment",
    entityId: orderId,
    detail: { email, courseSlug },
  });

  revalidatePath("/dashboard/enrollments");
  revalidatePath("/dashboard/my-courses");
  revalidatePath("/dashboard/admin-home");
  if (userId) revalidatePath(`/dashboard/users/${userId}`);

  return { ok: true as const };
}
