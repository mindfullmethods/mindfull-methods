-- Run if quick apply fails with RLS / policy errors

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

notify pgrst, 'reload schema';
