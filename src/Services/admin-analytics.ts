import { createAdminClient } from "@/lib/supabase/admin";
import { getApplications } from "@/Services/getApplications";
import { getAllEnrollments } from "@/Services/admin-enrollments";

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
  };
  applicationsByDay: ChartPoint[];
  enrollmentsByDay: ChartPoint[];
  applicationStatuses: { label: string; value: number }[];
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

function bucketByDay(items: { created_at?: string | null }[], days = 7): ChartPoint[] {
  const labels = lastNDays(days);
  const counts = new Map(labels.map((d) => [d.key, 0]));

  for (const item of items) {
    if (!item.created_at) continue;
    const key = item.created_at.slice(0, 10);
    if (counts.has(key)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return labels.map((d) => ({ name: d.name, value: counts.get(d.key) ?? 0 }));
}

function countStatus(applications: { status?: string | null }[], status: string) {
  return applications.filter((a) => (a.status ?? "Pending") === status).length;
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  const [applications, enrollments] = await Promise.all([getApplications(), getAllEnrollments()]);

  const paid = enrollments.filter((e) => e.status === "paid");
  const revenuePaise = paid.reduce((sum, e) => sum + e.amount_paise, 0);

  const statusCounts = [
    { label: "Pending", value: countStatus(applications, "Pending") + countStatus(applications, "Submitted") },
    { label: "Approved", value: countStatus(applications, "Approved") },
    { label: "Rejected", value: countStatus(applications, "Rejected") },
  ];

  return {
    totals: {
      applications: applications.length,
      enrollments: enrollments.length,
      paidEnrollments: paid.length,
      revenuePaise,
      pendingApplications: statusCounts[0].value,
      approvedApplications: statusCounts[1].value,
      rejectedApplications: statusCounts[2].value,
    },
    applicationsByDay: bucketByDay(applications),
    enrollmentsByDay: bucketByDay(enrollments),
    applicationStatuses: statusCounts,
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

export function getOverallCourseProgressPercent(
  summaries: { percent: number }[]
): number {
  if (!summaries.length) return 0;
  const sum = summaries.reduce((acc, s) => acc + s.percent, 0);
  return Math.round(sum / summaries.length);
}
