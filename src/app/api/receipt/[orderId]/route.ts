import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth";
import { isAdminUser } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/lib/site";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return new NextResponse("Sign in required.", { status: 401 });
  }

  const { orderId } = await params;
  const admin = createAdminClient();
  const { data: enrollment } = await admin
    .from("enrollments")
    .select("*")
    .eq("razorpay_order_id", orderId)
    .maybeSingle();

  if (!enrollment) {
    return new NextResponse("Receipt not found.", { status: 404 });
  }

  const isOwner =
    (enrollment.user_id && enrollment.user_id === user.id) ||
    (enrollment.email && user.email && enrollment.email.toLowerCase() === user.email.toLowerCase());

  if (!isOwner && !isAdminUser(user)) {
    return new NextResponse("Forbidden.", { status: 403 });
  }

  const amount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: enrollment.currency ?? "INR",
  }).format((enrollment.amount_paise ?? 0) / 100);

  const date = enrollment.created_at
    ? new Date(enrollment.created_at).toLocaleString("en-IN")
    : new Date().toLocaleString("en-IN");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Receipt ${orderId}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 2rem auto; padding: 1rem; color: #18181b; }
    h1 { font-size: 1.5rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
    td { padding: 0.5rem 0; border-bottom: 1px solid #e4e4e7; }
    td:first-child { font-weight: 600; width: 40%; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <h1>${siteConfig.name}</h1>
  <p>Payment receipt</p>
  <table>
    <tr><td>Course</td><td>${enrollment.course_title}</td></tr>
    <tr><td>Amount</td><td>${amount}</td></tr>
    <tr><td>Order ID</td><td>${orderId}</td></tr>
    <tr><td>Payment ID</td><td>${enrollment.razorpay_payment_id ?? "—"}</td></tr>
    <tr><td>Date</td><td>${date}</td></tr>
    <tr><td>Status</td><td>${enrollment.status}</td></tr>
  </table>
  <p style="margin-top:2rem;font-size:0.875rem;color:#71717a;">Questions? ${siteConfig.supportEmail}</p>
  <button onclick="window.print()" style="margin-top:1rem;padding:0.5rem 1rem;border-radius:8px;border:none;background:#7c3aed;color:#fff;font-weight:700;cursor:pointer;">Print / Save as PDF</button>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
