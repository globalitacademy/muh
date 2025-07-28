-- Add missing values to existing enums
ALTER TYPE difficulty_level ADD VALUE IF NOT EXISTS 'beginner';
ALTER TYPE difficulty_level ADD VALUE IF NOT EXISTS 'intermediate';
ALTER TYPE difficulty_level ADD VALUE IF NOT EXISTS 'advanced';

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'student';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'guest';

-- Create missing enum types
DO $$ BEGIN
    CREATE TYPE public.module_status AS ENUM ('draft', 'active', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;