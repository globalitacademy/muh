-- Add unique constraint to prevent duplicate applications from same user to same project
ALTER TABLE public.project_applications 
ADD CONSTRAINT unique_project_applicant 
UNIQUE (project_id, applicant_id);