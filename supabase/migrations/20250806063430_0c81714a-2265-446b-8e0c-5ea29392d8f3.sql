-- Storage policies for project-files bucket
-- Public read
CREATE POLICY IF NOT EXISTS "Public read project files"
ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'project-files');

-- Authenticated can upload/update/delete
CREATE POLICY IF NOT EXISTS "Authenticated manage project files"
ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'project-files')
WITH CHECK (bucket_id = 'project-files');