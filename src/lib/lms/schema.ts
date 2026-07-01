import { createClient } from "@/lib/supabase/server";

let cachedReady: boolean | null = null;

export async function isLmsSchemaReady() {
  if (cachedReady !== null) return cachedReady;

  const supabase = await createClient();
  const { error } = await supabase.from("lms_courses").select("id").limit(1);

  if (error) {
    cachedReady = error.message.includes("schema cache") || error.message.includes("does not exist") ? false : false;
    return false;
  }

  cachedReady = true;
  return true;
}
