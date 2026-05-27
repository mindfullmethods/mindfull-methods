"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

function readField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateInternship(id: string, formData: FormData) {
  await requireAdmin();

  const title = readField(formData, "title");
  const company = readField(formData, "company");
  const description = readField(formData, "description");
  const duration = readField(formData, "duration");
  const stipend = readField(formData, "stipend");
  const image_url = readField(formData, "image_url");

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Admin database client is not configured.";
    redirect(`/dashboard/admin/edit/${id}?error=${encodeURIComponent(message)}`);
  }

  const { error } = await supabase
    .from("internships")
    .update({
      title,
      company,
      description,
      duration,
      stipend,
      image_url,
    })
    .eq("id", id);

  if (error) {
    console.error("[updateInternship]", error);
    redirect(`/dashboard/admin/edit/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/admin");
  revalidatePath(`/dashboard/admin/edit/${id}`);
  revalidatePath("/dashboard/internships");
  revalidatePath(`/dashboard/internships/${id}`);
  redirect("/dashboard/admin?updated=1");
}
