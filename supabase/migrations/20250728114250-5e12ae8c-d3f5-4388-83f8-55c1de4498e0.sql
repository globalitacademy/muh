-- Find and update the user role to admin
-- First, let's find the user by email from auth.users and update profiles
UPDATE public.profiles 
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'gitedu@bk.ru' 
  LIMIT 1
);

-- Add or update the user_roles entry
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::user_role
FROM auth.users 
WHERE email = 'gitedu@bk.ru'
ON CONFLICT (user_id, role) DO UPDATE SET
  updated_at = now();

-- Make sure we also remove any conflicting roles
DELETE FROM public.user_roles 
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'gitedu@bk.ru' 
  LIMIT 1
) AND role != 'admin';