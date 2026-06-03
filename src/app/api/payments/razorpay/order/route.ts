import { NextResponse } from "next/server";

import { getResolvedCourseBySlug } from "@/lib/platform-content";
import { buildRazorpayReceipt, formatRazorpayOrderError, getRazorpayClient, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    if (!isRazorpayConfigured()) {
      return NextResponse.json({ ok: false, error: "Payments are not configured yet." }, { status: 503 });
    }

    const body = (await req.json()) as {
      courseSlug?: string;
      customerEmail?: string;
      promoCode?: string;
      referralCode?: string;
    };
    const course = body.courseSlug ? await getResolvedCourseBySlug(body.courseSlug) : null;

    if (!course) {
      return NextResponse.json({ ok: false, error: "Course not found." }, { status: 404 });
    }

    const referralInput = body.referralCode?.trim();
    const promoInput = body.promoCode?.trim();

    let finalAmount = course.priceInPaise;
    let discountLabel: string | null = null;
    let appliedPromoCode: string | undefined;
    let appliedReferralCode: string | undefined;

    if (referralInput) {
      const { applyReferralCode } = await import("@/lib/referral-codes");
      const referral = await applyReferralCode(referralInput, course.priceInPaise);
      if ("error" in referral && referral.error) {
        return NextResponse.json({ ok: false, error: referral.error }, { status: 400 });
      }
      finalAmount = referral.finalAmount;
      discountLabel = referral.label;
      appliedReferralCode = referral.code;
    } else if (promoInput) {
      const { applyPromoCode } = await import("@/lib/promo-codes");
      const promo = await applyPromoCode(promoInput, course.priceInPaise);
      if ("error" in promo && promo.error) {
        return NextResponse.json({ ok: false, error: promo.error }, { status: 400 });
      }
      finalAmount = promo.finalAmount;
      discountLabel = promo.label;
      appliedPromoCode = promo.code;
    }

    const notes: Record<string, string> = {
      course_slug: course.slug,
      course_title: course.title,
    };

    if (body.customerEmail?.trim()) {
      notes.customer_email = body.customerEmail.trim();
    }

    if (appliedPromoCode) notes.promo_code = appliedPromoCode;
    if (appliedReferralCode) notes.referral_code = appliedReferralCode;

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: finalAmount,
      currency: "INR",
      receipt: buildRazorpayReceipt("mm"),
      notes,
    });

    const { recordCheckoutIntent } = await import("@/lib/checkout-intents");
    void recordCheckoutIntent({
      razorpayOrderId: order.id,
      courseSlug: course.slug,
      courseTitle: course.title,
      email: body.customerEmail?.trim(),
      amountPaise: finalAmount,
      promoCode: appliedPromoCode,
      referralCode: appliedReferralCode,
    });

    if (appliedReferralCode) {
      const { recordReferralEvent } = await import("@/lib/referral-events");
      void recordReferralEvent({
        referralCode: appliedReferralCode,
        courseSlug: course.slug,
        email: body.customerEmail?.trim(),
        razorpayOrderId: order.id,
      });
    }

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
      courseSlug: course.slug,
      courseTitle: course.title,
      discountLabel,
      originalAmount: course.priceInPaise,
    });
  } catch (error) {
    console.error("[razorpay/order]", error);
    return NextResponse.json({ ok: false, error: formatRazorpayOrderError(error) }, { status: 500 });
  }
}
