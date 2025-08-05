-- Update check constraint to include 'partner' role
ALTER TABLE user_applications 
DROP CONSTRAINT user_applications_role_check;

ALTER TABLE user_applications 
ADD CONSTRAINT user_applications_role_check 
CHECK (role = ANY (ARRAY['student'::text, 'instructor'::text, 'employer'::text, 'admin'::text, 'partner'::text]));

-- Now insert applications for existing pending users
INSERT INTO user_applications (
  user_id,
  name,
  email,
  role,
  status,
  application_type,
  submitted_at
)
SELECT 
  p.id,
  p.name,
  COALESCE((SELECT email FROM auth.users WHERE id = p.id), 'unknown@email.com'),
  p.role::text,
  'pending',
  'signup',
  p.created_at
FROM profiles p
WHERE p.status = 'pending' 
AND p.id NOT IN (SELECT user_id FROM user_applications WHERE user_id IS NOT NULL);