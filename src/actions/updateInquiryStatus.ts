"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { notifyInquiryStatusChange } from "@/lib/email";
import type { InquiryStatusEvent } from "@/lib/inquiry-status-history";
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

  const { data: current } = await supabase
    .from("contact_inquiries")
    .select("status, status_history, name, email, interest, interest_label")
    .eq("id", inquiryId)
    .maybeSingle();

  if (current?.status === status) {
    return { ok: true as const, status };
  }

  const history: InquiryStatusEvent[] = [
    ...((current?.status_history as InquiryStatusEvent[] | undefined) ?? []),
    { status, at: new Date().toISOString() },
  ];

  let { error } = await supabase
    .from("contact_inquiries")
    .update({ status, status_history: history })
    .eq("id", inquiryId);

  if (error?.message?.includes("status_history")) {
    ({ error } = await supabase.from("contact_inquiries").update({ status }).eq("id", inquiryId));
  }

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

  if (current?.email && status !== "New") {
    const { getCourseBySlug } = await import("@/lib/courses");
    const interestLabel =
      current.interest_label ??
      (current.interest === "general"
        ? "General guidance"
        : (getCourseBySlug(current.interest)?.title ?? current.interest));

    void notifyInquiryStatusChange({
      name: current.name ?? "there",
      email: current.email,
      interest: interestLabel,
      status,
    }).catch((err) => console.error("[updateInquiryStatus] email", err));
  }

  return { ok: true as const, status };
}
