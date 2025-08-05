-- Insert sample USUM25 access code for demonstration
INSERT INTO public.partner_access_codes (
  partner_id,
  code,
  name,
  description,
  expires_at,
  activity_duration_minutes,
  max_uses,
  current_uses,
  status,
  is_active
) VALUES (
  (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1),
  'USUM25',
  'USUM25 Demo Code',
  'Demonstration access code for testing partner access functionality',
  now() + interval '30 days',
  60,
  100,
  0,
  'active',
  true
) ON CONFLICT (code) DO NOTHING;