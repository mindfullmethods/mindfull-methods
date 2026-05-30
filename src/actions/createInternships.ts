"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isMissingColumnError } from "@/lib/supabase/column-errors";

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
  const tags = readField(formData, "tags");
  const is_published = formData.get("is_published") === "on";

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

  const baseRow = {
    title,
    company,
    description,
    duration,
    stipend,
    image_url,
  };

  const extendedRow = {
    ...baseRow,
    tags: tags || null,
    is_published,
  };

  let { error } = await supabase.from("internships").insert(extendedRow);

  if (error && isMissingColumnError(error.message, "is_published", "tags")) {
    ({ error } = await supabase.from("internships").insert(baseRow));
  }

  if (error) {
    console.error("[createInternship]", error);
    redirect(`/dashboard/admin?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/internships");
  revalidatePath("/dashboard");
  redirect("/dashboard/admin?created=1");
}
