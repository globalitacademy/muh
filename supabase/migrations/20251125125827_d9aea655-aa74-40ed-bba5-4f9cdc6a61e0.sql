-- Add content_type field to topics table to distinguish between video and PDF
ALTER TABLE topics 
ADD COLUMN IF NOT EXISTS content_type text DEFAULT 'video' CHECK (content_type IN ('video', 'pdf', 'none'));

COMMENT ON COLUMN topics.content_type IS 'Type of lesson content: video, pdf, or none';