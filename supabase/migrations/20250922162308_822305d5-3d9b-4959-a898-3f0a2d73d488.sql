-- Drop the existing "Steps: read by members" policy
DROP POLICY IF EXISTS "Steps: read by members" ON public.project_steps;

-- Create updated policy that includes approved applicants
CREATE POLICY "Steps: read by members" 
ON public.project_steps 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1
    FROM projects p
    WHERE p.id = project_steps.project_id 
    AND (
      p.creator_id = auth.uid() 
      OR is_project_member(project_steps.project_id, auth.uid())
      OR EXISTS (
        SELECT 1 
        FROM project_applications pa 
        WHERE pa.project_id = project_steps.project_id 
        AND pa.applicant_id = auth.uid() 
        AND pa.status = 'approved'
      )
    )
  )
);