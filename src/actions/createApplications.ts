"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseSchemaError } from "@/lib/applications-schema-sql";
import { notifyApplicationSubmitted } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";
import { getInternshipById } from "@/Services/internship-details";

async function insertApplicationForm(
  admin: ReturnType<typeof createAdminClient>,
  rows: Record<string, unknown>[]
) {
  let lastError: { message?: string; code?: string } | null = null;

  for (const row of rows) {
    const { error } = await admin.from("applications").insert([row]);
    if (!error) return null;
    lastError = error;
    if (!isSupabaseSchemaError(error.message)) break;
  }

  return lastError;
}

export async function createApplication(formData: FormData) {
  const internship_id = String(formData.get("internship_id") ?? "").trim();
  const student_name = formData.get("student_name");
  const email = formData.get("email");
  const resume = formData.get("resume");

  if (!internship_id) {
    redirect("/dashboard/internships?error=apply");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    redirect(`/dashboard/apply/${encodeURIComponent(internship_id)}?error=config`);
  }

  const error = await insertApplicationForm(admin, [
    {
      internship_id,
      student_name,
      email,
      resume,
      user_id: user?.id ?? null,
      status: "Pending",
    },
    {
      internship_id,
      student_name,
      email,
      resume,
      user_id: user?.id ?? null,
    },
    {
      internship_id,
      user_id: user?.id ?? null,
    },
  ]);

  if (error) {
    console.error("[createApplication]", error.message, error.code);
    redirect(`/dashboard/apply/${encodeURIComponent(internship_id)}?error=1`);
  }

  const internship = await getInternshipById(internship_id);
  const studentEmail = String(email ?? user?.email ?? "").trim();
  if (studentEmail) {
    void notifyApplicationSubmitted({
      studentName: String(student_name ?? user?.user_metadata?.full_name ?? "Student"),
      studentEmail,
      internshipTitle: internship?.title ?? "Internship",
      company: internship?.company,
      resume: resume ? String(resume) : null,
    }).catch((err) => console.error("[createApplication] email", err));
  }

  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard/my-applications");
  revalidatePath("/dashboard");

  redirect("/dashboard/my-applications?submitted=1");
}
