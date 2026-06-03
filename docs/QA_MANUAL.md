# Manual QA walkthrough (local)

Use this after `npm run qa` passes. Keep **dev server running** (`npm run dev`).

**Credentials:** use a test student account and your admin email (in `ADMIN_EMAILS`).

---

## Quick automated gate

```bash
npm run qa          # setup:check + route smoke
npm run test:e2e    # Playwright (public + auth; optional signed-in tests)
```

---

## 1. Marketing & verify branding (~10 min)

| Step | Action | Pass? |
|------|--------|-------|
| 1.1 | Open `/` — toggle light/dark; logo readable in both | ☐ |
| 1.2 | `/courses` — search/filter one course | ☐ |
| 1.3 | `/courses/generative-ai-llms` — Download PDF + syllabus print | ☐ |
| 1.4 | `/blog` + one post load | ☐ |
| 1.5 | `/contact` — submit valid form → check **Dashboard → Inquiries** | ☐ |
| 1.6 | Open a real verify link `/certificates/verify/{id}` — full logo visible in **dark mode** | ☐ |
| 1.7 | Invalid ID `/certificates/verify/MM-NOTREAL` — “Certificate not found” | ☐ |

---

## 2. Auth & student (~15 min)

| Step | Action | Pass? |
|------|--------|-------|
| 2.0 | `/forgot-password` — request reset (check email); set new password on `/reset-password` | ☐ |
| 2.1 | Sign up or log in as test student | ☐ |
| 2.2 | `/dashboard/settings` — set display name (used on certificate) | ☐ |
| 2.3 | **Admin:** grant complimentary enrollment for one course (Enrollments or Users) | ☐ |
| 2.4 | `/dashboard/my-courses` — course listed | ☐ |
| 2.5 | Open course progress — check off **all weeks** | ☐ |
| 2.6 | Certificate area shows **mentor review** (not PDF yet) | ☐ |
| 2.7 | Week resource links open (syllabus + external doc) | ☐ |

---

## 3. Certificate approval (~5 min)

| Step | Action | Pass? |
|------|--------|-------|
| 3.1 | **Admin:** Analytics or Users → **Approve** completion | ☐ |
| 3.2 | **Admin:** “Preview certificate PDF” downloads | ☐ |
| 3.3 | **Student:** certificate page → **Download PDF** | ☐ |
| 3.4 | Public verify link shows **Valid certificate** + correct name/course | ☐ |

---

## 4. Internships (~5 min)

| Step | Action | Pass? |
|------|--------|-------|
| 4.1 | `/dashboard/internships` — open a role | ☐ |
| 4.2 | Quick apply or apply with resume URL | ☐ |
| 4.3 | `/dashboard/my-applications` — success banner + listing | ☐ |
| 4.4 | Withdraw (if not approved) | ☐ |

---

## 5. Admin & CMS (~10 min)

| Step | Action | Pass? |
|------|--------|-------|
| 5.1 | `/dashboard/setup` — SQL items green (launch items can stay pending) | ☐ |
| 5.2 | `/dashboard/admin/site` — save promo + testimonial; reload page | ☐ |
| 5.3 | Home/about reflect copy (or defaults if CMS empty) | ☐ |
| 5.4 | Applications bulk approve/reject | ☐ |
| 5.5 | Admin Studio — draft internship | ☐ |

---

## 6. Promo (optional, test Razorpay only)

| Step | Action | Pass? |
|------|--------|-------|
| 6.1 | Checkout with `LAUNCH10` — discount applied | ☐ |
| 6.2 | Invalid code — error shown | ☐ |

---

## Notes

- If emails don’t send, check terminal for `[email]` logs when `RESEND_API_KEY` is missing.
- `npm run setup:check` lists any missing Supabase SQL files.
- Playwright signed-in tests need `.env.local` vars: `E2E_STUDENT_EMAIL`, `E2E_STUDENT_PASSWORD`, `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`.
