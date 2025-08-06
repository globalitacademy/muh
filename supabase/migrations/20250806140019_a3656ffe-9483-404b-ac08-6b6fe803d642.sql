-- Add fields to projects
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS required_skills text[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS resources jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS application_deadline timestamptz NULL,
ADD COLUMN IF NOT EXISTS max_applicants integer NULL;

-- Create project_applications table
CREATE TABLE IF NOT EXISTS public.project_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  applicant_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  cover_letter text NULL,
  applied_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_project_applicant UNIQUE (project_id, applicant_id)
);

-- Enable RLS
ALTER TABLE public.project_applications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Applications: applicant can create own" 
ON public.project_applications FOR INSERT 
WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Applications: applicant can view own" 
ON public.project_applications FOR SELECT 
USING (applicant_id = auth.uid());

CREATE POLICY "Applications: creator or members can view" 
ON public.project_applications FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.projects p
  WHERE p.id = project_applications.project_id AND (p.creator_id = auth.uid() OR is_project_member(project_applications.project_id, auth.uid()))
));

CREATE POLICY "Applications: manage by creator or admin/instructor" 
ON public.project_applications FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.projects p
  WHERE p.id = project_applications.project_id AND (p.creator_id = auth.uid() OR is_admin_or_instructor(auth.uid()))
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.projects p
  WHERE p.id = project_applications.project_id AND (p.creator_id = auth.uid() OR is_admin_or_instructor(auth.uid()))
));

CREATE POLICY "Applications: delete by creator or admin/instructor" 
ON public.project_applications FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.projects p
  WHERE p.id = project_applications.project_id AND (p.creator_id = auth.uid() OR is_admin_or_instructor(auth.uid()))
));
