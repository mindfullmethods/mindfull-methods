import { createAdminClient } from "@/lib/supabase/admin";
import { getApplications } from "@/Services/getApplications";
import { getAllEnrollments } from "@/Services/admin-enrollments";
import { getContactInquiries } from "@/Services/contact-inquiries";
import { getPendingCompletionVerifications } from "@/Services/completion-verifications";
import { getCourseBySlug } from "@/lib/courses";

export type ChartPoint = { name: string; value: number };

export type AdminAnalytics = {
  totals: {
    applications: number;
    enrollments: number;
    paidEnrollments: number;
    revenuePaise: number;
    pendingApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    inquiries: number;
    newInquiries: number;
    certificatesIssued: number;
    pendingCertificateReviews: number;
    inquiryToEnrollmentRate: number;
  };
  applicationsByDay: ChartPoint[];
  enrollmentsByDay: ChartPoint[];
  revenueByDay: ChartPoint[];
  applicationStatuses: { label: string; value: number }[];
  enrollmentsByCourse: { label: string; value: number; revenuePaise: number }[];
  revenueByCourse: { label: string; value: number }[];
  pendingReviews: {
    userId: string;
    courseSlug: string;
    courseTitle: string;
    requestedAt: string;
  }[];
};

function lastNDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (n - 1 - i));
    const key = date.toISOString().slice(0, 10);
    const name = date.toLocaleDateString("en-IN", { weekday: "short" });
    return { key, name };
  });
}

function bucketByDay(
  items: { created_at?: string | null }[],
  days = 7,
  valueFn?: (item: { created_at?: string | null }) => number
): ChartPoint[] {
  const labels = lastNDays(days);
  const counts = new Map(labels.map((d) => [d.key, 0]));

  for (const item of items) {
    if (!item.created_at) continue;
    const key = item.created_at.slice(0, 10);
    if (counts.has(key)) {
      counts.set(key, (counts.get(key) ?? 0) + (valueFn ? valueFn(item) : 1));
    }
  }

  return labels.map((d) => ({ name: d.name, value: counts.get(d.key) ?? 0 }));
}

function countStatus(applications: { status?: string | null }[], status: string) {
  return applications.filter((a) => (a.status ?? "Pending") === status).length;
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  let certificatesIssued = 0;
  try {
    const admin = createAdminClient();
    const { count } = await admin.from("course_certificates").select("*", { count: "exact", head: true });
    certificatesIssued = count ?? 0;
  } catch {
    certificatesIssued = 0;
  }

  const [applications, enrollments, inquiries, pendingReviews] = await Promise.all([
    getApplications(),
    getAllEnrollments(),
    getContactInquiries(),
    getPendingCompletionVerifications(),
  ]);

  const paid = enrollments.filter((e) => e.status === "paid");
  const revenuePaise = paid.reduce((sum, e) => sum + e.amount_paise, 0);

  const statusCounts = [
    { label: "Pending", value: countStatus(applications, "Pending") + countStatus(applications, "Submitted") },
    { label: "Approved", value: countStatus(applications, "Approved") },
    { label: "Rejected", value: countStatus(applications, "Rejected") },
  ];

  const courseMap = new Map<string, { count: number; revenuePaise: number }>();
  for (const enrollment of paid) {
    const current = courseMap.get(enrollment.course_slug) ?? { count: 0, revenuePaise: 0 };
    courseMap.set(enrollment.course_slug, {
      count: current.count + 1,
      revenuePaise: current.revenuePaise + enrollment.amount_paise,
    });
  }

  const enrollmentsByCourse = [...courseMap.entries()]
    .map(([slug, stats]) => ({
      label: getCourseBySlug(slug)?.title ?? slug,
      value: stats.count,
      revenuePaise: stats.revenuePaise,
    }))
    .sort((a, b) => b.value - a.value);

  const revenueByCourse = enrollmentsByCourse.map((row) => ({
    label: row.label,
    value: Math.round(row.revenuePaise / 100),
  }));

  const newInquiries = inquiries.filter((i) => (i.status ?? "New") === "New").length;
  const enrolledInquiries = inquiries.filter((i) => i.status === "Enrolled").length;
  const inquiryToEnrollmentRate =
    inquiries.length > 0 ? Math.round((enrolledInquiries / inquiries.length) * 100) : 0;

  return {
    totals: {
      applications: applications.length,
      enrollments: enrollments.length,
      paidEnrollments: paid.length,
      revenuePaise,
      pendingApplications: statusCounts[0].value,
      approvedApplications: statusCounts[1].value,
      rejectedApplications: statusCounts[2].value,
      inquiries: inquiries.length,
      newInquiries,
      certificatesIssued,
      pendingCertificateReviews: pendingReviews.length,
      inquiryToEnrollmentRate,
    },
    applicationsByDay: bucketByDay(applications),
    enrollmentsByDay: bucketByDay(enrollments),
    revenueByDay: bucketByDay(
      paid.map((e) => ({ created_at: e.created_at, amount_paise: e.amount_paise })),
      7,
      (item) => Math.round(((item as { amount_paise?: number }).amount_paise ?? 0) / 100)
    ),
    applicationStatuses: statusCounts,
    enrollmentsByCourse,
    revenueByCourse,
    pendingReviews: pendingReviews.map((row) => ({
      userId: row.user_id,
      courseSlug: row.course_slug,
      courseTitle: getCourseBySlug(row.course_slug)?.title ?? row.course_slug,
      requestedAt: row.requested_at,
    })),
  };
}

export async function getStudentApplicationChart(userId: string): Promise<ChartPoint[]> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("applications")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return bucketByDay(data ?? []);
  } catch {
    return bucketByDay([]);
  }
}

export function getOverallCourseProgressPercent(summaries: { percent: number }[]): number {
  if (!summaries.length) return 0;
  const sum = summaries.reduce((acc, s) => acc + s.percent, 0);
  return Math.round(sum / summaries.length);
}
