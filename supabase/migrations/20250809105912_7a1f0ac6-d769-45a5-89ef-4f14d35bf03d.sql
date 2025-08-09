-- Test actual signup trigger by checking what user_role enum values exist and fixing the mismatch
-- Fix the enum to include correct values
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'instructor';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin'; 
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'student';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'employer';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'partner';

-- Check if trigger exists
SELECT trigger_name FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';