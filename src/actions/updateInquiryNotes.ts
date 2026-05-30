"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isMissingColumnError } from "@/lib/supabase/column-errors";

export async function updateInquiryNotes(inquiryId: string, adminNotes: string) {
  await requireAdmin();

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Admin database client is not configured.";
    return { ok: false as const, error: message };
  }

  const { error } = await supabase
    .from("contact_inquiries")
    .update({ admin_notes: adminNotes.trim() || null })
    .eq("id", inquiryId);

  if (error) {
    console.error("[updateInquiryNotes]", error);
    if (isMissingColumnError(error.message, "admin_notes")) {
      return {
        ok: false as const,
        error: "Admin notes column missing — run the SQL from the yellow banner on this page, then refresh.",
      };
    }
    return { ok: false as const, error: error.message };
  }

  revalidatePath("/dashboard/inquiries");
  revalidatePath("/dashboard/admin-home");

  return { ok: true as const };
}

export async function linkInquiryToEnrollment(inquiryId: string, enrollmentId: string | null) {
  await requireAdmin();

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Admin database client is not configured.";
    return { ok: false as const, error: message };
  }

  const { error } = await supabase
    .from("contact_inquiries")
    .update({ linked_enrollment_id: enrollmentId })
    .eq("id", inquiryId);

  if (error) {
    console.error("[linkInquiryToEnrollment]", error);
    return { ok: false as const, error: error.message };
  }

  revalidatePath("/dashboard/inquiries");

  return { ok: true as const };
}
