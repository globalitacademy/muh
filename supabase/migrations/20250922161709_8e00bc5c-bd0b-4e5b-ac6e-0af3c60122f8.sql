-- Drop the existing policy that may have issues
DROP POLICY IF EXISTS "Employers can view applicant profiles" ON public.profiles;

-- Create a more specific policy for employers to view applicant profiles
CREATE POLICY "Employers can view applicant profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM project_applications pa
    INNER JOIN projects p ON p.id = pa.project_id
    WHERE pa.applicant_id = profiles.id 
    AND p.creator_id = auth.uid()
  )
);