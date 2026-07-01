# Local Supabase migrations

Run these in the [Supabase SQL Editor](https://supabase.com/dashboard) for your **dev** project, in order. Then verify at `/dashboard/setup` or:

```bash
npm run setup:check
```

| Order | File | Enables |
|------:|------|---------|
| 1 | `supabase/enrollments-schema.sql` | Paid enrollments, My courses |
| 2 | `supabase/applications-status-only.sql` | Application approve/reject |
| 3 | `supabase/course-progress-schema.sql` | Weekly milestones, certificates |
| 4 | `supabase/contact-inquiries-schema.sql` | Contact form storage |
| 5 | `supabase/contact-inquiries-status.sql` | Inquiry pipeline status |
| 6 | `supabase/admin-dashboard-extensions.sql` | Inquiry notes, internship tags |
| 7 | `supabase/contact-inquiries-linked-enrollment.sql` | Link inquiries to enrollments |
| 8 | `supabase/certificates-schema.sql` | Public certificate verify |
| 9 | `supabase/completion-verifications-schema.sql` | Mentor certificate review |
| 10 | `supabase/content-cms-schema.sql` | `platform_settings` — CMS courses/blog, **Site & promos** |
| 11 | `supabase/storage-marketing-uploads.sql` | Public **marketing** bucket for admin image uploads |
| 12 | `supabase/storage-resumes.sql` | Public **resumes** bucket for internship apply uploads |
| 13 | `supabase/v2-platform-extensions.sql` | Waitlist, newsletter, admin audit log, checkout recovery |
| 14 | `supabase/v3-growth-and-referrals.sql` | Promo on checkout intents, referral codes & conversion tracking |
| 15 | `supabase/lms-portal-schema.sql` | LMS portal: lessons progress, quizzes, assignments (`/dashboard/lms`) |

## `platform_settings` keys (after #10)

| Key | Used for |
|-----|----------|
| `course_overrides` | Admin Studio course edits |
| `custom_courses` | Extra courses in CMS |
| `blog_overrides` | Blog post edits |
| `site_content` | Home stats, testimonials, mentor (admin **Site & promos**) |
| `promo_codes` | Checkout discounts (admin **Site & promos**) |
| `referral_codes` | Partner referral discounts (admin **Growth**) |

## Auth (not SQL)

In Supabase → **Authentication** → **URL configuration**, add redirect URLs:

- `http://localhost:3000/reset-password`
- `http://localhost:3000/auth/callback`
- `https://your-production-domain/reset-password`
- `https://your-production-domain/auth/callback`

For social sign-in, enable providers in Supabase (Google, GitHub, Apple, LinkedIn OIDC) and use the same redirect URLs.

Password reset emails open `/reset-password?code=…` (must deploy latest app code).

## Env (not SQL)

- `SUPABASE_SERVICE_ROLE_KEY` — required for admin writes, setup checks, and image uploads
- `ADMIN_EMAILS`, `RESEND_API_KEY` — email (see `/dashboard/setup`)
- `NEXT_PUBLIC_GA_ID` — optional Google Analytics 4

Razorpay, custom domain, and production deploy are intentionally deferred until project end.
