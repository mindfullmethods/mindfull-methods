"use server";

import { supabase } from "@/lib/supabase";

export async function createInternship(formData: FormData) {

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
      .insert([
        {
          title,
          company,
          description,
          duration,
          stipend,
          image_url,
        },
      ]);

  if (error) {
    console.log(error);

    return;
  }

  console.log(
    "Internship created successfully"
  );
}