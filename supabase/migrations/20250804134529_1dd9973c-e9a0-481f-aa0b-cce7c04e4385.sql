-- Add status field to specialties table
ALTER TABLE public.specialties 
ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'coming_soon'));

-- Update existing specialties to use new status field
UPDATE public.specialties 
SET status = CASE 
  WHEN is_active = true THEN 'active' 
  ELSE 'inactive' 
END;

-- Add coming_soon status to module_status enum
ALTER TYPE module_status ADD VALUE 'coming_soon' AFTER 'archived';