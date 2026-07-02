-- Storage buckets for avatars, gallery media, news covers and documents.
insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', true),
  ('gallery', 'gallery', true),
  ('news-covers', 'news-covers', true),
  ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "avatar images are public" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "users upload own avatar" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "users replace own avatar" on storage.objects
  for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "gallery is public" on storage.objects
  for select using (bucket_id = 'gallery');
create policy "staff upload gallery" on storage.objects
  for insert with check (bucket_id = 'gallery' and public.is_staff());
create policy "staff manage gallery files" on storage.objects
  for all using (bucket_id = 'gallery' and public.is_staff());

create policy "news covers are public" on storage.objects
  for select using (bucket_id = 'news-covers');
create policy "staff upload news covers" on storage.objects
  for insert with check (bucket_id = 'news-covers' and public.is_staff());

create policy "documents readable per document policy" on storage.objects
  for select using (bucket_id = 'documents');
create policy "staff upload documents" on storage.objects
  for insert with check (bucket_id = 'documents' and public.is_staff());
