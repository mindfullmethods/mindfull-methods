# Mindfull Methods — Smoke Test Checklist

Run after deploy on `https://mindfull-methods.vercel.app` (or local `npm run dev` / `npm run start`).

**Before smoke:** ensure Supabase migrations are applied — `npm run setup:check` (see `docs/LOCAL_MIGRATIONS.md`).

**Full local gate:** `npm run qa` (setup + smoke). **Signed-in walkthrough:** `docs/QA_MANUAL.md`. **Browser E2E:** `npm run test:e2e`.

## Marketing

- [ ] Home page loads, theme toggle works
- [ ] `/courses` search and filters work
- [ ] `/courses/generative-ai-llms` course detail + syllabus
- [ ] **Download PDF** on course page (`/syllabi/{slug}.pdf`)
- [ ] `/courses/prompt-engineering/syllabus` print view
- [ ] `/blog` and a blog post render
- [ ] Contact form submits (check admin inquiries + email log)
- [ ] View page source — JSON-LD present on course pages

## Auth

- [ ] Sign up new account
- [ ] Log in / log out
- [ ] `/dashboard/settings` — update display name

## Student

- [ ] Browse courses in dashboard
- [ ] Pay & enroll (Razorpay test mode) or use admin complimentary grant
- [ ] `/dashboard/my-courses` shows enrollment
- [ ] Track progress — check off weeks, resources links open
- [ ] At 100% — certificate page shows “mentor review” until admin approves
- [ ] Admin approves on **Users → student** or **Analytics** — student can **Download PDF**
- [ ] `/certificates/verify/[id]` shows valid certificate after approval
- [ ] Admin **Preview certificate PDF** link works after approve
- [ ] Apply to internship → appears in my applications
- [ ] Withdraw application (non-approved)

## Admin

- [ ] Admin home stats load
- [ ] Bulk approve/reject applications
- [ ] Inquiry notes + link enrollment
- [ ] Grant complimentary enrollment
- [ ] Admin Studio — create draft internship
- [ ] Students page — toggle admin role (test user)
- [ ] Send admin digest email

## Promo codes (checkout)

- [ ] `LAUNCH10` — 10% off order amount
- [ ] Invalid code shows error

## Admin (local, signed in as admin)

- [ ] `/dashboard/setup` — migration checklist; `npm run setup:check` matches green items
- [ ] `/dashboard/admin/site` — edit promo + marketing copy (requires `content-cms-schema.sql`)

## Automated route check

```bash
# Terminal 1
npm run dev
# or: npm run build && npm run start

# Terminal 2
npm run smoke

# Production (after deploy):
# SMOKE_BASE_URL=https://mindfull-methods.vercel.app npm run smoke
```

Checks: marketing pages, all 6 syllabus PDFs, syllabus `.txt` API, auth redirects, JSON-LD on course pages, contact API validation.

## SQL migrations (Supabase)

Ensure these have been run (verify at `/dashboard/setup`):

- `supabase/enrollments-schema.sql`
- `supabase/course-progress-schema.sql`
- `supabase/applications-status-only.sql`
- `supabase/contact-inquiries-schema.sql`
- `supabase/contact-inquiries-status.sql`
- `supabase/admin-dashboard-extensions.sql`
- `supabase/contact-inquiries-linked-enrollment.sql`
- `supabase/certificates-schema.sql`
- `supabase/completion-verifications-schema.sql`
- `supabase/content-cms-schema.sql`
