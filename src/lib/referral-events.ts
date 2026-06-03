import { createAdminClient } from "@/lib/supabase/admin";

export async function recordReferralEvent(params: {
  referralCode: string;
  courseSlug: string;
  email?: string | null;
  razorpayOrderId: string;
}) {
  try {
    const admin = createAdminClient();
    await admin.from("referral_events").upsert(
      {
        referral_code: params.referralCode.trim().toUpperCase(),
        course_slug: params.courseSlug,
        email: params.email?.trim() || null,
        razorpay_order_id: params.razorpayOrderId,
        completed: false,
      },
      { onConflict: "razorpay_order_id" }
    );
  } catch (err) {
    console.warn("[referral-events] record", err);
  }
}

export async function markReferralCompleted(razorpayOrderId: string) {
  try {
    const admin = createAdminClient();
    await admin
      .from("referral_events")
      .update({ completed: true })
      .eq("razorpay_order_id", razorpayOrderId);
  } catch (err) {
    console.warn("[referral-events] complete", err);
  }
}

export type ReferralStat = { code: string; attempts: number; completed: number };

export async function getReferralStats(): Promise<ReferralStat[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from("referral_events").select("referral_code, completed");
    if (error) return [];

    const map = new Map<string, { attempts: number; completed: number }>();
    for (const row of data ?? []) {
      const code = (row.referral_code as string) ?? "";
      const current = map.get(code) ?? { attempts: 0, completed: 0 };
      current.attempts += 1;
      if (row.completed) current.completed += 1;
      map.set(code, current);
    }

    return [...map.entries()]
      .map(([code, stats]) => ({ code, ...stats }))
      .sort((a, b) => b.completed - a.completed);
  } catch {
    return [];
  }
}
