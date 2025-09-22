-- Add new status values to project_step_status enum (step 1)
ALTER TYPE project_step_status ADD VALUE IF NOT EXISTS 'submitted';
ALTER TYPE project_step_status ADD VALUE IF NOT EXISTS 'completed';  
ALTER TYPE project_step_status ADD VALUE IF NOT EXISTS 'rejected';
ALTER TYPE project_step_status ADD VALUE IF NOT EXISTS 'cancelled';
ALTER TYPE project_step_status ADD VALUE IF NOT EXISTS 'returned';