import { createClient } from "@/lib/supabase/server";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseImage } from "@/lib/images";
import { isSupabaseSchemaError } from "@/lib/enrollments-schema";

export type MyEnrollment = {
  id: string;
  course_slug: string;
  course_title: string;
  amount_paise: number;
  status: string;
  created_at: string;
  course?: {
    slug: string;
    title: string;
    shortDescription: string;
    duration: string;
    level: string;
    imageUrl: string;
    priceLabel: string;
  } | null;
};

export async function getMyEnrollments(): Promise<MyEnrollment[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("enrollments")
    .select("id, course_slug, course_title, amount_paise, status, created_at")
    .eq("user_id", user.id)
    .eq("status", "paid")
    .order("created_at", { ascending: false });

  if (error) {
    if (!isSupabaseSchemaError(error.message)) {
      console.error("[getMyEnrollments]", error.message, error.code);
    }
    return [];
  }

  return (data ?? []).map((row) => {
    const course = getCourseBySlug(row.course_slug);

    return {
      ...row,
      course: course
        ? {
            slug: course.slug,
            title: course.title,
            shortDescription: course.shortDescription,
            duration: course.duration,
            level: course.level,
            imageUrl: course.imageUrl || getCourseImage(course.slug),
            priceLabel: course.priceLabel,
          }
        : null,
    };
  });
}
