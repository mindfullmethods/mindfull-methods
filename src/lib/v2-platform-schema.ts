import { createAdminClient } from "@/lib/supabase/admin";

async function tableQueryable(table: string) {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from(table).select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}

export async function isV2PlatformReady() {
  const [waitlist, newsletter, audit, checkout] = await Promise.all([
    tableQueryable("course_waitlist"),
    tableQueryable("newsletter_subscribers"),
    tableQueryable("admin_audit_log"),
    tableQueryable("checkout_intents"),
  ]);
  return waitlist && newsletter && audit && checkout;
}

export async function isCourseWaitlistReady() {
  return tableQueryable("course_waitlist");
}

export async function isNewsletterTableReady() {
  return tableQueryable("newsletter_subscribers");
}
