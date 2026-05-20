"use server";

import { supabase } from "@/lib/supabase";

export async function updateInternship(
  id: string,
  formData: FormData
) {

  const title =
    formData.get("title");

  const company =
    formData.get("company");

  const description =
    formData.get("description");

  const duration =
    formData.get("duration");

  const stipend =
    formData.get("stipend");

  const image_url =
    formData.get("image_url");

  const { error } =
    await supabase
      .from("internships")
      .update({
        title,
        company,
        description,
        duration,
        stipend,
        image_url,
      })
      .eq("id", id);

  if (error) {
    console.log(error);
    return;
  }

  console.log(
    "Internship updated successfully"
  );
}