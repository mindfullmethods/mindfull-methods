"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { getCourseBySlug } from "@/lib/courses";
import { notifyEnrollmentCompleted } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";

export async function grantManualEnrollment(formData: FormData) {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const courseSlug = String(formData.get("courseSlug") ?? "").trim();

  if (!email || !courseSlug) {
    return { ok: false as const, error: "Email and course are required." };
  }

  const course = getCourseBySlug(courseSlug);
  if (!course) {
    return { ok: false as const, error: "Course not found." };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Admin client not configured.";
    return { ok: false as const, error: message };
  }

  const { data: profile } = await admin.from("profiles").select("id, full_name").eq("email", email).maybeSingle();

  let userId = profile?.id as string | undefined;
  if (!userId) {
    const { data: usersData } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const match = usersData.users.find((u) => u.email?.toLowerCase() === email);
    userId = match?.id;
  }

  const { data: existing } = await admin
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

  const { error } = await admin.from("enrollments").insert({
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
  }).catch((err) => console.error("[grantManualEnrollment] email", err));

  revalidatePath("/dashboard/enrollments");
  revalidatePath("/dashboard/my-courses");
  revalidatePath("/dashboard/admin-home");

  return { ok: true as const };
}
