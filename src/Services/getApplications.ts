import { createClient } from "@/lib/supabase/server";

export async function getApplications() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}
