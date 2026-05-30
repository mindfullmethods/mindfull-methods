-- Link contact inquiries to enrollments (run once in Supabase SQL Editor)
-- Requires: public.enrollments table (supabase/enrollments-schema.sql)

alter table public.contact_inquiries
  add column if not exists linked_enrollment_id uuid references public.enrollments (id) on delete set null;

notify pgrst, 'reload schema';
