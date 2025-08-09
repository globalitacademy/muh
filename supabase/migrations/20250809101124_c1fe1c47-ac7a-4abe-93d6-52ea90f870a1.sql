-- Add policy to allow public access to public projects
CREATE POLICY "Public can view public projects" 
ON public.projects 
FOR SELECT 
USING (is_public = true);

-- Update the existing policy to be more specific about creator/member access
DROP POLICY IF EXISTS "Projects: read by creator or members" ON public.projects;

CREATE POLICY "Projects: read by creator, members, or public projects" 
ON public.projects 
FOR SELECT 
USING (
  (creator_id = auth.uid()) OR 
  is_project_member(id, auth.uid()) OR 
  (is_public = true)
);