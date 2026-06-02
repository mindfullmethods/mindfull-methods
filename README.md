# Mindfull Methods

Full-stack mentorship platform: marketing site, student dashboard, payments, internships, and admin operations.

**Live:** https://mindfull-methods.vercel.app

---

## Features

### Marketing
- Home, courses catalog, course detail + syllabus, blog, about, contact, privacy, terms
- Light/dark theme, SEO (sitemap, robots, JSON-LD, Open Graph), Vercel Analytics + Speed Insights
- Optional GA4 via `NEXT_PUBLIC_GA_ID`

### Students
- Auth (login/signup), settings (name + password)
- Pay & enroll (Razorpay + promo codes: `LAUNCH10`, `MENTOR500`, `STUDENT15`)
- My courses, weekly progress with resources, certificates hub
- Public certificate verification + QR codes
- Internships apply, track status, withdraw applications

### Admin
- Admin home, analytics, students (role toggle)
- Applications (search, bulk approve/reject)
- Inquiries (notes, enrollment linking)
- Enrollments (filter, refund, resend receipt, **complimentary grant**)
- Admin Studio (internships CRUD, tags, draft/publish)
- Daily digest email (cron + manual)

---

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Supabase · Razorpay · Resend · Vercel

---

## Local setup

```bash
git clone https://github.com/mindfullmethods/mindfull-methods.git
cd mindfull-methods
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` — see `.env.example` for all variables.

---

## Supabase SQL (run in order)

Run each file in the [Supabase SQL Editor](https://supabase.com/dashboard). Verify readiness at `/dashboard/setup`.

| File | Purpose |
|------|---------|
| `supabase/enrollments-schema.sql` | Paid enrollments |
| `supabase/course-progress-schema.sql` | Weekly milestones |
| `supabase/applications-status-only.sql` | Application status column |
| `supabase/contact-inquiries-schema.sql` | Contact form storage |
| `supabase/contact-inquiries-status.sql` | Inquiry status |
| `supabase/contact-inquiries-linked-enrollment.sql` | Link inquiries to enrollments |
| `supabase/admin-dashboard-extensions.sql` | Inquiry notes, internship tags |
| `supabase/certificates-schema.sql` | Certificate verification |
| `supabase/completion-verifications-schema.sql` | Mentor completion review |
| `supabase/content-cms-schema.sql` | CMS overrides for courses/blog |

---

## Syllabus PDFs

Course pages show **Download PDF** when `public/syllabi/{course-slug}.pdf` exists.

Generate all syllabi from course data:

```bash
npm run syllabi:generate
```

Students can also use **View & print** at `/courses/[slug]/syllabus` (browser → Save as PDF).

---

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint
npm run smoke    # Quick route health check
npm run syllabi:generate   # Regenerate public/syllabi/*.pdf
```

See `docs/SMOKE_TEST.md` for full manual QA checklist.

---

## Deploy (Vercel)

1. Connect GitHub repo
2. Add env vars from `.env.example`
3. Set `NEXT_PUBLIC_SITE_URL` to your Vercel URL (switch to custom domain later)
4. Run Supabase migrations above
5. Optional: `CRON_SECRET` for daily admin digest

Custom domain (`mindfullmethods.com`) can be attached after final QA — see `/dashboard/setup`.
