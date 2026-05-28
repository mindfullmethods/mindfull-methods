-- Run in Supabase → SQL Editor if apply fails with missing column errors

alter table public.applications
  add column if not exists user_id uuid references auth.users (id);

alter table public.applications
  add column if not exists student_name text;

alter table public.applications
  add column if not exists email text;

alter table public.applications
  add column if not exists resume text;

alter table public.applications
  add column if not exists status text default 'Pending';

alter table public.applications
  add column if not exists created_at timestamptz default now();

update public.applications set status = 'Pending' where status is null;

notify pgrst, 'reload schema';
