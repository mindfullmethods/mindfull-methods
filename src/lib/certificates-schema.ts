import { createAdminClient } from "@/lib/supabase/admin";

export async function isCertificatesTableReady() {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("course_certificates").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}
