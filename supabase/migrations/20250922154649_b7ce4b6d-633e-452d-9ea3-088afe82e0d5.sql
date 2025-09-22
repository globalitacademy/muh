-- Add RLS policy for project members to view task assignments
CREATE POLICY "Project members can view task assignments" 
ON project_task_assignments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM project_tasks pt 
    JOIN projects p ON p.id = pt.project_id 
    WHERE pt.id = project_task_assignments.task_id 
    AND (
      p.creator_id = auth.uid() 
      OR is_project_member(p.id, auth.uid())
    )
  )
);