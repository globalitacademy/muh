-- Create storage bucket for topic videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('topic-videos', 'topic-videos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for topic videos bucket
CREATE POLICY "Public read access for topic videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'topic-videos');

CREATE POLICY "Authenticated users can upload topic videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'topic-videos');

CREATE POLICY "Authenticated users can update topic videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'topic-videos');

CREATE POLICY "Authenticated users can delete topic videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'topic-videos');