import { supabase } from "@/lib/supabase";

export async function getInternships() {
  const { data, error } = await supabase
    .from("internships")
    .select("*");

  if (error) {
    console.error(
  "Supabase Error:",
  error.message
);
    return [];
  }

  return data;
}