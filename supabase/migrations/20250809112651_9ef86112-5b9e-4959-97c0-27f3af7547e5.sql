-- Check if RLS policies exist for project_applications and ensure admin access
CREATE POLICY IF NOT EXISTS "Admins can view all project applications" 
ON public.project_applications 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin'
  )
);

CREATE POLICY IF NOT EXISTS "Admins can update project applications" 
ON public.project_applications 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin'
  )
);

-- Users can view their own applications
CREATE POLICY IF NOT EXISTS "Users can view their own applications" 
ON public.project_applications 
FOR SELECT 
TO authenticated 
USING (applicant_id = auth.uid());

-- Project owners can view applications to their projects
CREATE POLICY IF NOT EXISTS "Project owners can view applications" 
ON public.project_applications 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_id 
    AND p.created_by = auth.uid()
  )
);