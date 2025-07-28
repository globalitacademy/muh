-- Fix column name inconsistency and create missing profile
-- First rename date_of_birth to birth_date to match the code
ALTER TABLE public.profiles 
RENAME COLUMN date_of_birth TO birth_date;

-- Create profile for the admin user if it doesn't exist
INSERT INTO public.profiles (
  id, 
  name, 
  role, 
  status, 
  language_preference,
  created_at, 
  updated_at
)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'name', email) as name,
  'admin'::user_role,
  'active',
  'hy',
  now(),
  now()
FROM auth.users 
WHERE email = 'gitedu@bk.ru'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin'::user_role,
  status = 'active',
  updated_at = now();

-- Add missing columns that might be referenced in the code
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cover_photo_url text,
ADD COLUMN IF NOT EXISTS field_of_study text,
ADD COLUMN IF NOT EXISTS personal_website text,
ADD COLUMN IF NOT EXISTS linkedin_url text,
ADD COLUMN IF NOT EXISTS is_visible_to_employers boolean DEFAULT false;

-- Update RLS policies to make sure admins can manage profiles
DROP POLICY IF EXISTS "Users can create own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles; 
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create more comprehensive RLS policies
CREATE POLICY "Users can create own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id OR is_admin_or_instructor(auth.uid()));

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id OR is_admin_or_instructor(auth.uid()));

CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (is_admin_or_instructor(auth.uid()));