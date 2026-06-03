import { createAdminClient } from "@/lib/supabase/admin";

export async function recordCheckoutIntent(params: {
  razorpayOrderId: string;
  courseSlug: string;
  courseTitle: string;
  email?: string | null;
  amountPaise: number;
  promoCode?: string | null;
  referralCode?: string | null;
}) {
  try {
    const admin = createAdminClient();
    await admin.from("checkout_intents").upsert(
      {
        razorpay_order_id: params.razorpayOrderId,
        course_slug: params.courseSlug,
        course_title: params.courseTitle,
        email: params.email?.trim() || null,
        amount_paise: params.amountPaise,
        promo_code: params.promoCode?.trim().toUpperCase() || null,
        referral_code: params.referralCode?.trim().toUpperCase() || null,
        completed: false,
        reminder_sent_at: null,
      },
      { onConflict: "razorpay_order_id" }
    );
  } catch (err) {
    console.warn("[checkout-intents] record", err);
  }
}

export async function markCheckoutCompleted(razorpayOrderId: string) {
  try {
    const admin = createAdminClient();
    await admin
      .from("checkout_intents")
      .update({ completed: true })
      .eq("razorpay_order_id", razorpayOrderId);
  } catch (err) {
    console.warn("[checkout-intents] complete", err);
  }
}

export async function getAbandonedCheckoutCandidates() {
  try {
    const admin = createAdminClient();
    const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const stale = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const { data, error } = await admin
      .from("checkout_intents")
      .select("*")
      .eq("completed", false)
      .is("reminder_sent_at", null)
      .not("email", "is", null)
      .lt("created_at", cutoff)
      .gt("created_at", stale);

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function markCheckoutReminderSent(id: string) {
  try {
    const admin = createAdminClient();
    await admin
      .from("checkout_intents")
      .update({ reminder_sent_at: new Date().toISOString() })
      .eq("id", id);
  } catch {
    /* ignore */
  }
}
