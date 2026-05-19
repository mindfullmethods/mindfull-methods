import { supabase } from "@/lib/supabase";

export async function applyToInternship(
  internshipId: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Please login first");
    return;
  }

  const { error } = await supabase
    .from("applications")
    .insert({
      user_id: user.id,
      internship_id: internshipId,
    });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Application submitted!");
}

export async function getMyApplications() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("CURRENT USER:", user);

  if (!user) return [];

  console.log("AUTH USER:", user);

  const { data, error } = await supabase
  .from("applications")
  .select("*")
  .eq("user_id", user.id);
  console.log("APPLICATIONS FROM DB:", data);

console.log("RAW APPLICATIONS:", data);

if (error) {
  console.log("SUPABASE ERROR:", error);
  return [];
}

console.log("APPLICATION DATA:", data);

return data;
}