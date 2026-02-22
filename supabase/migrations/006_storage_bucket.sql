-- ============================================
-- 006: Create product-images storage bucket
-- ============================================

-- 1. Create the bucket (public so images can be viewed by anyone)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 2. Allow anyone to VIEW images (public bucket)
drop policy if exists "Public read access" on storage.objects;
create policy "Public read access"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- 3. Allow anyone to UPLOAD images
--    (admin access is guarded by password in the app layer)
drop policy if exists "Admins can upload images" on storage.objects;
drop policy if exists "Allow uploads to product-images" on storage.objects;
create policy "Allow uploads to product-images"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

-- 4. Allow anyone to UPDATE images
drop policy if exists "Admins can update images" on storage.objects;
drop policy if exists "Allow updates to product-images" on storage.objects;
create policy "Allow updates to product-images"
  on storage.objects for update
  using (bucket_id = 'product-images');

-- 5. Allow anyone to DELETE images
drop policy if exists "Admins can delete images" on storage.objects;
drop policy if exists "Allow deletes from product-images" on storage.objects;
create policy "Allow deletes from product-images"
  on storage.objects for delete
  using (bucket_id = 'product-images');
