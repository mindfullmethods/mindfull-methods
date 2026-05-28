import { createClient } from "@/lib/supabase/server";

export type AdminApplication = {
  id: string;
  internship_id?: string | null;
  user_id?: string | null;
  student_name?: string | null;
  email?: string | null;
  resume?: string | null;
  status?: string | null;
  created_at?: string | null;
  internship?: {
    title: string;
    company: string;
  } | null;
};

export async function getApplications(): Promise<AdminApplication[]> {
  const supabase = await createClient();

  const { data: applications, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getApplications]", error.message, error.code);
    return [];
  }

  if (!applications?.length) return [];

  const internshipIds = [
    ...new Set(applications.map((app) => app.internship_id).filter(Boolean)),
  ] as string[];

  const internshipMap = new Map<string, { title: string; company: string }>();

  if (internshipIds.length > 0) {
    const { data: internships } = await supabase
      .from("internships")
      .select("id, title, company")
      .in("id", internshipIds);

    for (const internship of internships ?? []) {
      internshipMap.set(internship.id, {
        title: internship.title,
        company: internship.company,
      });
    }
  }

  const userIdsNeedingProfile = [
    ...new Set(
      applications
        .filter((app) => app.user_id && (!app.email || !app.student_name))
        .map((app) => app.user_id as string)
    ),
  ];

  const profileMap = new Map<string, { full_name?: string; email?: string }>();

  if (userIdsNeedingProfile.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", userIdsNeedingProfile);

    for (const profile of profiles ?? []) {
      profileMap.set(profile.id, {
        full_name: profile.full_name ?? undefined,
        email: profile.email ?? undefined,
      });
    }
  }

  return applications.map((app) => {
    const profile = app.user_id ? profileMap.get(app.user_id) : undefined;

    return {
      ...app,
      student_name: app.student_name ?? profile?.full_name ?? null,
      email: app.email ?? profile?.email ?? null,
      internship: app.internship_id ? (internshipMap.get(app.internship_id) ?? null) : null,
    };
  });
}
