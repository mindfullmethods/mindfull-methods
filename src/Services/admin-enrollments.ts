import { createAdminClient } from "@/lib/supabase/admin";
import { getCourseBySlug } from "@/lib/courses";

export type AdminEnrollment = {
  id: string;
  user_id: string | null;
  course_slug: string;
  course_title: string;
  amount_paise: number;
  currency: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  email: string | null;
  status: string;
  created_at: string;
  student_name?: string | null;
};

export async function getAllEnrollments(): Promise<AdminEnrollment[]> {
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return [];
  }

  const { data, error } = await admin
    .from("enrollments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAllEnrollments]", error.message, error.code);
    return [];
  }

  if (!data?.length) return [];

  const userIds = [...new Set(data.map((row) => row.user_id).filter(Boolean))] as string[];
  const profileMap = new Map<string, { full_name?: string; email?: string }>();

  if (userIds.length > 0) {
    const { data: profiles } = await admin.from("profiles").select("id, full_name, email").in("id", userIds);

    for (const profile of profiles ?? []) {
      profileMap.set(profile.id, {
        full_name: profile.full_name ?? undefined,
        email: profile.email ?? undefined,
      });
    }
  }

  return data.map((row) => {
    const profile = row.user_id ? profileMap.get(row.user_id) : undefined;
    const course = getCourseBySlug(row.course_slug);

    return {
      ...row,
      course_title: course?.title ?? row.course_title,
      email: row.email ?? profile?.email ?? null,
      student_name: profile?.full_name ?? null,
    };
  });
}

export async function getEnrollmentStats() {
  const enrollments = await getAllEnrollments();
  const paid = enrollments.filter((e) => e.status === "paid");
  const revenue = paid.reduce((sum, e) => sum + e.amount_paise, 0);

  return {
    total: enrollments.length,
    paid: paid.length,
    revenuePaise: revenue,
  };
}
