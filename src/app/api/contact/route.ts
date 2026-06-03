import { NextResponse } from "next/server";

import { saveContactInquiry } from "@/lib/contact-inquiries";
import { sendContactEmail } from "@/lib/email";
import { isEmailRateLimited } from "@/lib/rate-limit-inquiry";

type ContactRequest = {
  name: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactRequest;

    if (!body?.name?.trim() || !body?.email?.trim() || !body?.message?.trim()) {
      return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }

    if (!isValidEmail(body.email)) {
      return NextResponse.json({ ok: false, error: "Invalid email address." }, { status: 400 });
    }

    if (body.message.trim().length < 10) {
      return NextResponse.json({ ok: false, error: "Message is too short." }, { status: 400 });
    }

    const email = body.email.trim().toLowerCase();

    if (await isEmailRateLimited(email, "contact_inquiries")) {
      return NextResponse.json(
        { ok: false, error: "Too many messages from this email. Try again in about an hour." },
        { status: 429 }
      );
    }

    const payload = {
      name: body.name.trim(),
      email,
      phone: body.phone?.trim(),
      interest: body.interest?.trim() || "general",
      message: body.message.trim(),
    };

    const [emailResult, saveResult] = await Promise.all([
      sendContactEmail(payload),
      saveContactInquiry(payload),
    ]);

    if (!saveResult.saved) {
      console.warn("[contact] DB save skipped:", saveResult.error);
    }

    return NextResponse.json({
      ok: true,
      ...emailResult,
      saved: saveResult.saved,
    });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
