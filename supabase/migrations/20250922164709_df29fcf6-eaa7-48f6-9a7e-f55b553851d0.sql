-- Add new columns to project_tasks table step by step
ALTER TABLE project_tasks 
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_by UUID,
ADD COLUMN IF NOT EXISTS submission_notes TEXT,
ADD COLUMN IF NOT EXISTS review_notes TEXT;

-- Add index for better performance on order_index
CREATE INDEX IF NOT EXISTS idx_project_tasks_order_index ON project_tasks(project_id, order_index);

-- Update the check constraint to allow new status values
ALTER TABLE project_tasks DROP CONSTRAINT IF EXISTS project_tasks_status_check;
ALTER TABLE project_tasks ADD CONSTRAINT project_tasks_status_check 
CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue', 'todo', 'submitted', 'approved', 'returned'));