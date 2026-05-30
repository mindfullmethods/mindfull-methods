"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

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
    if (error.message.includes("admin_notes")) {
      return {
        ok: false as const,
        error: "Run supabase/admin-dashboard-extensions.sql in Supabase SQL Editor to add admin notes.",
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
