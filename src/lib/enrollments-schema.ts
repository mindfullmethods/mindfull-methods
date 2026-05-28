import { createAdminClient } from "@/lib/supabase/admin";

export { ENROLLMENTS_TABLE_SQL } from "@/lib/enrollments-schema-sql";
export { isSupabaseSchemaError } from "@/lib/applications-schema-sql";

export async function isEnrollmentsTableReady() {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("enrollments").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}
