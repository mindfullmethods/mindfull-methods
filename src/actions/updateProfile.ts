"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function updateProfileAction(fullName: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, error: "Please sign in." };
  }

  const trimmed = fullName.trim();
  if (!trimmed) {
    return { ok: false as const, error: "Name is required." };
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: trimmed, name: trimmed },
  });

  if (authError) {
    return { ok: false as const, error: authError.message };
  }

  await supabase.from("profiles").upsert({
    id: user.id,
    full_name: trimmed,
    email: user.email,
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/my-courses");

  return { ok: true as const };
}

export async function updatePasswordAction(password: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, error: "Please sign in." };
  }

  if (password.length < 8) {
    return { ok: false as const, error: "Password must be at least 8 characters." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const };
}
