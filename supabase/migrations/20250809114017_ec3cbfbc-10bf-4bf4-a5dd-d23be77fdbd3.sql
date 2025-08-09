-- Remove admin role from the employer user
DELETE FROM public.user_roles 
WHERE user_id = 'b3eb3b31-6ea4-4c11-ac11-24f867c5f59d' 
AND role = 'admin';

-- Ensure the user has employer role
INSERT INTO public.user_roles (user_id, role) 
VALUES ('b3eb3b31-6ea4-4c11-ac11-24f867c5f59d', 'employer'::user_role)
ON CONFLICT (user_id, role) DO NOTHING;