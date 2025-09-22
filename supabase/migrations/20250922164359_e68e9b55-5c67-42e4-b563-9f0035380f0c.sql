-- Add new columns to project_tasks table for unified functionality
ALTER TABLE project_tasks ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE project_tasks ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE project_tasks ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE project_tasks ADD COLUMN IF NOT EXISTS reviewed_by UUID;
ALTER TABLE project_tasks ADD COLUMN IF NOT EXISTS submission_notes TEXT;
ALTER TABLE project_tasks ADD COLUMN IF NOT EXISTS review_notes TEXT;

-- Add index for better performance on order_index
CREATE INDEX IF NOT EXISTS idx_project_tasks_order_index ON project_tasks(project_id, order_index);

-- Update status enum to match project_steps workflow
-- First create new enum type if needed
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'unified_task_status') THEN
        CREATE TYPE unified_task_status AS ENUM ('todo', 'in_progress', 'submitted', 'approved', 'returned', 'pending', 'completed', 'overdue');
    END IF;
END$$;

-- Migrate existing project_steps data to project_tasks
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
    ps.status::text,
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
AND NOT EXISTS (
    SELECT 1 FROM project_task_assignments pta 
    WHERE pta.task_id = pt.id AND pta.assigned_to = pa.applicant_id
)
ON CONFLICT DO NOTHING;