import { createClient } from "@/lib/supabase/server";

export async function getInternshipById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("internships").select("*").eq("id", id).single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
