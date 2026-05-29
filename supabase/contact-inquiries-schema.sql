-- Run in Supabase → SQL Editor (one shot)

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  interest text not null default 'general',
  interest_label text,
  message text not null,
  status text not null default 'New',
  created_at timestamptz not null default now()
);

create index if not exists contact_inquiries_created_at_idx on public.contact_inquiries (created_at desc);
create index if not exists contact_inquiries_email_idx on public.contact_inquiries (email);

alter table public.contact_inquiries enable row level security;

-- No public policies — inserts go through the server (service role).

notify pgrst, 'reload schema';
