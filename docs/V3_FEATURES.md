# V3 feature pack

Run migration **#14** after v2 (`supabase/v3-growth-and-referrals.sql`).

## Social login

Login and signup offer **Google, GitHub, Apple, and LinkedIn** (OIDC). Enable each provider in Supabase → Authentication → Providers.

## Referral program

| Item | Detail |
|------|--------|
| Admin | **Growth** → Referral codes (saved to `referral_codes` in `platform_settings`) |
| Link format | `/courses/{slug}?ref=PARTNER10` |
| Checkout | Referral overrides promo for that session |
| Tracking | `referral_events` — attempts vs completed conversions |

## Promo analytics

**Analytics** dashboard shows promo usage from `checkout_intents.promo_code` (completed vs started).

## Student

| Feature | Path |
|---------|------|
| My waitlist | `/dashboard/my-waitlist` |
| Notification prefs | Inquiry updates + certificate emails in **Settings** |

## Admin

| Feature | Detail |
|---------|--------|
| Remove waitlist row | Growth hub — trash icon per entry |
| Export audit log | `/dashboard/admin/audit` → Export CSV |
| OAuth | Same as student — for admin accounts |

## Email prefs channels

| Channel | Emails |
|---------|--------|
| Application | Apply + status |
| Enrollment | Receipts, payment failed, abandoned checkout |
| Course reminder | Weekly nudges |
| Inquiry | Contact inquiry status |
| Certificate | Milestone review, certificate ready, rejection |
