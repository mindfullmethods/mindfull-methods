import { cache } from "react";

import { createAdminClient } from "@/lib/supabase/admin";

export type CompletionVerificationStatus = "pending" | "approved" | "rejected";

export type CompletionVerification = {
  user_id: string;
  course_slug: string;
  status: CompletionVerificationStatus;
  requested_at: string;
  reviewed_at: string | null;
  reviewer_notes: string | null;
};

export function isSupabaseCompletionVerificationError(message: string) {
  return (
    message.includes("course_completion_verifications") ||
    message.includes("schema cache") ||
    message.includes("does not exist")
  );
}

export const isCompletionVerificationTableReady = cache(async () => {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("course_completion_verifications").select("user_id").limit(1);
    return !error;
  } catch {
    return false;
  }
});

export async function getCompletionVerificationsForUser(userId: string) {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("course_completion_verifications")
      .select("*")
      .eq("user_id", userId)
      .order("requested_at", { ascending: false });

    if (error) return [];
    return (data ?? []) as CompletionVerification[];
  } catch {
    return [];
  }
}

export async function getCompletionVerification(userId: string, courseSlug: string) {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("course_completion_verifications")
      .select("*")
      .eq("user_id", userId)
      .eq("course_slug", courseSlug)
      .maybeSingle();

    if (error || !data) return null;
    return data as CompletionVerification;
  } catch {
    return null;
  }
}

export async function requestCompletionVerification(userId: string, courseSlug: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("course_completion_verifications")
    .upsert(
      {
        user_id: userId,
        course_slug: courseSlug,
        status: "pending",
        requested_at: new Date().toISOString(),
        reviewed_at: null,
        reviewer_notes: null,
      },
      { onConflict: "user_id,course_slug" }
    )
    .select("*")
    .single();

  if (error) {
    throw new Error(
      isSupabaseCompletionVerificationError(error.message)
        ? "Run supabase/completion-verifications-schema.sql in Supabase SQL Editor."
        : error.message
    );
  }

  return data as CompletionVerification;
}

export async function ensureCompletionApproved(userId: string, courseSlug: string, notes?: string | null) {
  const admin = createAdminClient();
  const { error } = await admin.from("course_completion_verifications").upsert(
    {
      user_id: userId,
      course_slug: courseSlug,
      status: "approved",
      requested_at: new Date().toISOString(),
      reviewed_at: new Date().toISOString(),
      reviewer_notes: notes ?? null,
    },
    { onConflict: "user_id,course_slug" }
  );

  if (error) {
    throw new Error(
      isSupabaseCompletionVerificationError(error.message)
        ? "Run supabase/completion-verifications-schema.sql in Supabase SQL Editor."
        : error.message
    );
  }
}

export async function updateCompletionVerification(params: {
  userId: string;
  courseSlug: string;
  status: CompletionVerificationStatus;
  reviewerNotes?: string | null;
}) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("course_completion_verifications")
    .update({
      status: params.status,
      reviewed_at: new Date().toISOString(),
      reviewer_notes: params.reviewerNotes ?? null,
    })
    .eq("user_id", params.userId)
    .eq("course_slug", params.courseSlug)
    .select("*")
    .single();

  if (error) {
    throw new Error(
      isSupabaseCompletionVerificationError(error.message)
        ? "Run supabase/completion-verifications-schema.sql in Supabase SQL Editor."
        : error.message
    );
  }

  return data as CompletionVerification;
}

export async function getPendingCompletionVerifications() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("course_completion_verifications")
      .select("*")
      .eq("status", "pending")
      .order("requested_at", { ascending: true });

    if (error) return [];
    return (data ?? []) as CompletionVerification[];
  } catch {
    return [];
  }
}

export async function isCompletionApproved(userId: string, courseSlug: string) {
  const row = await getCompletionVerification(userId, courseSlug);
  return row?.status === "approved";
}
