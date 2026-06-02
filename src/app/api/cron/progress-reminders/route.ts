import { NextResponse } from "next/server";

import { notifyProgressReminder } from "@/lib/email";
import { getProgressReminderCandidates } from "@/Services/progress-reminders";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const candidates = await getProgressReminderCandidates();
  let sent = 0;
  const errors: string[] = [];

  for (const candidate of candidates) {
    try {
      await notifyProgressReminder({
        studentName: candidate.studentName,
        studentEmail: candidate.email,
        courseTitle: candidate.courseTitle,
        courseSlug: candidate.courseSlug,
        percent: candidate.percent,
        kind: candidate.kind,
      });
      sent += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Send failed";
      errors.push(`${candidate.email}: ${message}`);
    }
  }

  return NextResponse.json({
    ok: true,
    candidates: candidates.length,
    sent,
    errors: errors.length ? errors : undefined,
  });
}
