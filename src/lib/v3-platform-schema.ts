import { createAdminClient } from "@/lib/supabase/admin";

export async function isV3GrowthReady() {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("referral_events").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}
