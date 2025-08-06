-- Additional insert policy to allow creators by creator_role
CREATE POLICY "Projects: creator can insert by creator_role"
ON public.projects
FOR INSERT
WITH CHECK (
  creator_id = auth.uid() AND (
    creator_role = 'employer'::user_role OR
    creator_role = 'instructor'::user_role
  )
);
