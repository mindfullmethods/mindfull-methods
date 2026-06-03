import { createAdminClient } from "@/lib/supabase/admin";
import { getCourseBySlug } from "@/lib/courses";

export type MyWaitlistEntry = {
  id: string;
  courseSlug: string;
  courseTitle: string;
  createdAt: string;
};

export async function getMyWaitlistEntries(email: string | undefined | null): Promise<MyWaitlistEntry[]> {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return [];

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("course_waitlist")
      .select("id, course_slug, created_at")
      .eq("email", normalized)
      .order("created_at", { ascending: false });

    if (error) return [];

    return (data ?? []).map((row) => ({
      id: row.id as string,
      courseSlug: row.course_slug as string,
      courseTitle: getCourseBySlug(row.course_slug as string)?.title ?? (row.course_slug as string),
      createdAt: row.created_at as string,
    }));
  } catch {
    return [];
  }
}
