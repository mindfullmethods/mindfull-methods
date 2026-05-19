import { supabase } from "@/lib/supabase";

export async function applyToInternship(
  internshipId: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Please login first.");
    return;
  }

  // Check existing application
  const { data: existingApplications } =
  await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .eq("internship_id", internshipId);

if (
  existingApplications &&
  existingApplications.length > 0
) {
  alert("You already applied.");
  return;
}

  // Insert application
  const { error } = await supabase
    .from("applications")
    .insert({
      user_id: user.id,
      internship_id: internshipId,
    });

  if (error) {
    console.log(error);
    alert("Something went wrong.");
    return;
  }

  alert("Application submitted successfully!");
}