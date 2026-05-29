import { createAdminClient } from "@/lib/supabase/admin";

export type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  interest: string;
  interest_label?: string | null;
  message: string;
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
