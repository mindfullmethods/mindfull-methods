"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { applicationsSchemaFixMessage, isSupabaseSchemaError } from "@/lib/applications-schema-sql";
import { notifyApplicationSubmitted } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";
import { getInternshipById } from "@/Services/internship-details";

export type ApplyResult =
  | { ok: true; message: string }
  | { ok: false; error: string; code?: "auth" | "duplicate" | "config" | "unknown" };

function applyErrorMessage(error: { message?: string; code?: string }) {
  if (error.code === "23505") {
    return "You already applied to this internship.";
  }

  const message = error.message ?? "";

  if (message.includes("row-level security") || message.includes("RLS")) {
    return "Application insert blocked by database policy. Run supabase/applications-insert-policy.sql in Supabase.";
  }

  if (message.includes("status") && message.includes("schema cache")) {
    return "Missing status column. Run supabase/applications-missing-columns.sql in Supabase SQL Editor.";
  }

  const schemaFix = applicationsSchemaFixMessage(message);
  if (schemaFix) return schemaFix;

  return message || "Could not submit application. Try again.";
}

async function insertApplication(
  admin: ReturnType<typeof createAdminClient>,
  rows: Record<string, unknown>[]
) {
  let lastError: { message?: string; code?: string } | null = null;

  for (const row of rows) {
    const { error } = await admin.from("applications").insert(row);
    if (!error) return null;
    lastError = error;
    if (!isSupabaseSchemaError(error.message)) break;
  }

  return lastError;
}

export async function applyToInternshipAction(internshipId: string): Promise<ApplyResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Please sign in to apply.", code: "auth" };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return {
      ok: false,
      error: "Server missing SUPABASE_SERVICE_ROLE_KEY. Add it in .env.local and Vercel.",
      code: "config",
    };
  }

  const { data: existingApplications } = await admin
    .from("applications")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("internship_id", internshipId);

  const activeApplication = existingApplications?.find(
    (app) => (app.status ?? "Pending").toLowerCase() !== "withdrawn"
  );

  if (activeApplication) {
    return { ok: false, error: "You already applied to this internship.", code: "duplicate" };
  }

  const withdrawnApplication = existingApplications?.find(
    (app) => (app.status ?? "").toLowerCase() === "withdrawn"
  );

  if (withdrawnApplication) {
    const { error: reopenError } = await admin
      .from("applications")
      .update({ status: "Pending" })
      .eq("id", withdrawnApplication.id);

    if (reopenError) {
      return { ok: false, error: reopenError.message, code: "unknown" };
    }

    revalidatePath("/dashboard/my-applications");
    revalidatePath("/dashboard/applications");
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/internships/${internshipId}`);

    return { ok: true, message: "Application submitted successfully." };
  }

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    null;

  const error = await insertApplication(admin, [
    {
      user_id: user.id,
      internship_id: internshipId,
      student_name: fullName,
      email: user.email,
      status: "Pending",
    },
    {
      user_id: user.id,
      internship_id: internshipId,
      status: "Pending",
    },
    {
      user_id: user.id,
      internship_id: internshipId,
    },
  ]);

  if (error) {
    console.error("[applyToInternshipAction]", error.message, error.code);
    return {
      ok: false,
      error: applyErrorMessage(error),
      code: error.code === "23505" ? "duplicate" : "unknown",
    };
  }

  revalidatePath("/dashboard/my-applications");
  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/internships/${internshipId}`);

  const internship = await getInternshipById(internshipId);
  if (user.email) {
    void notifyApplicationSubmitted({
      studentName: fullName ?? user.email.split("@")[0] ?? "Student",
      studentEmail: user.email,
      internshipTitle: internship?.title ?? "Internship",
      company: internship?.company,
    }).catch((err) => console.error("[applyToInternshipAction] email", err));
  }

  return { ok: true, message: "Application submitted successfully." };
}
