import { createAdminClient } from "@/lib/supabase/admin";

export { APPLICATIONS_STATUS_SQL } from "@/lib/applications-schema-sql";

export async function isApplicationsStatusReady() {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("applications").select("status").limit(1);

    if (!error) return true;

    const message = error.message.toLowerCase();
    return !message.includes("status") && !message.includes("schema cache");
  } catch {
    return false;
  }
}
