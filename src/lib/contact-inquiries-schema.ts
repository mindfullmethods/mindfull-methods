import { createAdminClient } from "@/lib/supabase/admin";

export {
  CONTACT_INQUIRIES_ADMIN_NOTES_SQL,
  CONTACT_INQUIRIES_LINKED_ENROLLMENT_SQL,
  CONTACT_INQUIRIES_STATUS_SQL,
  CONTACT_INQUIRIES_TABLE_SQL,
} from "@/lib/contact-inquiries-schema-sql";

export async function isContactInquiriesTableReady() {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_inquiries").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}

export async function isContactInquiryStatusReady() {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_inquiries").select("status").limit(1);
    if (!error) return true;

    const message = error.message.toLowerCase();
    return !message.includes("status") && !message.includes("schema cache");
  } catch {
    return false;
  }
}

export async function isContactInquiryAdminNotesReady() {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_inquiries").select("admin_notes").limit(1);
    return !error;
  } catch {
    return false;
  }
}

export async function isContactInquiryLinkedEnrollmentReady() {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_inquiries").select("linked_enrollment_id").limit(1);
    return !error;
  } catch {
    return false;
  }
}
