-- Add useful_links column to projects table
ALTER TABLE public.projects 
ADD COLUMN useful_links TEXT[] DEFAULT '{}';

-- Update comment for the table
COMMENT ON COLUMN public.projects.useful_links IS 'Array of useful links related to the project';