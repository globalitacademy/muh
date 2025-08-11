-- First, let's check if projects table exists and add missing columns if needed
DO $$ 
BEGIN
  -- Add missing columns to projects table if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'projects' AND column_name = 'project_type') THEN
    ALTER TABLE projects ADD COLUMN project_type TEXT DEFAULT 'project';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'projects' AND column_name = 'timeline') THEN
    ALTER TABLE projects ADD COLUMN timeline JSONB DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'projects' AND column_name = 'requirements') THEN
    ALTER TABLE projects ADD COLUMN requirements TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'projects' AND column_name = 'useful_resources') THEN
    ALTER TABLE projects ADD COLUMN useful_resources JSONB DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'projects' AND column_name = 'organization') THEN
    ALTER TABLE projects ADD COLUMN organization TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'projects' AND column_name = 'cover_image_url') THEN
    ALTER TABLE projects ADD COLUMN cover_image_url TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'projects' AND column_name = 'task_list') THEN
    ALTER TABLE projects ADD COLUMN task_list JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Create project_tasks table for task management
CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'cancelled', 'rejected', 'pending_review')),
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID NOT NULL REFERENCES profiles(id),
  order_index INTEGER DEFAULT 0,
  files JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_discussions table for communication
CREATE TABLE IF NOT EXISTS project_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES profiles(id),
  message TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  recipient_id UUID REFERENCES profiles(id),
  files JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_reviews table for final evaluations
CREATE TABLE IF NOT EXISTS project_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES profiles(id),
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 10),
  feedback TEXT,
  certificate_issued BOOLEAN DEFAULT FALSE,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_tasks
CREATE POLICY "Project members can view tasks" ON project_tasks
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE creator_id = auth.uid() 
      OR id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Project creators can manage tasks" ON project_tasks
  FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE creator_id = auth.uid())
  );

CREATE POLICY "Assigned users can update task status" ON project_tasks
  FOR UPDATE USING (assigned_to = auth.uid());

-- RLS Policies for project_discussions
CREATE POLICY "Project members can view discussions" ON project_discussions
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE creator_id = auth.uid() 
      OR id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Project members can create discussions" ON project_discussions
  FOR INSERT WITH CHECK (
    participant_id = auth.uid() AND
    project_id IN (
      SELECT id FROM projects 
      WHERE creator_id = auth.uid() 
      OR id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
    )
  );

-- RLS Policies for project_reviews
CREATE POLICY "Project creators can manage reviews" ON project_reviews
  FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE creator_id = auth.uid())
  );

CREATE POLICY "Participants can view their reviews" ON project_reviews
  FOR SELECT USING (participant_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_assigned_to ON project_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_project_discussions_project_id ON project_discussions(project_id);
CREATE INDEX IF NOT EXISTS idx_project_reviews_project_id ON project_reviews(project_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_project_tasks_updated_at
    BEFORE UPDATE ON project_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_discussions_updated_at
    BEFORE UPDATE ON project_discussions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_reviews_updated_at
    BEFORE UPDATE ON project_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();