DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public read project files' AND schemaname = 'storage' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Public read project files"
    ON storage.objects
    FOR SELECT TO anon, authenticated
    USING (bucket_id = 'project-files');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated manage project files' AND schemaname = 'storage' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Authenticated manage project files"
    ON storage.objects
    FOR ALL TO authenticated
    USING (bucket_id = 'project-files')
    WITH CHECK (bucket_id = 'project-files');
  END IF;
END $$;