import { getAdminAnalytics } from "@/Services/admin-analytics";
import { getAllEnrollments } from "@/Services/admin-enrollments";
import { getApplications } from "@/Services/getApplications";
import { getContactInquiries } from "@/Services/contact-inquiries";
import { getPlatformSetupChecks, getSetupProgress } from "@/lib/platform-setup";

export type AdminHomeSummary = {
  setup: { ready: number; total: number; percent: number };
  checks: Awaited<ReturnType<typeof getPlatformSetupChecks>>;
  analytics: Awaited<ReturnType<typeof getAdminAnalytics>>;
  recentApplications: Awaited<ReturnType<typeof getApplications>>;
  recentInquiries: Awaited<ReturnType<typeof getContactInquiries>>;
  recentEnrollments: Awaited<ReturnType<typeof getAllEnrollments>>;
  newInquiriesCount: number;
  pendingApplicationsCount: number;
};

export async function getAdminHomeSummary(): Promise<AdminHomeSummary> {
  const [checks, analytics, applications, inquiries, enrollments] = await Promise.all([
    getPlatformSetupChecks(),
    getAdminAnalytics(),
    getApplications(),
    getContactInquiries(),
    getAllEnrollments(),
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
  };
}
