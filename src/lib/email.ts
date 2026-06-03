import { Resend } from "resend";

import { siteConfig } from "@/lib/site";
import {
  shouldSendStudentEmail,
  type StudentEmailChannel,
} from "@/lib/student-email-prefs";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function adminEmail() {
  return process.env.CONTACT_TO_EMAIL ?? siteConfig.supportEmail;
}

function fromEmail() {
  return process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
}

export function renderEmailLayout(title: string, bodyHtml: string) {
  const siteUrl = siteConfig.url;
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;color:#18181b;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">
                <tr>
                  <td style="padding:24px 28px;background:#7c3aed;color:#ffffff;">
                    <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;opacity:0.85;">Mindfull Methods</p>
                    <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;">${escapeHtml(title)}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px;font-size:15px;line-height:1.7;">${bodyHtml}</td>
                </tr>
                <tr>
                  <td style="padding:0 28px 28px;font-size:12px;color:#71717a;">
                    <p style="margin:0;">Questions? Reply to this email or visit <a href="${siteUrl}" style="color:#7c3aed;">${escapeHtml(siteConfig.name)}</a>.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export async function sendEmail(params: {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — logging only.");
    console.info("[email]", params.subject, params.text);
    return { sent: false, mode: "log" as const };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: fromEmail(),
    to: params.to,
    replyTo: params.replyTo,
    subject: params.subject,
    text: params.text,
    html: params.html,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { sent: true, mode: "email" as const };
}

async function sendStudentEmail(
  studentEmail: string,
  channel: StudentEmailChannel,
  params: Parameters<typeof sendEmail>[0]
) {
  if (!(await shouldSendStudentEmail(studentEmail, channel))) {
    console.info(`[email] skipped ${channel} for ${studentEmail} (notification prefs)`);
    return { sent: false, mode: "skipped" as const };
  }
  return sendEmail(params);
}

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
};

export async function sendContactEmail(payload: ContactPayload) {
  const { getCourseBySlug } = await import("@/lib/courses");
  const interest =
    payload.interest === "general"
      ? "General guidance"
      : (getCourseBySlug(payload.interest)?.title ?? payload.interest);

  return sendEmail({
    to: adminEmail(),
    replyTo: payload.email,
    subject: `[Mindfull Methods] New inquiry — ${interest}`,
    text: [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.phone ? `Phone: ${payload.phone}` : null,
      `Interest: ${interest}`,
      "",
      "Message:",
      payload.message,
    ]
      .filter(Boolean)
      .join("\n"),
    html: renderEmailLayout(
      "New contact form submission",
      `
      <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      ${payload.phone ? `<p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>` : ""}
      <p><strong>Interest:</strong> ${escapeHtml(interest)}</p>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:20px 0;" />
      <p><strong>Message</strong></p>
      <p>${escapeHtml(payload.message).replace(/\n/g, "<br />")}</p>
    `
    ),
  });
}

export async function notifyApplicationSubmitted(payload: {
  studentName: string;
  studentEmail: string;
  internshipTitle: string;
  company?: string | null;
  resume?: string | null;
}) {
  const companyLine = payload.company ? ` at ${payload.company}` : "";
  const dashboardUrl = `${siteConfig.url}/dashboard/applications`;

  await Promise.all([
    sendEmail({
      to: adminEmail(),
      replyTo: payload.studentEmail,
      subject: `[Mindfull Methods] New internship application — ${payload.internshipTitle}`,
      text: [
        `Student: ${payload.studentName}`,
        `Email: ${payload.studentEmail}`,
        `Internship: ${payload.internshipTitle}${companyLine}`,
        payload.resume ? `Resume: ${payload.resume}` : null,
        "",
        `Review: ${dashboardUrl}`,
      ]
        .filter(Boolean)
        .join("\n"),
      html: renderEmailLayout(
        "New internship application",
        `
        <p><strong>Student:</strong> ${escapeHtml(payload.studentName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.studentEmail)}</p>
        <p><strong>Internship:</strong> ${escapeHtml(payload.internshipTitle)}${payload.company ? ` at ${escapeHtml(payload.company)}` : ""}</p>
        ${payload.resume ? `<p><strong>Resume:</strong> <a href="${escapeHtml(payload.resume)}">${escapeHtml(payload.resume)}</a></p>` : ""}
        <p><a href="${dashboardUrl}" style="color:#7c3aed;font-weight:700;">Open applications dashboard →</a></p>
      `
      ),
    }),
    sendStudentEmail(payload.studentEmail, "application", {
      to: payload.studentEmail,
      subject: `Application received — ${payload.internshipTitle}`,
      text: [
        `Hi ${payload.studentName},`,
        "",
        `We received your application for ${payload.internshipTitle}${companyLine}.`,
        "",
        "What happens next:",
        "1. Our team reviews your profile (usually within 3–5 business days).",
        "2. You'll get an email when your status changes to Approved or if we need more info.",
        "3. Track everything anytime in your dashboard.",
        "",
        `Track status: ${siteConfig.url}/dashboard/my-applications`,
        payload.resume ? `Resume on file: ${payload.resume}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      html: renderEmailLayout(
        "Application received",
        `
        <p>Hi ${escapeHtml(payload.studentName)},</p>
        <p>We received your application for <strong>${escapeHtml(payload.internshipTitle)}</strong>${payload.company ? ` at ${escapeHtml(payload.company)}` : ""}.</p>
        <p><strong>What happens next</strong></p>
        <ol style="padding-left:20px;line-height:1.8;">
          <li>Our team reviews your profile (usually within 3–5 business days).</li>
          <li>You'll get an email when your status changes or if we need more information.</li>
          <li>Track your application anytime in your dashboard.</li>
        </ol>
        ${payload.resume ? `<p><strong>Resume on file:</strong> <a href="${escapeHtml(payload.resume)}">${escapeHtml(payload.resume)}</a></p>` : ""}
        <p><a href="${siteConfig.url}/dashboard/my-applications" style="color:#7c3aed;font-weight:700;">View my applications →</a></p>
      `
      ),
    }),
  ]);
}

export async function notifyApplicationStatusChange(payload: {
  studentName: string;
  studentEmail: string;
  internshipTitle: string;
  company?: string | null;
  status: "Approved" | "Rejected";
}) {
  const companyLine = payload.company ? ` at ${payload.company}` : "";
  const dashboardUrl = `${siteConfig.url}/dashboard/my-applications`;
  const approved = payload.status === "Approved";

  const subject = approved
    ? `Application approved — ${payload.internshipTitle}`
    : `Application update — ${payload.internshipTitle}`;

  const headline = approved ? "Your application was approved" : "Application status update";
  const body = approved
    ? `Great news! Your application for ${payload.internshipTitle}${companyLine} has been approved. We'll share next steps soon.`
    : `Thank you for applying to ${payload.internshipTitle}${companyLine}. After review, we are unable to move forward with your application at this time.`;

  await sendStudentEmail(payload.studentEmail, "application", {
    to: payload.studentEmail,
    subject,
    text: [
      `Hi ${payload.studentName},`,
      "",
      body,
      "",
      `View status: ${dashboardUrl}`,
    ].join("\n"),
    html: renderEmailLayout(
      headline,
      `
      <p>Hi ${escapeHtml(payload.studentName)},</p>
      <p>${escapeHtml(body)}</p>
      <p><a href="${dashboardUrl}" style="color:#7c3aed;font-weight:700;">View my applications →</a></p>
    `
    ),
  });
}

export async function notifyEnrollmentCompleted(payload: {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  courseSlug: string;
  amountLabel: string;
  razorpayOrderId?: string;
}) {
  const courseUrl = `${siteConfig.url}/dashboard/my-courses/welcome?course=${payload.courseSlug}`;
  const trackUrl = `${siteConfig.url}/dashboard/my-courses/${payload.courseSlug}`;
  const myCoursesUrl = `${siteConfig.url}/dashboard/my-courses`;
  const adminUrl = `${siteConfig.url}/dashboard/enrollments`;
  const receiptUrl = payload.razorpayOrderId
    ? `${siteConfig.url}/api/receipt/${encodeURIComponent(payload.razorpayOrderId)}`
    : null;

  await Promise.all([
    sendEmail({
      to: adminEmail(),
      replyTo: payload.studentEmail,
      subject: `[Mindfull Methods] New course enrollment — ${payload.courseTitle}`,
      text: [
        `Student: ${payload.studentName}`,
        `Email: ${payload.studentEmail}`,
        `Course: ${payload.courseTitle}`,
        `Amount: ${payload.amountLabel}`,
        "",
        `View: ${adminUrl}`,
      ].join("\n"),
      html: renderEmailLayout(
        "New paid enrollment",
        `
        <p><strong>Student:</strong> ${escapeHtml(payload.studentName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.studentEmail)}</p>
        <p><strong>Course:</strong> ${escapeHtml(payload.courseTitle)}</p>
        <p><strong>Amount:</strong> ${escapeHtml(payload.amountLabel)}</p>
        <p><a href="${adminUrl}" style="color:#7c3aed;font-weight:700;">Open enrollments dashboard →</a></p>
      `
      ),
    }),
    payload.studentEmail.includes("@")
      ? sendStudentEmail(payload.studentEmail, "enrollment", {
          to: payload.studentEmail,
          subject: `Welcome to ${payload.courseTitle} — Mindfull Methods`,
          text: [
            `Hi ${payload.studentName},`,
            "",
            `Your payment for ${payload.courseTitle} (${payload.amountLabel}) is confirmed.`,
            "",
            ...(receiptUrl ? [`Receipt: ${receiptUrl}`, ""] : []),
            `Get started: ${courseUrl}`,
            `Track progress: ${trackUrl}`,
            `My courses: ${myCoursesUrl}`,
          ].join("\n"),
          html: renderEmailLayout(
            `Welcome to ${payload.courseTitle}`,
            `
        <p>Hi ${escapeHtml(payload.studentName)},</p>
        <p>Your payment for <strong>${escapeHtml(payload.courseTitle)}</strong> (${escapeHtml(payload.amountLabel)}) is confirmed. Welcome to Mindfull Methods!</p>
        ${receiptUrl ? `<p><a href="${receiptUrl}" style="color:#7c3aed;font-weight:700;">View payment receipt →</a></p>` : ""}
        <p><a href="${courseUrl}" style="color:#7c3aed;font-weight:700;">Start week 1 →</a></p>
        <p><a href="${trackUrl}" style="color:#7c3aed;">Track progress →</a></p>
        <p><a href="${myCoursesUrl}" style="color:#7c3aed;">Open my courses →</a></p>
      `
          ),
        })
      : Promise.resolve(),
  ]);
}

export async function notifyCourseCompleted(payload: {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  courseSlug: string;
  certificateId: string;
  verifyUrl: string;
}) {
  const certUrl = `${siteConfig.url}/dashboard/my-courses/${payload.courseSlug}/certificate`;
  const pdfUrl = `${siteConfig.url}/api/certificates/${encodeURIComponent(payload.certificateId)}/pdf`;

  await sendStudentEmail(payload.studentEmail, "certificate", {
    to: payload.studentEmail,
    subject: `Certificate ready — ${payload.courseTitle}`,
    text: [
      `Hi ${payload.studentName},`,
      "",
      `Congratulations! Your mentor approved your progress in ${payload.courseTitle}. Your certificate is ready to download.`,
      "",
      `View certificate: ${certUrl}`,
      `Download PDF: ${pdfUrl}`,
      `Verify online: ${payload.verifyUrl}`,
      "",
      `Certificate ID: ${payload.certificateId}`,
    ].join("\n"),
    html: renderEmailLayout(
      "Your certificate is ready",
      `
      <p>Hi ${escapeHtml(payload.studentName)},</p>
      <p>Your mentor approved your progress in <strong>${escapeHtml(payload.courseTitle)}</strong>. Your certificate is ready.</p>
      <p><a href="${certUrl}" style="color:#7c3aed;font-weight:700;">View certificate →</a></p>
      <p><a href="${pdfUrl}" style="color:#7c3aed;font-weight:700;">Download PDF →</a></p>
      <p><a href="${payload.verifyUrl}" style="color:#7c3aed;">Verify certificate online →</a></p>
      <p><strong>Certificate ID:</strong> ${escapeHtml(payload.certificateId)}</p>
    `
    ),
  });
}

export async function notifyProgressReminder(payload: {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  courseSlug: string;
  percent: number;
  kind: "start" | "continue";
}) {
  const trackUrl = `${siteConfig.url}/dashboard/my-courses/${payload.courseSlug}`;
  const welcomeUrl = `${siteConfig.url}/dashboard/my-courses/welcome?course=${payload.courseSlug}`;

  const subject =
    payload.kind === "start"
      ? `Ready to start ${payload.courseTitle}?`
      : `Continue ${payload.courseTitle} — you're ${payload.percent}% done`;

  const body =
    payload.kind === "start"
      ? `You enrolled in ${payload.courseTitle} a few days ago. Week 1 is waiting — open your course and check off your first milestone when you're ready.`
      : `You're ${payload.percent}% through ${payload.courseTitle}. Pick up where you left off and keep building toward your certificate.`;

  const primaryUrl = payload.kind === "start" ? welcomeUrl : trackUrl;
  const cta = payload.kind === "start" ? "Start week 1" : "Continue learning";

  await sendStudentEmail(payload.studentEmail, "course_reminder", {
    to: payload.studentEmail,
    subject,
    text: [
      `Hi ${payload.studentName},`,
      "",
      body,
      "",
      `${cta}: ${primaryUrl}`,
      `My courses: ${siteConfig.url}/dashboard/my-courses`,
    ].join("\n"),
    html: renderEmailLayout(subject, `
      <p>Hi ${escapeHtml(payload.studentName)},</p>
      <p>${escapeHtml(body)}</p>
      <p><a href="${primaryUrl}" style="color:#7c3aed;font-weight:700;">${escapeHtml(cta)} →</a></p>
      <p><a href="${siteConfig.url}/dashboard/my-courses" style="color:#7c3aed;">Open my courses →</a></p>
    `),
  });
}

export async function notifyWaitlistJoined(payload: {
  email: string;
  fullName?: string | null;
  courseTitle: string;
  courseSlug: string;
}) {
  const name = payload.fullName?.trim() || payload.email.split("@")[0] || "there";
  const courseUrl = `${siteConfig.url}/courses/${payload.courseSlug}`;

  await sendEmail({
    to: payload.email,
    subject: `You're on the waitlist — ${payload.courseTitle}`,
    text: [
      `Hi ${name},`,
      "",
      `Thanks for joining the waitlist for ${payload.courseTitle}. We'll email you when enrollment opens.`,
      "",
      `Course page: ${courseUrl}`,
    ].join("\n"),
    html: renderEmailLayout(
      `Waitlist confirmed — ${payload.courseTitle}`,
      `
      <p>Hi ${escapeHtml(name)},</p>
      <p>You're on the waitlist for <strong>${escapeHtml(payload.courseTitle)}</strong>. We'll notify you when seats open.</p>
      <p><a href="${courseUrl}" style="color:#7c3aed;font-weight:700;">View course →</a></p>
    `
    ),
  });
}

export async function notifyWaitlistSeatsOpen(payload: {
  email: string;
  fullName?: string | null;
  courseTitle: string;
  courseSlug: string;
}) {
  const name = payload.fullName?.trim() || payload.email.split("@")[0] || "there";
  const enrollUrl = `${siteConfig.url}/courses/${payload.courseSlug}`;

  await sendEmail({
    to: payload.email,
    subject: `Seats open — ${payload.courseTitle}`,
    text: [
      `Hi ${name},`,
      "",
      `Enrollment is now open for ${payload.courseTitle}.`,
      "",
      `Enroll now: ${enrollUrl}`,
    ].join("\n"),
    html: renderEmailLayout(
      `Seats available — ${payload.courseTitle}`,
      `
      <p>Hi ${escapeHtml(name)},</p>
      <p>Good news — enrollment is open for <strong>${escapeHtml(payload.courseTitle)}</strong>.</p>
      <p><a href="${enrollUrl}" style="color:#7c3aed;font-weight:700;">Enroll now →</a></p>
    `
    ),
  });
}

export async function notifyAbandonedCheckout(payload: {
  studentEmail: string;
  courseTitle: string;
  courseSlug: string;
  amountLabel: string;
}) {
  const enrollUrl = `${siteConfig.url}/courses/${payload.courseSlug}`;

  await sendStudentEmail(payload.studentEmail, "enrollment", {
    to: payload.studentEmail,
    subject: `Complete your enrollment — ${payload.courseTitle}`,
    text: [
      `You started checkout for ${payload.courseTitle} (${payload.amountLabel}) but did not finish payment.`,
      "",
      `Resume here: ${enrollUrl}`,
    ].join("\n"),
    html: renderEmailLayout(
      "Complete your enrollment",
      `
      <p>You started enrolling in <strong>${escapeHtml(payload.courseTitle)}</strong> (${escapeHtml(payload.amountLabel)}) but did not complete payment.</p>
      <p><a href="${enrollUrl}" style="color:#7c3aed;font-weight:700;">Return to checkout →</a></p>
    `
    ),
  });
}

export async function notifyAdminDigest(payload: {
  pendingApplications: number;
  newInquiries: number;
  paidEnrollments: number;
  revenuePaise: number;
  setupPercent: number;
}) {
  const revenue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(payload.revenuePaise / 100);

  const dashboardUrl = `${siteConfig.url}/dashboard/admin-home`;

  return sendEmail({
    to: adminEmail(),
    subject: `[Mindfull Methods] Admin digest — ${new Date().toLocaleDateString("en-IN")}`,
    text: [
      "Mindfull Methods — daily admin summary",
      "",
      `Pending applications: ${payload.pendingApplications}`,
      `New inquiries: ${payload.newInquiries}`,
      `Paid enrollments: ${payload.paidEnrollments}`,
      `Revenue (paid): ${revenue}`,
      `Launch setup: ${payload.setupPercent}% complete`,
      "",
      `Open admin home: ${dashboardUrl}`,
    ].join("\n"),
    html: renderEmailLayout(
      "Admin digest",
      `
      <ul style="padding-left:20px;">
        <li><strong>Pending applications:</strong> ${payload.pendingApplications}</li>
        <li><strong>New inquiries:</strong> ${payload.newInquiries}</li>
        <li><strong>Paid enrollments:</strong> ${payload.paidEnrollments}</li>
        <li><strong>Revenue (paid):</strong> ${escapeHtml(revenue)}</li>
        <li><strong>Launch setup:</strong> ${payload.setupPercent}% complete</li>
      </ul>
      <p><a href="${dashboardUrl}" style="color:#7c3aed;font-weight:700;">Open admin home →</a></p>
    `
    ),
  });
}

export async function notifyInquiryStatusChange(payload: {
  name: string;
  email: string;
  interest: string;
  status: string;
}) {
  if (!payload.email.includes("@")) return;

  const inquiriesUrl = `${siteConfig.url}/contact`;
  const dashboardUrl = `${siteConfig.url}/dashboard/inquiries`;

  const statusMessages: Record<string, string> = {
    Contacted: "We've reviewed your inquiry and will follow up with next steps soon.",
    Enrolled: "Great news — you're enrolled! Check your dashboard for course access and week-one guidance.",
    Closed: "We've closed this inquiry for now. You're welcome to reach out again anytime.",
  };

  const body =
    statusMessages[payload.status] ??
    `Your inquiry status is now: ${payload.status}. We'll keep you posted on next steps.`;

  await Promise.all([
    sendStudentEmail(payload.email, "inquiry", {
      to: payload.email,
      subject: `Update on your Mindfull Methods inquiry`,
      text: [
        `Hi ${payload.name},`,
        "",
        body,
        "",
        `Interest: ${payload.interest}`,
        "",
        `Questions: ${inquiriesUrl}`,
      ].join("\n"),
      html: renderEmailLayout(
        "Inquiry update",
        `
        <p>Hi ${escapeHtml(payload.name)},</p>
        <p>${escapeHtml(body)}</p>
        <p><strong>Interest:</strong> ${escapeHtml(payload.interest)}</p>
        <p><a href="${inquiriesUrl}" style="color:#7c3aed;font-weight:700;">Contact us →</a></p>
      `
      ),
    }),
    sendEmail({
      to: adminEmail(),
      subject: `[Mindfull Methods] Inquiry status → ${payload.status}`,
      text: [
        `Inquiry from ${payload.name} (${payload.email})`,
        `Interest: ${payload.interest}`,
        `New status: ${payload.status}`,
        "",
        `Review: ${dashboardUrl}`,
      ].join("\n"),
      html: renderEmailLayout(
        "Inquiry status updated",
        `
        <p><strong>Contact:</strong> ${escapeHtml(payload.name)} (${escapeHtml(payload.email)})</p>
        <p><strong>Interest:</strong> ${escapeHtml(payload.interest)}</p>
        <p><strong>Status:</strong> ${escapeHtml(payload.status)}</p>
        <p><a href="${dashboardUrl}" style="color:#7c3aed;font-weight:700;">Open inquiries →</a></p>
      `
      ),
    }),
  ]);
}

export async function notifyPaymentFailed(payload: {
  customerEmail: string;
  courseTitle: string;
  courseSlug: string;
  reason: string;
}) {
  const courseUrl = `${siteConfig.url}/courses/${payload.courseSlug}`;
  const enrollmentsUrl = `${siteConfig.url}/dashboard/enrollments`;

  await Promise.all([
    sendStudentEmail(payload.customerEmail, "enrollment", {
      to: payload.customerEmail,
      subject: `Payment not completed — ${payload.courseTitle}`,
      text: [
        `Hi,`,
        "",
        `Your payment for ${payload.courseTitle} did not go through.`,
        `Reason: ${payload.reason}`,
        "",
        `You can try again here: ${courseUrl}`,
        "",
        `If you were charged, reply to this email and we'll help.`,
      ].join("\n"),
      html: renderEmailLayout(
        "Payment not completed",
        `
        <p>Your payment for <strong>${escapeHtml(payload.courseTitle)}</strong> did not go through.</p>
        <p><strong>Details:</strong> ${escapeHtml(payload.reason)}</p>
        <p>You can return to the course page and try checkout again.</p>
        <p><a href="${courseUrl}" style="color:#7c3aed;font-weight:700;">Try again →</a></p>
        <p style="font-size:13px;color:#71717a;">If money was deducted, reply to this email and we'll resolve it promptly.</p>
      `
      ),
    }),
    sendEmail({
      to: adminEmail(),
      replyTo: payload.customerEmail,
      subject: `[Mindfull Methods] Payment failed — ${payload.courseTitle}`,
      text: [
        `Email: ${payload.customerEmail}`,
        `Course: ${payload.courseTitle}`,
        `Reason: ${payload.reason}`,
        "",
        enrollmentsUrl,
      ].join("\n"),
      html: renderEmailLayout(
        "Payment failed",
        `
        <p><strong>Email:</strong> ${escapeHtml(payload.customerEmail)}</p>
        <p><strong>Course:</strong> ${escapeHtml(payload.courseTitle)}</p>
        <p><strong>Reason:</strong> ${escapeHtml(payload.reason)}</p>
        <p><a href="${enrollmentsUrl}" style="color:#7c3aed;font-weight:700;">Open enrollments →</a></p>
      `
      ),
    }),
  ]);
}

export async function notifyCertificateRejected(payload: {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  courseSlug: string;
  notes?: string | null;
}) {
  const trackUrl = `${siteConfig.url}/dashboard/my-courses/${payload.courseSlug}`;
  const contactUrl = `${siteConfig.url}/contact`;

  await sendStudentEmail(payload.studentEmail, "certificate", {
    to: payload.studentEmail,
    subject: `Certificate review update — ${payload.courseTitle}`,
    text: [
      `Hi ${payload.studentName},`,
      "",
      `After reviewing your progress in ${payload.courseTitle}, we need a bit more work before we can issue your certificate.`,
      payload.notes ? `\nMentor notes: ${payload.notes}` : "",
      "",
      `Return to your course: ${trackUrl}`,
      `Questions: ${contactUrl}`,
    ]
      .filter(Boolean)
      .join("\n"),
    html: renderEmailLayout(
      "Certificate review update",
      `
      <p>Hi ${escapeHtml(payload.studentName)},</p>
      <p>After reviewing your progress in <strong>${escapeHtml(payload.courseTitle)}</strong>, we need a bit more work before we can issue your certificate.</p>
      ${payload.notes ? `<p><strong>Mentor notes:</strong> ${escapeHtml(payload.notes)}</p>` : ""}
      <p>Complete any remaining milestones and reach out if you have questions.</p>
      <p><a href="${trackUrl}" style="color:#7c3aed;font-weight:700;">Return to course progress →</a></p>
      <p><a href="${contactUrl}" style="color:#7c3aed;">Contact support →</a></p>
    `
    ),
  });
}

export async function notifyCompletionPendingReview(payload: {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  courseSlug: string;
  userId?: string;
}) {
  const trackUrl = `${siteConfig.url}/dashboard/my-courses/${payload.courseSlug}`;
  const adminReviewUrl = payload.userId
    ? `${siteConfig.url}/dashboard/users/${payload.userId}`
    : `${siteConfig.url}/dashboard/analytics`;

  await Promise.all([
    sendStudentEmail(payload.studentEmail, "certificate", {
      to: payload.studentEmail,
      subject: `All milestones complete — ${payload.courseTitle}`,
      text: [
        `Hi ${payload.studentName},`,
        "",
        `You've completed every week in ${payload.courseTitle}. A mentor will review your progress and release your certificate shortly.`,
        "",
        `Track status: ${trackUrl}`,
      ].join("\n"),
      html: renderEmailLayout(
        "Milestone review pending",
        `
        <p>Hi ${escapeHtml(payload.studentName)},</p>
        <p>You've completed every week in <strong>${escapeHtml(payload.courseTitle)}</strong>.</p>
        <p>A mentor will review your progress and release your certificate shortly — usually within 1–2 business days.</p>
        <p><a href="${trackUrl}" style="color:#7c3aed;font-weight:700;">View course progress →</a></p>
      `
      ),
    }),
    sendEmail({
      to: adminEmail(),
      subject: `[Mindfull Methods] Certificate review — ${payload.courseTitle}`,
      text: [
        `Student: ${payload.studentName}`,
        `Email: ${payload.studentEmail}`,
        `Course: ${payload.courseTitle}`,
        "",
        `Approve from analytics or student profile: ${adminReviewUrl}`,
      ].join("\n"),
      html: renderEmailLayout(
        "Certificate review needed",
        `
        <p><strong>Student:</strong> ${escapeHtml(payload.studentName)} (${escapeHtml(payload.studentEmail)})</p>
        <p><strong>Course:</strong> ${escapeHtml(payload.courseTitle)}</p>
        <p>All milestones are complete. Approve to issue the certificate.</p>
        <p><a href="${adminReviewUrl}" style="color:#7c3aed;font-weight:700;">Open admin dashboard →</a></p>
      `
      ),
    }),
  ]);
}
