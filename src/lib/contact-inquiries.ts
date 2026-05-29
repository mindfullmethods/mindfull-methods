import { getCourseBySlug } from "@/lib/courses";
import { createAdminClient } from "@/lib/supabase/admin";

export type ContactInquiryInput = {
  name: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
};

export async function saveContactInquiry(payload: ContactInquiryInput) {
  const interest = payload.interest.trim() || "general";
  const interestLabel =
    interest === "general"
      ? "General guidance"
      : (getCourseBySlug(interest)?.title ?? interest);

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_inquiries").insert({
      name: payload.name,
      email: payload.email,
      phone: payload.phone ?? null,
      interest,
      interest_label: interestLabel,
      message: payload.message,
    });

    if (error) {
      console.error("[saveContactInquiry]", error);
      return { saved: false as const, error: error.message };
    }

    return { saved: true as const };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save inquiry.";
    console.error("[saveContactInquiry]", message);
    return { saved: false as const, error: message };
  }
}
