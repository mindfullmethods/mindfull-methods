export const APPLICATIONS_STATUS_SQL = `-- Run in Supabase → SQL Editor
alter table public.applications
  add column if not exists status text default 'Pending';

update public.applications
set status = 'Pending'
where status is null;

notify pgrst, 'reload schema';`;

export const APPLICATIONS_COLUMNS_SQL = `-- Run in Supabase → SQL Editor
alter table public.applications add column if not exists user_id uuid references auth.users (id);
alter table public.applications add column if not exists student_name text;
alter table public.applications add column if not exists email text;
alter table public.applications add column if not exists resume text;
alter table public.applications add column if not exists status text default 'Pending';
alter table public.applications add column if not exists created_at timestamptz default now();
notify pgrst, 'reload schema';`;

export function isSupabaseSchemaError(message?: string | null) {
  if (!message) return false;
  const lower = message.toLowerCase();
  return (
    lower.includes("schema cache") ||
    lower.includes("does not exist") ||
    lower.includes("pgrst205")
  );
}

export function applicationsSchemaFixMessage(message?: string) {
  if (!isSupabaseSchemaError(message)) return null;
  return "Run supabase/applications-missing-columns.sql in Supabase SQL Editor, then refresh.";
}
