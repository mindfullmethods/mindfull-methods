import { isApplicationsStatusReady } from "@/lib/applications-schema";
import { isCertificatesTableReady } from "@/lib/certificates-schema";
import {
  isContactInquiriesTableReady,
  isContactInquiryAdminNotesReady,
  isContactInquiryStatusReady,
} from "@/lib/contact-inquiries-schema";
import { isCourseProgressTableReady } from "@/lib/course-progress-schema";
import { isEnrollmentsTableReady } from "@/lib/enrollments-schema";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { siteConfig } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";

export type SetupCheck = {
  id: string;
  label: string;
  ready: boolean;
  detail: string;
  action?: string;
};

export async function getPlatformSetupChecks(): Promise<SetupCheck[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;
  const customDomain = !siteUrl.includes("vercel.app");

  let serviceRoleReady = false;
  try {
    createAdminClient();
    serviceRoleReady = true;
  } catch {
    serviceRoleReady = false;
  }

  const [
    enrollmentsReady,
    applicationsReady,
    progressReady,
    inquiriesReady,
    inquiryStatusReady,
    inquiryNotesReady,
    certificatesReady,
  ] = await Promise.all([
    isEnrollmentsTableReady(),
    isApplicationsStatusReady(),
    isCourseProgressTableReady(),
    isContactInquiriesTableReady(),
    isContactInquiryStatusReady(),
    isContactInquiryAdminNotesReady(),
    isCertificatesTableReady(),
  ]);

  return [
    {
      id: "admin-emails",
      label: "Admin emails configured",
      ready: Boolean(process.env.ADMIN_EMAILS?.trim()),
      detail: process.env.ADMIN_EMAILS?.trim() || "Set ADMIN_EMAILS in .env.local / Vercel",
      action: "Add rajivshekar@mindfullmethods.com to ADMIN_EMAILS",
    },
    {
      id: "service-role",
      label: "Supabase service role key",
      ready: serviceRoleReady,
      detail: serviceRoleReady
        ? "Server can save applications, enrollments, and inquiries"
        : "Add SUPABASE_SERVICE_ROLE_KEY from Supabase → Settings → API",
    },
    {
      id: "resend",
      label: "Resend email (RESEND_API_KEY)",
      ready: Boolean(process.env.RESEND_API_KEY?.trim()),
      detail: process.env.RESEND_API_KEY
        ? "Contact and notification emails will send"
        : "Without this, emails are logged to the server console only",
      action: "Resend → API Keys → create key and add RESEND_API_KEY",
    },
    {
      id: "resend-from",
      label: "Send from your domain",
      ready: Boolean(
        process.env.CONTACT_FROM_EMAIL?.trim() &&
          process.env.CONTACT_FROM_EMAIL.includes("@mindfullmethods.com")
      ),
      detail: process.env.CONTACT_FROM_EMAIL?.includes("@mindfullmethods.com")
        ? `Sending from ${process.env.CONTACT_FROM_EMAIL}`
        : "Set CONTACT_FROM_EMAIL=rajivshekar@mindfullmethods.com (domain verified in Resend)",
    },
    {
      id: "contact-to",
      label: "Inbox for notifications",
      ready: Boolean(process.env.CONTACT_TO_EMAIL?.trim()),
      detail: process.env.CONTACT_TO_EMAIL ?? "Set CONTACT_TO_EMAIL=rajivshekar@mindfullmethods.com",
    },
    {
      id: "razorpay",
      label: "Razorpay payments",
      ready: isRazorpayConfigured(),
      detail: isRazorpayConfigured()
        ? "Pay & enroll is enabled on course pages"
        : "Courses show Contact to enroll until keys are added",
      action: "Add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET",
    },
    {
      id: "razorpay-webhook",
      label: "Razorpay webhook (production)",
      ready: Boolean(process.env.RAZORPAY_WEBHOOK_SECRET?.trim()),
      detail: process.env.RAZORPAY_WEBHOOK_SECRET
        ? "Backup payment confirmation when checkout closes early"
        : "Add after domain is live: payment.captured → /api/payments/razorpay/webhook",
      action: "Razorpay Dashboard → Webhooks → copy secret to RAZORPAY_WEBHOOK_SECRET",
    },
    {
      id: "domain",
      label: "Custom domain (attach when ready)",
      ready: customDomain,
      detail: customDomain
        ? siteUrl
        : `Using ${siteUrl} for now — attach mindfullmethods.com after final QA`,
      action: "Optional until launch: Vercel → Domains → DNS at registrar",
    },
    {
      id: "enrollments-table",
      label: "Enrollments table",
      ready: enrollmentsReady,
      detail: enrollmentsReady ? "My courses and payments ready" : "Run supabase/enrollments-schema.sql",
    },
    {
      id: "applications-status",
      label: "Applications status column",
      ready: applicationsReady,
      detail: applicationsReady ? "Admin can approve/reject applications" : "Run supabase/applications-status-only.sql",
    },
    {
      id: "progress-table",
      label: "Course progress table",
      ready: progressReady,
      detail: progressReady ? "Weekly milestones and certificates ready" : "Run supabase/course-progress-schema.sql",
    },
    {
      id: "inquiries-table",
      label: "Contact inquiries table",
      ready: inquiriesReady,
      detail: inquiriesReady ? "Contact forms saved to dashboard" : "Run supabase/contact-inquiries-schema.sql",
    },
    {
      id: "inquiry-status",
      label: "Inquiry status column",
      ready: inquiryStatusReady,
      detail: inquiryStatusReady ? "Track New → Contacted → Enrolled → Closed" : "Run supabase/contact-inquiries-status.sql",
    },
    {
      id: "inquiry-notes",
      label: "Inquiry admin notes",
      ready: inquiryNotesReady,
      detail: inquiryNotesReady ? "Save follow-up notes on inquiries" : "Run supabase/admin-dashboard-extensions.sql",
    },
    {
      id: "certificates-table",
      label: "Certificate verification",
      ready: certificatesReady,
      detail: certificatesReady ? "Public verify page + stored certificate IDs" : "Run supabase/certificates-schema.sql",
    },
  ];
}

export function getSetupProgress(checks: SetupCheck[]) {
  const ready = checks.filter((check) => check.ready).length;
  return { ready, total: checks.length, percent: Math.round((ready / checks.length) * 100) };
}
