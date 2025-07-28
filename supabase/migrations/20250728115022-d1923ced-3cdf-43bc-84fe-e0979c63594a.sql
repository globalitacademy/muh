-- Fix specialties table structure to match the code expectations
-- Rename title columns to name columns
ALTER TABLE public.specialties 
RENAME COLUMN title TO name;

ALTER TABLE public.specialties 
RENAME COLUMN title_en TO name_en;

ALTER TABLE public.specialties 
RENAME COLUMN title_ru TO name_ru;

-- Add missing icon and color columns
ALTER TABLE public.specialties 
ADD COLUMN icon text DEFAULT 'Code',
ADD COLUMN color text DEFAULT 'from-blue-500 to-cyan-500';

-- Update existing records to have valid icon and color values
UPDATE public.specialties 
SET 
  icon = 'Code',
  color = 'from-blue-500 to-cyan-500'
WHERE icon IS NULL OR color IS NULL;