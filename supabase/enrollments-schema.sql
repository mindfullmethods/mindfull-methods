-- Run in Supabase → SQL Editor (one shot)

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  course_slug text not null,
  course_title text not null,
  amount_paise integer not null,
  currency text not null default 'INR',
  razorpay_order_id text not null unique,
  razorpay_payment_id text unique,
  email text,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

create index if not exists enrollments_user_id_idx on public.enrollments (user_id);
create index if not exists enrollments_course_slug_idx on public.enrollments (course_slug);

alter table public.enrollments enable row level security;

drop policy if exists "Users read own enrollments" on public.enrollments;
create policy "Users read own enrollments"
  on public.enrollments for select
  to authenticated
  using (auth.uid() = user_id);

notify pgrst, 'reload schema';
