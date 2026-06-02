import { NextResponse } from "next/server";

import { getCourseBySlug } from "@/lib/courses";
import { notifyPaymentFailed } from "@/lib/email";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      courseSlug?: string;
      customerEmail?: string;
      reason?: string;
    };

    const courseSlug = body.courseSlug?.trim();
    const customerEmail = body.customerEmail?.trim();
    const reason = body.reason?.trim() || "Checkout was not completed.";

    if (!courseSlug || !customerEmail || !isValidEmail(customerEmail)) {
      return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
    }

    const course = getCourseBySlug(courseSlug);
    if (!course) {
      return NextResponse.json({ ok: false, error: "Unknown course." }, { status: 400 });
    }

    await notifyPaymentFailed({
      customerEmail,
      courseTitle: course.title,
      courseSlug,
      reason,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[razorpay/notify-failed]", error);
    return NextResponse.json({ ok: false, error: "Unable to send notification." }, { status: 500 });
  }
}
