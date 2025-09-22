-- First, update the check constraint to allow new status values
ALTER TABLE project_tasks DROP CONSTRAINT IF EXISTS project_tasks_status_check;

-- Add new check constraint with expanded status values
ALTER TABLE project_tasks ADD CONSTRAINT project_tasks_status_check 
CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue', 'todo', 'submitted', 'approved', 'returned'));

-- Now migrate existing project_steps data to project_tasks with proper status mapping
INSERT INTO project_tasks (
    project_id, 
    title, 
    description, 
    due_date, 
    status, 
    order_index,
    submitted_at,
    reviewed_at,
    reviewed_by,
    submission_notes,
    review_notes,
    assigned_by,
    priority,
    created_at,
    updated_at
)
SELECT 
    ps.project_id,
    ps.title,
    ps.description,
    ps.due_date,
    CASE ps.status::text
        WHEN 'todo' THEN 'pending'
        WHEN 'in_progress' THEN 'in_progress'
        WHEN 'submitted' THEN 'submitted'
        WHEN 'approved' THEN 'completed'
        WHEN 'returned' THEN 'pending'
        ELSE 'pending'
    END as status,
    ps.order_index,
    ps.submitted_at,
    ps.reviewed_at,
    ps.reviewed_by,
    ps.submission_notes,
    ps.review_notes,
    p.creator_id as assigned_by,
    'medium' as priority,
    ps.created_at,
    ps.updated_at
FROM project_steps ps
JOIN projects p ON p.id = ps.project_id
WHERE NOT EXISTS (
    SELECT 1 FROM project_tasks pt 
    WHERE pt.project_id = ps.project_id 
    AND pt.title = ps.title 
    AND pt.order_index = ps.order_index
)
ON CONFLICT DO NOTHING;

-- Create task assignments for migrated steps based on approved project applications
INSERT INTO project_task_assignments (task_id, assigned_to, created_at, updated_at)
SELECT DISTINCT 
    pt.id as task_id,
    pa.applicant_id as assigned_to,
    NOW() as created_at,
    NOW() as updated_at
FROM project_tasks pt
JOIN projects p ON p.id = pt.project_id
JOIN project_applications pa ON pa.project_id = p.id
WHERE pa.status = 'approved'
AND pt.order_index IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM project_task_assignments pta 
    WHERE pta.task_id = pt.id AND pta.assigned_to = pa.applicant_id
)
ON CONFLICT DO NOTHING;