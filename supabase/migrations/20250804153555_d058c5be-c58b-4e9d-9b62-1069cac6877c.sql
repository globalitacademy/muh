-- Add missing columns to user_applications table
ALTER TABLE public.user_applications 
ADD COLUMN department text,
ADD COLUMN group_number text;