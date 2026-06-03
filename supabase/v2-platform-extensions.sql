-- V2: waitlist, newsletter, audit log, abandoned checkout tracking

create table if not exists public.course_waitlist (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  email text not null,
  full_name text,
  created_at timestamptz not null default now(),
  unique (course_slug, email)
);

create index if not exists course_waitlist_slug_idx on public.course_waitlist (course_slug);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text default 'footer',
  created_at timestamptz not null default now()
);

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_email text not null,
  action text not null,
  entity_type text,
  entity_id text,
  detail jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_log_created_idx on public.admin_audit_log (created_at desc);

create table if not exists public.checkout_intents (
  id uuid primary key default gen_random_uuid(),
  razorpay_order_id text not null unique,
  course_slug text not null,
  course_title text not null,
  email text,
  amount_paise int not null default 0,
  completed boolean not null default false,
  reminder_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists checkout_intents_open_idx
  on public.checkout_intents (completed, reminder_sent_at, created_at);

alter table public.course_waitlist enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.admin_audit_log enable row level security;
alter table public.checkout_intents enable row level security;

notify pgrst, 'reload schema';
