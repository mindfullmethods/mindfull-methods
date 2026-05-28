-- Run in Supabase → SQL Editor

create table if not exists public.course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_slug text not null,
  week_index integer not null,
  completed_at timestamptz not null default now(),
  unique (user_id, course_slug, week_index)
);

create index if not exists course_progress_user_course_idx
  on public.course_progress (user_id, course_slug);

alter table public.course_progress enable row level security;

drop policy if exists "Users read own progress" on public.course_progress;
create policy "Users read own progress"
  on public.course_progress for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users insert own progress" on public.course_progress;
create policy "Users insert own progress"
  on public.course_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users delete own progress" on public.course_progress;
create policy "Users delete own progress"
  on public.course_progress for delete
  to authenticated
  using (auth.uid() = user_id);

notify pgrst, 'reload schema';
