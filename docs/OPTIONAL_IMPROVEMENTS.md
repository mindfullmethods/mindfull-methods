# Optional improvements (implemented)

Features added after core QA — local only until you commit and deploy.

## Done in codebase

| Feature | How to use |
|---------|------------|
| **Forgot password** | `/forgot-password` from login; reset via email → `/reset-password` |
| **Auth callback** | `/auth/callback` — add to Supabase redirect URLs (see `LOCAL_MIGRATIONS.md`) |
| **Admin image upload** | Admin Studio create/edit internship — **Upload** button (needs migration #11) |
| **CI** | `.github/workflows/ci.yml` — lint, build, E2E on push/PR |
| **E2E** | `e2e/forgot-password.spec.ts`, `e2e/certificate-known.spec.ts` (optional env) |
| **Mobile polish** | Dashboard top padding for menu; certificate verify layout; safe-area menu button |
| **GA4** | Set `NEXT_PUBLIC_GA_ID` in `.env.local` / Vercel (already wired in root layout) |

## Optional E2E env (`.env.local`)

```env
E2E_STUDENT_EMAIL=
E2E_STUDENT_PASSWORD=
E2E_ADMIN_EMAIL=
E2E_ADMIN_PASSWORD=
E2E_CERTIFICATE_ID=MM-XXXXXX
```

## Features (latest)

| Feature | Where |
|---------|--------|
| Resume **file upload** | `/dashboard/apply/[id]` — needs `storage-resumes.sql` |
| **Email notification prefs** | `/dashboard/settings` |
| **Analytics funnel** + 14-day charts | `/dashboard/analytics` |

Content & brand guide: `docs/CONTENT_AND_BRAND.md`

## Still manual / later

- Certificate **approve → PDF** flow (see `QA_MANUAL.md`)
- Production domain, live Razorpay, Resend domain verify (`DEPLOY.md`)
- Honor notification toggles in all email send paths (prefs stored; wire per template as needed)
