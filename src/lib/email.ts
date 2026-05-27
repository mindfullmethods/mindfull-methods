import { Resend } from "resend";

import { getCourseBySlug } from "@/lib/courses";
import { siteConfig } from "@/lib/site";

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
};

function interestLabel(interest: string) {
  if (interest === "general") return "General guidance";
  const course = getCourseBySlug(interest);
  return course?.title ?? interest;
}

export async function sendContactEmail(payload: ContactPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? siteConfig.supportEmail;
  const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY not set — logging submission only.");
    console.info("[contact]", payload);
    return { sent: false, mode: "log" as const };
  }

  const resend = new Resend(apiKey);
  const interest = interestLabel(payload.interest);

  const { error } = await resend.emails.send({
    from,
    to,
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

  if (error) {
    throw new Error(error.message);
  }

  return { sent: true, mode: "email" as const };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
