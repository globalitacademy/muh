-- Allow employers to view profiles of users who applied to their projects
CREATE POLICY "Employers can view applicant profiles" 
ON public.profiles 
FOR SELECT 
USING (
  id IN (
    SELECT pa.applicant_id 
    FROM project_applications pa
    JOIN projects p ON p.id = pa.project_id
    WHERE p.creator_id = auth.uid()
  )
);