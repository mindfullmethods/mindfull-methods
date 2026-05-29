import { NextResponse } from "next/server";

import { getCourseBySlug } from "@/lib/courses";
import { getRazorpayClient, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    if (!isRazorpayConfigured()) {
      return NextResponse.json({ ok: false, error: "Payments are not configured yet." }, { status: 503 });
    }

    const body = (await req.json()) as { courseSlug?: string; customerEmail?: string };
    const course = body.courseSlug ? getCourseBySlug(body.courseSlug) : null;

    if (!course) {
      return NextResponse.json({ ok: false, error: "Course not found." }, { status: 404 });
    }

    const notes: Record<string, string> = {
      course_slug: course.slug,
      course_title: course.title,
    };

    if (body.customerEmail?.trim()) {
      notes.customer_email = body.customerEmail.trim();
    }

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: course.priceInPaise,
      currency: "INR",
      receipt: `course_${course.slug}_${Date.now()}`,
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
    });
  } catch (error) {
    console.error("[razorpay/order]", error);
    return NextResponse.json({ ok: false, error: "Could not create payment order." }, { status: 500 });
  }
}
