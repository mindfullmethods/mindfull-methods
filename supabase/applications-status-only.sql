-- MINIMUM FIX — copy all of this into Supabase → SQL Editor → Run

alter table public.applications
  add column if not exists status text default 'Pending';

update public.applications
set status = 'Pending'
where status is null;

alter table public.applications
  alter column status set default 'Pending';

notify pgrst, 'reload schema';
