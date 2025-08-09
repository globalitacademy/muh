-- Create the user_role enum type first
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'instructor', 'student', 'employer', 'partner');
    END IF;
END $$;