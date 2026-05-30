export const CONTACT_INQUIRIES_TABLE_SQL = `-- Run in Supabase → SQL Editor
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
create index if not exists contact_inquiries_status_idx on public.contact_inquiries (status);

alter table public.contact_inquiries enable row level security;

notify pgrst, 'reload schema';`;

export const CONTACT_INQUIRIES_STATUS_SQL = `-- Run in Supabase → SQL Editor
alter table public.contact_inquiries
  add column if not exists status text not null default 'New';

create index if not exists contact_inquiries_status_idx on public.contact_inquiries (status);

notify pgrst, 'reload schema';`;

export const CONTACT_INQUIRIES_ADMIN_NOTES_SQL = `-- Run in Supabase → SQL Editor
alter table public.contact_inquiries
  add column if not exists admin_notes text;

notify pgrst, 'reload schema';`;

export const CONTACT_INQUIRIES_LINKED_ENROLLMENT_SQL = `-- Optional — run after enrollments table exists
alter table public.contact_inquiries
  add column if not exists linked_enrollment_id uuid references public.enrollments (id) on delete set null;

notify pgrst, 'reload schema';`;
