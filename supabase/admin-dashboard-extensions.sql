-- Admin dashboard extensions (run once in Supabase SQL Editor)

-- Inquiry notes + optional link to enrollment
alter table public.contact_inquiries
  add column if not exists admin_notes text,
  add column if not exists linked_enrollment_id uuid references public.enrollments (id) on delete set null;

-- Enrollment refund tracking (status = 'refunded')
-- status column already exists; 'refunded' is a valid value

-- Internship tags + draft/publish
alter table public.internships
  add column if not exists tags text,
  add column if not exists is_published boolean not null default true;

notify pgrst, 'reload schema';
