import { NextResponse } from "next/server";

import {
  getAbandonedCheckoutCandidates,
  markCheckoutReminderSent,
} from "@/lib/checkout-intents";
import { notifyAbandonedCheckout } from "@/lib/email";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const candidates = await getAbandonedCheckoutCandidates();
  let sent = 0;

  for (const row of candidates) {
    const email = row.email?.trim();
    if (!email) continue;

    try {
      await notifyAbandonedCheckout({
        studentEmail: email,
        courseTitle: row.course_title,
        courseSlug: row.course_slug,
        amountLabel: `₹${Math.round((row.amount_paise ?? 0) / 100).toLocaleString("en-IN")}`,
      });
      await markCheckoutReminderSent(row.id);
      sent += 1;
    } catch (err) {
      console.error("[checkout-recovery]", email, err);
    }
  }

  return NextResponse.json({ ok: true, candidates: candidates.length, sent });
}
