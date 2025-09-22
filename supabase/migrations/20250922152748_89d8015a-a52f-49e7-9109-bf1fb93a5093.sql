-- Add submission tracking fields to project_steps (step 2)
ALTER TABLE project_steps 
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,  
ADD COLUMN IF NOT EXISTS reviewed_by UUID,
ADD COLUMN IF NOT EXISTS submission_notes TEXT,
ADD COLUMN IF NOT EXISTS review_notes TEXT;

-- Update RLS policies to allow students to submit their assigned steps
DROP POLICY IF EXISTS "Steps: students can submit assigned steps" ON project_steps;
CREATE POLICY "Steps: students can submit assigned steps" 
ON project_steps 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM project_applications pa 
    WHERE pa.project_id = project_steps.project_id 
    AND pa.applicant_id = auth.uid() 
    AND pa.status = 'approved'
  )
  AND status IN ('todo', 'in_progress', 'returned')
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM project_applications pa 
    WHERE pa.project_id = project_steps.project_id 
    AND pa.applicant_id = auth.uid() 
    AND pa.status = 'approved'
  )
  AND status = 'submitted'
);