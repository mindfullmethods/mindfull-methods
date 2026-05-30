import { createClient } from "@/lib/supabase/server";
import { isMissingColumnError } from "@/lib/supabase/column-errors";

export async function getInternships(options?: { includeUnpublished?: boolean }) {
  const supabase = await createClient();

  const fetchAll = (filterPublished: boolean) => {
    let query = supabase.from("internships").select("*").order("created_at", { ascending: false });

    if (!options?.includeUnpublished && filterPublished) {
      query = query.or("is_published.is.null,is_published.eq.true");
    }

    return query;
  };

  let result = await fetchAll(true);

  if (
    result.error &&
    isMissingColumnError(result.error.message, "is_published") &&
    !options?.includeUnpublished
  ) {
    result = await fetchAll(false);
  }

  if (result.error) {
    console.error("Supabase Error:", result.error.message);
    return [];
  }

  return result.data ?? [];
}
