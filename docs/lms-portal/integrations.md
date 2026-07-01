# Integration Wiring

## Supabase

- Use Supabase Auth for email login, forgot password, and Google OAuth.
- Store app profile data in `public.users` with `auth_user_id` mapped to `auth.users.id`.
- Enforce role-based access with middleware: students can access learning views, instructors can access assigned-course tools, and admins can access all management views.
- Apply `supabase-schema.sql` before connecting UI data.

## Razorpay

- Create orders from a server route only.
- Store `razorpay_order_id` when checkout opens.
- Verify checkout signatures server-side before setting `payment_status = 'paid'`.
- Enroll the student only after verified payment success.

## Bunny Stream

- Store Bunny iframe or playback URLs in `lessons.video_url`.
- Use signed playback tokens for protected course videos.
- Keep notes and attachments in Supabase Storage or Bunny Storage and save URLs on lessons.

## Certificates

- Generate certificates when course progress is 100% and the learner has met the minimum passing score.
- Use `certificate_number` as the public lookup key.
- Serve verification at `/verify/{certificate_id}` and include the same URL in the QR code.

## Vercel Deployment

- Required environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - `BUNNY_STREAM_LIBRARY_ID`
  - `BUNNY_STREAM_API_KEY`
