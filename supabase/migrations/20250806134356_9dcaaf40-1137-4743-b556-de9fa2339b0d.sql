-- Add image_url to projects for project cover image
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS image_url text;