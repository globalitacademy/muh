-- Allow project creators to insert based on creator_role without relying on user_roles
CREATE POLICY IF NOT EXISTS "Projects: creator can insert by creator_role"
ON public.projects
FOR INSERT
WITH CHECK (
  creator_id = auth.uid() AND (
    creator_role = 'employer'::user_role OR
    creator_role = 'instructor'::user_role
  )
);
