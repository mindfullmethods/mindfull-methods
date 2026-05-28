import { NextResponse } from "next/server";

import {
  getEnrollmentCourseMeta,
  recordEnrollment,
  verifyRazorpayWebhookSignature,
} from "@/lib/enrollments";

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ ok: false, error: "Webhook secret not configured." }, { status: 503 });
    }

    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json({ ok: false, error: "Missing signature." }, { status: 400 });
    }

    const body = await req.text();

    if (!verifyRazorpayWebhookSignature(body, signature, webhookSecret)) {
      return NextResponse.json({ ok: false, error: "Invalid webhook signature." }, { status: 400 });
    }

    const payload = JSON.parse(body) as {
      event?: string;
      payload?: {
        payment?: {
          entity?: {
            id?: string;
            order_id?: string;
            amount?: number;
            status?: string;
            notes?: Record<string, string>;
          };
        };
      };
    };

    if (payload.event !== "payment.captured") {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const payment = payload.payload?.payment?.entity;
    const orderId = payment?.order_id;
    const paymentId = payment?.id;
    const courseSlug = payment?.notes?.course_slug;

    if (!orderId || !paymentId || !courseSlug) {
      return NextResponse.json({ ok: false, error: "Missing payment metadata." }, { status: 400 });
    }

    const courseMeta = getEnrollmentCourseMeta(courseSlug);
    if (!courseMeta) {
      return NextResponse.json({ ok: false, error: "Unknown course." }, { status: 400 });
    }

    await recordEnrollment({
      courseSlug: courseMeta.slug,
      courseTitle: courseMeta.title,
      amountPaise: payment.amount ?? courseMeta.amountPaise,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      status: payment.status === "captured" ? "paid" : "pending",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[razorpay/webhook]", error);
    return NextResponse.json({ ok: false, error: "Webhook error." }, { status: 500 });
  }
}
