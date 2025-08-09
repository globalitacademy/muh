-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Admins can view all project applications" ON public.project_applications;
DROP POLICY IF EXISTS "Admins can update project applications" ON public.project_applications;

-- Create admin policies for project applications
CREATE POLICY "Admins can view all project applications" 
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

CREATE POLICY "Admins can update project applications" 
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