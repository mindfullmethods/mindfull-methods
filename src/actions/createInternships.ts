"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

function readField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createInternship(formData: FormData) {
  await requireAdmin();

  const title = readField(formData, "title");
  const company = readField(formData, "company");
  const description = readField(formData, "description");
  const duration = readField(formData, "duration");
  const stipend = readField(formData, "stipend");
  const image_url = readField(formData, "image_url");

  if (!title || !company || !description) {
    redirect("/dashboard/admin?error=Title%2C%20company%2C%20and%20description%20are%20required.");
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Admin database client is not configured.";
    redirect(`/dashboard/admin?error=${encodeURIComponent(message)}`);
  }

  const { error } = await supabase.from("internships").insert({
    title,
    company,
    description,
    duration,
    stipend,
    image_url,
  });

  if (error) {
    console.error("[createInternship]", error);
    redirect(`/dashboard/admin?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/internships");
  revalidatePath("/dashboard");
  redirect("/dashboard/admin?created=1");
}
