-- Course completion certificates (run once in Supabase SQL Editor)

create table if not exists public.course_certificates (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  course_slug text not null,
  student_name text not null,
  course_title text not null,
  issued_at timestamptz not null default now(),
  unique (user_id, course_slug)
);

create index if not exists course_certificates_user_idx on public.course_certificates (user_id);
create index if not exists course_certificates_slug_idx on public.course_certificates (course_slug);

alter table public.course_certificates enable row level security;

notify pgrst, 'reload schema';
