-- Run in Supabase → SQL Editor if contact_inquiries already exists without status

alter table public.contact_inquiries
  add column if not exists status text not null default 'New';

create index if not exists contact_inquiries_status_idx on public.contact_inquiries (status);

notify pgrst, 'reload schema';
