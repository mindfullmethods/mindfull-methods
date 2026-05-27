import { createClient } from "@/lib/supabase/server";

export async function getMyApplications() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase.from("applications").select("*").eq("user_id", user.id);

  if (error) {
    console.error("SUPABASE ERROR:", error);
    return [];
  }

  return data ?? [];
}
