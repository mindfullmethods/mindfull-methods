import { NextResponse } from "next/server";

import { getResolvedCourseBySlug } from "@/lib/platform-content";
import { buildRazorpayReceipt, formatRazorpayOrderError, getRazorpayClient, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    if (!isRazorpayConfigured()) {
      return NextResponse.json({ ok: false, error: "Payments are not configured yet." }, { status: 503 });
    }

    const body = (await req.json()) as { courseSlug?: string; customerEmail?: string; promoCode?: string };
    const course = body.courseSlug ? await getResolvedCourseBySlug(body.courseSlug) : null;

    if (!course) {
      return NextResponse.json({ ok: false, error: "Course not found." }, { status: 404 });
    }

    const { applyPromoCode } = await import("@/lib/promo-codes");
    const promo = applyPromoCode(body.promoCode, course.priceInPaise);

    if ("error" in promo && promo.error) {
      return NextResponse.json({ ok: false, error: promo.error }, { status: 400 });
    }

    const notes: Record<string, string> = {
      course_slug: course.slug,
      course_title: course.title,
    };

    if (body.customerEmail?.trim()) {
      notes.customer_email = body.customerEmail.trim();
    }

    if (promo.code) {
      notes.promo_code = promo.code;
    }

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: promo.finalAmount,
      currency: "INR",
      receipt: buildRazorpayReceipt("mm"),
      notes,
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
      courseSlug: course.slug,
      courseTitle: course.title,
      discountLabel: promo.label,
      originalAmount: course.priceInPaise,
    });
  } catch (error) {
    console.error("[razorpay/order]", error);
    return NextResponse.json({ ok: false, error: formatRazorpayOrderError(error) }, { status: 500 });
  }
}
