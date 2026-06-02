import { createAdminClient } from "@/lib/supabase/admin";

import type { InquiryStatusEvent } from "@/lib/inquiry-status-history";

export type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  interest: string;
  interest_label?: string | null;
  message: string;
  status?: string | null;
  admin_notes?: string | null;
  linked_enrollment_id?: string | null;
  status_history?: InquiryStatusEvent[] | null;
  created_at: string;
};

export async function getContactInquiries(): Promise<ContactInquiry[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getContactInquiries]", error);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error("[getContactInquiries]", err);
    return [];
  }
}
