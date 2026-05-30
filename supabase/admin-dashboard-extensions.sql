-- Admin dashboard extensions (run once in Supabase SQL Editor)
-- Run each block separately if a combined run fails.

-- Inquiry admin notes (required for saving notes on /dashboard/inquiries)
alter table public.contact_inquiries
  add column if not exists admin_notes text;

-- Optional inquiry → enrollment link (requires enrollments table)
alter table public.contact_inquiries
  add column if not exists linked_enrollment_id uuid references public.enrollments (id) on delete set null;

-- Internship tags + draft/publish
alter table public.internships
  add column if not exists tags text;

alter table public.internships
  add column if not exists is_published boolean not null default true;

notify pgrst, 'reload schema';
