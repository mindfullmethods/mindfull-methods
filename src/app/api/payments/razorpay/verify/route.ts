import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

import { markInquiryEnrolledForCourse } from "@/lib/contact-inquiry-enrollment";
import {
  getEnrollmentCourseMeta,
  recordEnrollment,
  verifyRazorpayPaymentSignature,
} from "@/lib/enrollments";
import { getCourseBySlug } from "@/lib/courses";
import { notifyEnrollmentCompleted } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";
import { signupUrl } from "@/lib/site";

function enrollmentAmountLabel(courseSlug: string, amountPaise: number) {
  return getCourseBySlug(courseSlug)?.priceLabel ?? `₹${Math.round(amountPaise / 100).toLocaleString("en-IN")}`;
}

function sendEnrollmentEmails(params: {
  courseSlug: string;
  courseTitle: string;
  amountPaise: number;
  email?: string | null;
  name?: string | null;
}) {
  if (!params.email) return;

  void notifyEnrollmentCompleted({
    studentName: params.name ?? params.email.split("@")[0] ?? "Student",
    studentEmail: params.email,
    courseTitle: params.courseTitle,
    courseSlug: params.courseSlug,
    amountLabel: enrollmentAmountLabel(params.courseSlug, params.amountPaise),
  }).catch((err) => console.error("[razorpay/verify] email", err));
}

export async function POST(req: Request) {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ ok: false, error: "Payments are not configured." }, { status: 503 });
    }

    const body = (await req.json()) as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
      courseSlug?: string;
      customerEmail?: string;
    };

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseSlug, customerEmail } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ ok: false, error: "Missing payment details." }, { status: 400 });
    }

    const valid = verifyRazorpayPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      secret
    );

    if (!valid) {
      return NextResponse.json({ ok: false, error: "Payment verification failed." }, { status: 400 });
    }

    const courseMeta = courseSlug ? getEnrollmentCourseMeta(courseSlug) : null;

    if (!courseMeta) {
      return NextResponse.json({ ok: false, error: "Course not found." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payerEmail = user?.email ?? customerEmail?.trim() ?? null;

    try {
      await recordEnrollment({
        courseSlug: courseMeta.slug,
        courseTitle: courseMeta.title,
        amountPaise: courseMeta.amountPaise,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        userId: user?.id ?? null,
        email: payerEmail,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save enrollment.";
      return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }

    sendEnrollmentEmails({
      courseSlug: courseMeta.slug,
      courseTitle: courseMeta.title,
      amountPaise: courseMeta.amountPaise,
      email: payerEmail,
      name:
        (user?.user_metadata?.full_name as string | undefined) ??
        (user?.user_metadata?.name as string | undefined),
    });

    if (payerEmail) {
      void markInquiryEnrolledForCourse(payerEmail, courseMeta.slug);
    }

    if (user) {
      return NextResponse.json({
        ok: true,
        redirectUrl: `/dashboard/my-courses?enrolled=1&course=${encodeURIComponent(courseMeta.slug)}`,
      });
    }

    const redirectUrl = `${signupUrl(courseMeta.slug)}&paid=1&order=${encodeURIComponent(razorpay_order_id)}`;

    return NextResponse.json({ ok: true, redirectUrl });
  } catch (error) {
    console.error("[razorpay/verify]", error);
    return NextResponse.json({ ok: false, error: "Verification error." }, { status: 500 });
  }
}
