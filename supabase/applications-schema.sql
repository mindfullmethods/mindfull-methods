-- Run this entire script in Supabase → SQL Editor (one shot).
-- Fixes: missing status column, schema cache error, empty student/email on old rows.

-- Core columns the dashboard expects
alter table public.applications
  add column if not exists user_id uuid references auth.users (id);

alter table public.applications
  add column if not exists student_name text;

alter table public.applications
  add column if not exists email text;

alter table public.applications
  add column if not exists resume text;

alter table public.applications
  add column if not exists status text not null default 'Pending';

alter table public.applications
  add column if not exists created_at timestamptz not null default now();

-- Backfill name + email from profiles for dashboard-applied rows
update public.applications a
set
  student_name = coalesce(a.student_name, p.full_name),
  email = coalesce(a.email, p.email)
from public.profiles p
where a.user_id = p.id
  and (a.student_name is null or a.email is null);

-- Ensure pending status on rows that predate the column
update public.applications
set status = 'Pending'
where status is null;

-- RLS: students see and create their own applications
alter table public.applications enable row level security;

drop policy if exists "Users read own applications" on public.applications;
create policy "Users read own applications"
  on public.applications for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users insert own applications" on public.applications;
create policy "Users insert own applications"
  on public.applications for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Tell PostgREST to reload schema cache (fixes "column not in schema cache")
notify pgrst, 'reload schema';
