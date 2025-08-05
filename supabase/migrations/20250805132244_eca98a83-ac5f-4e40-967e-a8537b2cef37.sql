-- Create storage bucket for institution logos
INSERT INTO storage.buckets (id, name, public) VALUES ('institution-logos', 'institution-logos', true);

-- Create storage policies for institution logos
CREATE POLICY "Anyone can view institution logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'institution-logos');

CREATE POLICY "Partners can upload their institution logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'institution-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Partners can update their institution logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'institution-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Partners can delete their institution logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'institution-logos' AND auth.uid()::text = (storage.foldername(name))[1]);