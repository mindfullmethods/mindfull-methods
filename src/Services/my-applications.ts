import { createClient } from "@/lib/supabase/server";

export type MyApplication = {
  id: string;
  internship_id: string;
  user_id: string;
  status?: string;
  created_at?: string;
  internships?: {
    title: string;
    company: string;
    duration?: string;
    stipend?: string;
  } | null;
};

export async function getMyApplicationsWithDetails(): Promise<MyApplication[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: applications, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      "[getMyApplicationsWithDetails]",
      error.message,
      error.code,
      error.details ?? error.hint
    );
    return [];
  }

  if (!applications?.length) return [];

  const internshipIds = [
    ...new Set(applications.map((app) => app.internship_id).filter(Boolean)),
  ] as string[];

  const internshipMap = new Map<string, NonNullable<MyApplication["internships"]>>();

  if (internshipIds.length > 0) {
    const { data: internships, error: internshipError } = await supabase
      .from("internships")
      .select("id, title, company, duration, stipend")
      .in("id", internshipIds);

    if (internshipError) {
      console.error(
        "[getMyApplicationsWithDetails] internships",
        internshipError.message,
        internshipError.code
      );
    } else {
      for (const internship of internships ?? []) {
        internshipMap.set(internship.id, {
          title: internship.title,
          company: internship.company,
          duration: internship.duration ?? undefined,
          stipend: internship.stipend ?? undefined,
        });
      }
    }
  }

  return applications.map((app) => ({
    ...app,
    internships: app.internship_id ? (internshipMap.get(app.internship_id) ?? null) : null,
  }));
}
