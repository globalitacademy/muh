-- Create the missing project_discussions table with correct column names
DROP TABLE IF EXISTS project_discussions;
CREATE TABLE project_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  recipient_id UUID,
  files JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the project_reviews table
DROP TABLE IF EXISTS project_reviews;
CREATE TABLE project_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL,
  reviewer_id UUID NOT NULL,
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 10),
  feedback TEXT,
  certificate_issued BOOLEAN DEFAULT FALSE,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE project_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for project_discussions
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

-- Create RLS policies for project_reviews
CREATE POLICY "Project creators can manage reviews" ON project_reviews
  FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE creator_id = auth.uid())
  );

CREATE POLICY "Participants can view their reviews" ON project_reviews
  FOR SELECT USING (participant_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_project_discussions_project_id ON project_discussions(project_id);
CREATE INDEX IF NOT EXISTS idx_project_reviews_project_id ON project_reviews(project_id);

-- Add triggers for updated_at
CREATE TRIGGER update_project_discussions_updated_at
    BEFORE UPDATE ON project_discussions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_reviews_updated_at
    BEFORE UPDATE ON project_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();