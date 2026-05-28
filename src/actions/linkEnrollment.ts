"use server";

import { linkEnrollmentToUser } from "@/lib/enrollments";
import { createClient } from "@/lib/supabase/server";

export async function linkEnrollmentAction(orderId: string) {
  if (!orderId) {
    return { ok: false as const, error: "Missing order id." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, error: "Not signed in." };
  }

  const enrollment = await linkEnrollmentToUser(orderId, user.id, user.email);

  if (!enrollment) {
    return { ok: false as const, error: "Enrollment not found or already linked." };
  }

  return { ok: true as const, courseSlug: enrollment.course_slug };
}
