-- Public marketing uploads (internship cards, CMS images via admin upload).
-- Writes use SUPABASE_SERVICE_ROLE_KEY in server actions; reads are public.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'marketing',
  'marketing',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Marketing images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'marketing');
