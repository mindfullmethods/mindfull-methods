-- Mentor-verified course completion — run once in Supabase SQL Editor

create table if not exists public.course_completion_verifications (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_slug text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_notes text,
  primary key (user_id, course_slug)
);

create index if not exists course_completion_verifications_status_idx
  on public.course_completion_verifications (status, requested_at desc);

alter table public.course_completion_verifications enable row level security;

notify pgrst, 'reload schema';
