-- Create storage buckets if they don't exist
insert into storage.buckets (id, name, public)
values ('avatars','avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('portfolio-images','portfolio-images', true)
on conflict (id) do nothing;

-- Policies for public read access
create policy "Public read for avatars and portfolio images"
on storage.objects
for select
using (bucket_id in ('avatars','portfolio-images'));

-- Users can upload to their own folder (first folder segment = user_id)
create policy "Users can upload their own images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('avatars','portfolio-images')
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update files they own (same folder rule)
create policy "Users can update their own images"
on storage.objects
for update
using (
  bucket_id in ('avatars','portfolio-images')
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id in ('avatars','portfolio-images')
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete files they own
create policy "Users can delete their own images"
on storage.objects
for delete
using (
  bucket_id in ('avatars','portfolio-images')
  and auth.uid()::text = (storage.foldername(name))[1]
);
