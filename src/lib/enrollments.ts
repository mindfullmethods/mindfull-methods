import { createHmac, timingSafeEqual } from "crypto";

import { getCourseBySlug } from "@/lib/courses";
import { isSupabaseSchemaError } from "@/lib/enrollments-schema";
import { createAdminClient } from "@/lib/supabase/admin";

export type EnrollmentRecord = {
  id: string;
  user_id: string | null;
  course_slug: string;
  course_title: string;
  amount_paise: number;
  currency: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  email: string | null;
  status: string;
  created_at: string;
};

export function verifyRazorpayPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
) {
  const payload = `${orderId}|${paymentId}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");

  return (
    expected.length === signature.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  );
}

export function verifyRazorpayWebhookSignature(body: string, signature: string, secret: string) {
  const expected = createHmac("sha256", secret).update(body).digest("hex");

  return (
    expected.length === signature.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  );
}

export async function recordEnrollment(params: {
  courseSlug: string;
  courseTitle: string;
  amountPaise: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  userId?: string | null;
  email?: string | null;
  status?: string;
}): Promise<{ enrollment: EnrollmentRecord; isNew: boolean }> {
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("enrollments")
    .select("id")
    .eq("razorpay_order_id", params.razorpayOrderId)
    .maybeSingle();

  const isNew = !existing;

  const { data, error } = await supabase
    .from("enrollments")
    .upsert(
      {
        course_slug: params.courseSlug,
        course_title: params.courseTitle,
        amount_paise: params.amountPaise,
        currency: "INR",
        razorpay_order_id: params.razorpayOrderId,
        razorpay_payment_id: params.razorpayPaymentId,
        user_id: params.userId ?? null,
        email: params.email ?? null,
        status: params.status ?? "paid",
      },
      { onConflict: "razorpay_order_id" }
    )
    .select("*")
    .single();

  if (error) {
    if (!isSupabaseSchemaError(error.message)) {
      console.error("[recordEnrollment]", error.message, error.code);
    }
    throw new Error(
      isSupabaseSchemaError(error.message)
        ? "Enrollments table is missing. Run supabase/enrollments-schema.sql in Supabase SQL Editor."
        : error.message
    );
  }

  return { enrollment: data as EnrollmentRecord, isNew };
}

export async function linkEnrollmentToUser(orderId: string, userId: string, email?: string | null) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("enrollments")
    .update({
      user_id: userId,
      ...(email ? { email } : {}),
    })
    .eq("razorpay_order_id", orderId)
    .is("user_id", null)
    .select("*")
    .maybeSingle();

  if (error) {
    if (!isSupabaseSchemaError(error.message)) {
      console.error("[linkEnrollmentToUser]", error.message);
    }
    return null;
  }

  return data as EnrollmentRecord | null;
}

export async function linkOrphanEnrollmentsByEmail(userId: string, email: string) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("enrollments")
    .update({ user_id: userId })
    .eq("email", email)
    .is("user_id", null);

  if (error && !isSupabaseSchemaError(error.message)) {
    console.error("[linkOrphanEnrollmentsByEmail]", error.message);
  }
}

export function getEnrollmentCourseMeta(courseSlug: string) {
  const course = getCourseBySlug(courseSlug);
  if (!course) return null;

  return {
    slug: course.slug,
    title: course.title,
    amountPaise: course.priceInPaise,
  };
}
