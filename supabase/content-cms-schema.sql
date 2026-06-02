-- Platform content overrides (blog + course spotlight) — run once in Supabase SQL Editor

create table if not exists public.platform_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.platform_settings enable row level security;

-- Inquiry status timeline
alter table public.contact_inquiries
  add column if not exists status_history jsonb not null default '[]'::jsonb;

notify pgrst, 'reload schema';
