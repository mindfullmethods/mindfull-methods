# V2 feature pack

Shipped locally across student experience, admin & operations, payments & growth, marketing & SEO, and platform/engineering. Run migration **#13** (`supabase/v2-platform-extensions.sql`) before using DB-backed features.

## Student experience

| Feature | Where |
|---------|--------|
| Course waitlist | Course detail page (when not enrolled) — `CourseWaitlistForm` |
| Waitlist confirmation email | Sent on signup (requires `RESEND_API_KEY`) |
| Resume file upload | Internship apply — `storage-resumes.sql` + `ApplyResumeField` |
| Google OAuth | Login / signup — `AuthOAuthButtons`; configure Google in Supabase |
| Booking link | `NEXT_PUBLIC_BOOKING_URL` or fallback `/contact` — navbar, courses, about |
| Student email prefs | Notification toggles respected by `sendStudentEmail()` |

## Admin & operations

| Feature | Where |
|---------|--------|
| Admin audit log | `admin_audit_log` table; actions logged from applications, enrollments, certificates, site promos |
| Recent activity | Admin home — last 10 audit rows |
| Full audit log | `/dashboard/admin/audit` — paginated history |
| Growth hub | `/dashboard/growth` — waitlist, newsletter, checkout counts, CSV export |
| Waitlist notify | Growth hub — **Email waitlist** when seats open (audited) |
| Mentor photo upload | Site & promos — upload to marketing bucket |
| Marketing image upload | Admin Studio internships — `storage-marketing-uploads.sql` |

## Payments & growth

| Feature | Where |
|---------|--------|
| Checkout intents | Recorded on order create; marked complete on payment |
| Abandoned checkout email | Cron `GET /api/cron/checkout-recovery` (daily, needs `CRON_SECRET`) |
| Payment receipt | `GET /api/receipt/[orderId]` — linked from enrollment confirmation email |

## Marketing & SEO

| Feature | Where |
|---------|--------|
| Newsletter signup | Footer — `POST /api/newsletter` |
| CMS site content | Home stats, testimonials, mentor — admin **Site & promos** (`site_content` key) |
| Content & brand guide | `docs/CONTENT_AND_BRAND.md` (your parallel track) |

## Platform / engineering

| Feature | Where |
|---------|--------|
| Rate limiting | Contact + newsletter APIs |
| Forgot / reset password | `/forgot-password`, `/reset-password`, `/auth/callback` |
| CI | `.github/workflows/ci.yml` |
| Crons (Vercel) | Digest, progress reminders (Mon), checkout recovery (daily) — `vercel.json` |

## Your checklist before production

1. Run SQL #13 (+ #11–12 if not done) in Supabase SQL Editor.
2. Set env: `CRON_SECRET`, optional `NEXT_PUBLIC_BOOKING_URL`, Google OAuth in Supabase.
3. Add redirect URLs: `/auth/callback`, `/reset-password` for prod domain.
4. Deploy when ready — production is behind local until then.

See also: `docs/LOCAL_MIGRATIONS.md`, `docs/QA_MANUAL.md`, `docs/DEPLOY.md`.
