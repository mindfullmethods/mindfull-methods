# E2E tests (Playwright)

## Setup

```bash
npm install
npx playwright install chromium
```

Add to `.env.local` (optional — signed-in tests skip without these):

```env
E2E_STUDENT_EMAIL=student-test@example.com
E2E_STUDENT_PASSWORD=your-test-password
E2E_ADMIN_EMAIL=rajivshekar@mindfullmethods.com
E2E_ADMIN_PASSWORD=your-admin-password
```

## Run

```bash
# Most reliable: build + production server on port 3456 (avoids stale dev on :3000)
npm run test:e2e:build

# Faster iteration: dev server on 3456 (stop any other `next dev` first)
npm run test:e2e

# UI mode
npm run test:e2e:ui
```

PowerShell (reuse your own server on 3456):

```powershell
$env:E2E_SKIP_WEB_SERVER="1"
$env:E2E_BASE_URL="http://127.0.0.1:3456"
npm run dev -- --port 3456
# in another terminal:
npm run test:e2e
```

If certificate or dashboard routes return **404**, you are hitting an old server — use `test:e2e:build` or dev only on **3456** (`127.0.0.1`, not a stale `:3000`).

## Coverage

| File | What |
|------|------|
| `public.spec.ts` | Marketing pages, certificate verify branding |
| `auth-guards.spec.ts` | Login redirects, auth forms |
| `student.spec.ts` | Student dashboard (needs credentials) |
| `admin.spec.ts` | Admin pages (needs admin credentials) |
| `forgot-password.spec.ts` | Forgot password page + login link |
| `certificate-known.spec.ts` | Valid cert page (needs `E2E_CERTIFICATE_ID`) |

Certificate **approve → PDF** is covered in `docs/QA_MANUAL.md` (needs enrolled student + week progress).
