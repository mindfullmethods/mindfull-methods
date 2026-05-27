-- Optional: run in Supabase SQL Editor if you prefer RLS policies instead of the service role key.
-- Admin Studio writes use SUPABASE_SERVICE_ROLE_KEY on the server (after requireAdmin()).

alter table public.internships enable row level security;

drop policy if exists "Public read internships" on public.internships;
create policy "Public read internships"
  on public.internships for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated insert internships" on public.internships;
create policy "Authenticated insert internships"
  on public.internships for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated update internships" on public.internships;
create policy "Authenticated update internships"
  on public.internships for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated delete internships" on public.internships;
create policy "Authenticated delete internships"
  on public.internships for delete
  to authenticated
  using (true);
