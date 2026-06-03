# Mindfull Methods — Production setup

Step-by-step guide for domain, email, payments, and deployment.

---

## 1. Custom domain (mindfullmethods.com)

### Vercel
1. Open [Vercel Dashboard](https://vercel.com) → your project → **Settings** → **Domains**
2. Add `mindfullmethods.com` and `www.mindfullmethods.com`
3. Copy the DNS records Vercel shows (usually):
   - **A record** `@` → `76.76.21.21`
   - **CNAME** `www` → `cname.vercel-dns.com`

### Domain registrar (GoDaddy, Namecheap, etc.)
1. Open DNS settings for your domain
2. Add the records from Vercel
3. Wait 5–60 minutes for propagation

### After domain is live
1. Set in **Vercel → Environment Variables**:
   ```
   NEXT_PUBLIC_SITE_URL=https://mindfullmethods.com
   ```
2. **Redeploy** the project

---

## 2. Resend (verified email)

1. Sign up at [resend.com](https://resend.com)
2. **Domains** → Add `mindfullmethods.com`
3. Add the DNS records Resend provides (SPF, DKIM)
4. Wait for verification ✓
5. Set Vercel env vars:
   ```
   RESEND_API_KEY=re_...
   CONTACT_TO_EMAIL=support@mindfullmethods.com
   CONTACT_FROM_EMAIL=hello@mindfullmethods.com
   ```
6. Redeploy and test `/contact`

### Email notifications (applications & enrollments)
Uses the same Resend keys. When configured, the system sends:
- **Admin alert** on new internship applications and course payments
- **Student confirmation** on apply and successful enrollment

If `RESEND_API_KEY` is missing, notifications are logged to the server console only.

---

## 3. Brand images

Replace files in `public/images/` (same filenames):

| Path | Used for |
|------|----------|
| `marketing/hero.jpg` | Home hero |
| `marketing/auth-collaboration.jpg` | Login panel |
| `marketing/auth-dashboard.jpg` | Signup panel |
| `marketing/dashboard-preview.jpg` | Dashboard sidebar |
| `courses/*.jpg` | Course cards (one per slug) |

Recommended size: **1200×800** JPG or WebP.

---

## 4. Syllabus PDFs

- **Printable page:** `/courses/[slug]/syllabus` → browser **Print → Save as PDF**
- **Text download:** `/api/syllabus/[slug]`
- **Real PDFs:** drop files in `public/syllabi/[slug].pdf` (e.g. `generative-ai-llms.pdf`) or run `npm run syllabi:generate` — **Download PDF** appears on course pages

---

## 5. Razorpay payments

1. Create account at [razorpay.com](https://razorpay.com)
2. **Settings → API Keys** → generate Test keys (then Live for production)
3. Add to Vercel:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   ```
4. On course pages, click **Pay & enroll** to test checkout
5. After payment, user is redirected to signup with course pre-selected

### Webhook (production)
- Razorpay Dashboard → Webhooks → `https://mindfullmethods.com/api/payments/razorpay/webhook`
- Event: `payment.captured`
- Copy webhook secret to Vercel: `RAZORPAY_WEBHOOK_SECRET`

### Enrollments table
Run `supabase/enrollments-schema.sql` in Supabase SQL Editor before testing payments.

After payment, enrollments appear on **My courses** (`/dashboard/my-courses`).

---

## 6. Student dashboard

Students see **My applications** at `/dashboard/my-applications` after signing in.

- Apply from **Internships** → track status on **My applications**
- Admins see **All applications** at `/dashboard/applications`

Ensure Supabase `applications` table has RLS allowing users to read their own rows.

---

## 7. Password reset (Supabase Auth)

1. Supabase → **Authentication** → **URL configuration**
2. Add redirect URLs:
   - `https://mindfullmethods.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for local testing)
3. Users use **Forgot password?** on `/login` → email link → `/reset-password`

---

## 8. Admin & Supabase

```
ADMIN_EMAILS=your@email.com
SUPABASE_SERVICE_ROLE_KEY=...   # Admin Studio publish
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Run `supabase/internships-policies.sql` if RLS blocks reads.

---

## Deploy checklist

- [ ] Domain connected + `NEXT_PUBLIC_SITE_URL` updated
- [ ] Resend domain verified
- [ ] Razorpay keys set (test → live)
- [ ] Admin email + service role key
- [ ] Student flow: apply → My applications shows status
