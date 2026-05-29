import { createAdminClient } from "@/lib/supabase/admin";

export { CONTACT_INQUIRIES_TABLE_SQL } from "@/lib/contact-inquiries-schema-sql";

export async function isContactInquiriesTableReady() {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_inquiries").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}
