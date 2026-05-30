import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

export { APPLICATIONS_STATUS_SQL } from "@/lib/applications-schema-sql";

export type ApplicationsSchemaIssue = "missing_column" | "missing_service_role";

function isMissingStatusColumn(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("status") ||
    lower.includes("schema cache") ||
    lower.includes("pgrst205") ||
    lower.includes("does not exist")
  );
}

async function probeStatusColumn(supabase: SupabaseClient) {
  const { error } = await supabase.from("applications").select("status").limit(1);
  return error;
}

export async function getApplicationsSchemaIssue(): Promise<ApplicationsSchemaIssue | null> {
  try {
    const admin = createAdminClient();
    const error = await probeStatusColumn(admin);

    if (!error) return null;
    if (isMissingStatusColumn(error.message)) return "missing_column";
    return null;
  } catch {
    try {
      const supabase = await createClient();
      const error = await probeStatusColumn(supabase);

      if (!error) return "missing_service_role";
      if (isMissingStatusColumn(error.message)) return "missing_column";
      return "missing_service_role";
    } catch {
      return "missing_service_role";
    }
  }
}

export async function isApplicationsStatusReady() {
  const issue = await getApplicationsSchemaIssue();
  return issue === null;
}
