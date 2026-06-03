import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { isEmailRateLimited } from "@/lib/rate-limit-inquiry";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
    }

    if (await isEmailRateLimited(email, "newsletter_subscribers")) {
      return NextResponse.json(
        { ok: false, error: "Too many attempts. Try again in about an hour." },
        { status: 429 }
      );
    }

    const admin = createAdminClient();
    const { error } = await admin.from("newsletter_subscribers").upsert(
      { email, source: "footer" },
      { onConflict: "email" }
    );

    if (error) {
      const hint = error.message.includes("newsletter_subscribers")
        ? "Run supabase/v2-platform-extensions.sql."
        : error.message;
      return NextResponse.json({ ok: false, error: hint }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Subscribe failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
