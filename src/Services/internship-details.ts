import { supabase } from "@/lib/supabase";

export async function getInternshipById(
  id: string
) {
  const { data, error } = await supabase
    .from("internships")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}