import { NextResponse } from "next/server";

import { finalizePaidEnrollment, resolveEnrollmentCourseMeta } from "@/lib/post-enrollment";
import { verifyRazorpayPaymentSignature } from "@/lib/enrollments";
import { createClient } from "@/lib/supabase/server";
import { signupUrl } from "@/lib/site";

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

    const courseMeta = courseSlug ? await resolveEnrollmentCourseMeta(courseSlug) : null;

    if (!courseMeta) {
      return NextResponse.json({ ok: false, error: "Course not found." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payerEmail = user?.email ?? customerEmail?.trim() ?? null;

    try {
      await finalizePaidEnrollment({
        courseSlug: courseMeta.slug,
        courseTitle: courseMeta.title,
        amountPaise: courseMeta.amountPaise,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        userId: user?.id ?? null,
        email: payerEmail,
        name:
          (user?.user_metadata?.full_name as string | undefined) ??
          (user?.user_metadata?.name as string | undefined),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save enrollment.";
      return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }

    if (user) {
      return NextResponse.json({
        ok: true,
        redirectUrl: `/dashboard/my-courses/welcome?course=${encodeURIComponent(courseMeta.slug)}`,
      });
    }

    const redirectUrl = `${signupUrl(courseMeta.slug)}&paid=1&order=${encodeURIComponent(razorpay_order_id)}`;

    return NextResponse.json({ ok: true, redirectUrl });
  } catch (error) {
    console.error("[razorpay/verify]", error);
    return NextResponse.json({ ok: false, error: "Verification error." }, { status: 500 });
  }
}
