"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_STATUSES = ["New", "Contacted", "Enrolled", "Closed"] as const;

export type InquiryStatus = (typeof ALLOWED_STATUSES)[number];

export async function updateInquiryStatus(inquiryId: string, status: InquiryStatus) {
  await requireAdmin();

  if (!ALLOWED_STATUSES.includes(status)) {
    return { ok: false as const, error: "Invalid status." };
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Admin database client is not configured.";
    return { ok: false as const, error: message };
  }

  const { error } = await supabase.from("contact_inquiries").update({ status }).eq("id", inquiryId);

  if (error) {
    console.error("[updateInquiryStatus]", error);
    const message = error.message ?? "Update failed.";

    if (message.includes("status") && message.includes("schema cache")) {
      return {
        ok: false as const,
        error:
          "The status column is missing. Run supabase/contact-inquiries-status.sql in Supabase SQL Editor, then refresh.",
      };
    }

    return { ok: false as const, error: message };
  }

  revalidatePath("/dashboard/inquiries");

  return { ok: true as const, status };
}
