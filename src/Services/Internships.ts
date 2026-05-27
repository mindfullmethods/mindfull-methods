import { createClient } from "@/lib/supabase/server";

export async function getInternships() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("internships").select("*").order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error:", error.message);
    return [];
  }

  return data ?? [];
}
