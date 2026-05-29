import { createAdminClient } from "@/lib/supabase/admin";

export async function markInquiryEnrolledForCourse(email: string, courseSlug: string) {
  if (!email.includes("@")) return;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("contact_inquiries")
      .update({ status: "Enrolled" })
      .ilike("email", email.trim())
      .eq("interest", courseSlug)
      .in("status", ["New", "Contacted"]);

    if (error && !error.message.toLowerCase().includes("status")) {
      console.error("[markInquiryEnrolledForCourse]", error.message);
    }
  } catch (err) {
    console.error("[markInquiryEnrolledForCourse]", err);
  }
}
