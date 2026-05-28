import { Resend } from "resend";

import { siteConfig } from "@/lib/site";

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

async function sendEmail(params: {
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
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      ${payload.phone ? `<p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>` : ""}
      <p><strong>Interest:</strong> ${escapeHtml(interest)}</p>
      <hr />
      <p><strong>Message</strong></p>
      <p>${escapeHtml(payload.message).replace(/\n/g, "<br />")}</p>
    `,
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
      html: `
        <h2>New internship application</h2>
        <p><strong>Student:</strong> ${escapeHtml(payload.studentName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.studentEmail)}</p>
        <p><strong>Internship:</strong> ${escapeHtml(payload.internshipTitle)}${payload.company ? ` at ${escapeHtml(payload.company)}` : ""}</p>
        ${payload.resume ? `<p><strong>Resume:</strong> <a href="${escapeHtml(payload.resume)}">${escapeHtml(payload.resume)}</a></p>` : ""}
        <p><a href="${dashboardUrl}">Open applications dashboard →</a></p>
      `,
    }),
    sendEmail({
      to: payload.studentEmail,
      subject: `Application received — ${payload.internshipTitle}`,
      text: [
        `Hi ${payload.studentName},`,
        "",
        `We received your application for ${payload.internshipTitle}${companyLine}.`,
        "We'll review it and update the status in your dashboard.",
        "",
        `Track status: ${siteConfig.url}/dashboard/my-applications`,
      ].join("\n"),
      html: `
        <p>Hi ${escapeHtml(payload.studentName)},</p>
        <p>We received your application for <strong>${escapeHtml(payload.internshipTitle)}</strong>${payload.company ? ` at ${escapeHtml(payload.company)}` : ""}.</p>
        <p>We'll review it and update the status in your dashboard.</p>
        <p><a href="${siteConfig.url}/dashboard/my-applications">View my applications →</a></p>
      `,
    }),
  ]);
}

export async function notifyEnrollmentCompleted(payload: {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  courseSlug: string;
  amountLabel: string;
}) {
  const courseUrl = `${siteConfig.url}/courses/${payload.courseSlug}`;
  const myCoursesUrl = `${siteConfig.url}/dashboard/my-courses`;
  const adminUrl = `${siteConfig.url}/dashboard/enrollments`;

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
      html: `
        <h2>New paid enrollment</h2>
        <p><strong>Student:</strong> ${escapeHtml(payload.studentName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.studentEmail)}</p>
        <p><strong>Course:</strong> ${escapeHtml(payload.courseTitle)}</p>
        <p><strong>Amount:</strong> ${escapeHtml(payload.amountLabel)}</p>
        <p><a href="${adminUrl}">Open enrollments dashboard →</a></p>
      `,
    }),
    payload.studentEmail.includes("@")
      ? sendEmail({
          to: payload.studentEmail,
          subject: `Welcome to ${payload.courseTitle} — Mindfull Methods`,
          text: [
            `Hi ${payload.studentName},`,
            "",
            `Your payment for ${payload.courseTitle} (${payload.amountLabel}) is confirmed.`,
            "",
            `Course: ${courseUrl}`,
            `My courses: ${myCoursesUrl}`,
          ].join("\n"),
          html: `
        <p>Hi ${escapeHtml(payload.studentName)},</p>
        <p>Your payment for <strong>${escapeHtml(payload.courseTitle)}</strong> (${escapeHtml(payload.amountLabel)}) is confirmed. Welcome to Mindfull Methods!</p>
        <p><a href="${courseUrl}">View course →</a></p>
        <p><a href="${myCoursesUrl}">Open my courses →</a></p>
      `,
        })
      : Promise.resolve(),
  ]);
}
