import { supabase } from "@/lib/supabase";

export async function getMyApplications() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

     const { data, error } = await supabase
     .from("applications")
      .select("*");
      console.log("APPLICATIONS:", data);


  if (error) {
    console.error(error);
    return [];
  }

  return data;
}