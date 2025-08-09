-- Add admin role for the current user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('b3eb3b31-6ea4-4c11-ac11-24f867c5f59d', 'admin'::user_role)
ON CONFLICT (user_id, role) DO NOTHING;