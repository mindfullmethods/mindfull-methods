import { supabase } from "@/lib/supabase";

export async function getInternships() {
  const { data, error } = await supabase
    .from("internships")
    .select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}