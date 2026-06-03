-- V3: promo tracking on checkout, referral program, optional after v2-platform-extensions.sql

alter table public.checkout_intents
  add column if not exists promo_code text,
  add column if not exists referral_code text;

create table if not exists public.referral_events (
  id uuid primary key default gen_random_uuid(),
  referral_code text not null,
  email text,
  course_slug text not null,
  razorpay_order_id text unique,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists referral_events_code_idx on public.referral_events (referral_code);
create index if not exists referral_events_created_idx on public.referral_events (created_at desc);

alter table public.referral_events enable row level security;

notify pgrst, 'reload schema';
