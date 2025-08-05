-- Create storage bucket for course images
INSERT INTO storage.buckets (id, name, public) VALUES ('course-images', 'course-images', true);

-- Create storage policies for course images
CREATE POLICY "Anyone can view course images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'course-images');

CREATE POLICY "Partners can upload their course images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'course-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Partners can update their course images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'course-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Partners can delete their course images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'course-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add image_url column to partner_courses table
ALTER TABLE public.partner_courses ADD COLUMN image_url text;