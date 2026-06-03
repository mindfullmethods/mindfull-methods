import { getAdminAnalytics } from "@/Services/admin-analytics";
import { getAllEnrollments } from "@/Services/admin-enrollments";
import { getApplications } from "@/Services/getApplications";
import { getContactInquiries } from "@/Services/contact-inquiries";
import { getPendingCompletionVerifications } from "@/Services/completion-verifications";
import { getCourseBySlug } from "@/lib/courses";
import { getPlatformSetupChecks, getSetupProgress } from "@/lib/platform-setup";

export type PendingCertificateReview = {
  userId: string;
  courseSlug: string;
  courseTitle: string;
  requestedAt: string;
};

export type AdminHomeSummary = {
  setup: { ready: number; total: number; percent: number };
  checks: Awaited<ReturnType<typeof getPlatformSetupChecks>>;
  analytics: Awaited<ReturnType<typeof getAdminAnalytics>>;
  recentApplications: Awaited<ReturnType<typeof getApplications>>;
  recentInquiries: Awaited<ReturnType<typeof getContactInquiries>>;
  recentEnrollments: Awaited<ReturnType<typeof getAllEnrollments>>;
  newInquiriesCount: number;
  pendingApplicationsCount: number;
  pendingCertificateReviews: PendingCertificateReview[];
};

export async function getAdminHomeSummary(): Promise<AdminHomeSummary> {
  const [checks, analytics, applications, inquiries, enrollments, pendingReviews] = await Promise.all([
    getPlatformSetupChecks(),
    getAdminAnalytics(),
    getApplications(),
    getContactInquiries(),
    getAllEnrollments(),
    getPendingCompletionVerifications(),
  ]);

  const setup = getSetupProgress(checks);
  const newInquiriesCount = inquiries.filter((i) => (i.status ?? "New") === "New").length;
  const pendingApplicationsCount = applications.filter((a) => {
    const s = a.status ?? "Pending";
    return s === "Pending" || s === "Submitted";
  }).length;

  return {
    setup,
    checks,
    analytics,
    recentApplications: applications.slice(0, 5),
    recentInquiries: inquiries.slice(0, 5),
    recentEnrollments: enrollments.slice(0, 5),
    newInquiriesCount,
    pendingApplicationsCount,
    pendingCertificateReviews: pendingReviews.map((row) => ({
      userId: row.user_id,
      courseSlug: row.course_slug,
      courseTitle: getCourseBySlug(row.course_slug)?.title ?? row.course_slug,
      requestedAt: row.requested_at,
    })),
  };
}
