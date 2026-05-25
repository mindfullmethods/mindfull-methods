"use server";

import { supabase } from "@/lib/supabase";

export async function createApplication(
  formData: FormData
) {
  const internship_id =
    formData.get("internship_id");

  const student_name =
    formData.get("student_name");

  const email =
    formData.get("email");

  const resume =
    formData.get("resume");

  await supabase.from("applications").insert([
    {
      internship_id,
      student_name,
      email,
      resume,
    },
  ]);
}