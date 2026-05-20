"use server";

import { supabase } from "@/lib/supabase";

export async function deleteInternship(id: string) {

  const { error } =
    await supabase
      .from("internships")
      .delete()
      .eq("id", id);

  if (error) {
    console.log(error);
    return;
  }

  console.log(
    "Internship deleted successfully"
  );
}