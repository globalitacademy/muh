-- Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS group_number text,
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS language_preference text DEFAULT 'hy',
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS address text;

-- Add 'employer' to user_role enum
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'employer';

-- Create admin_audit_logs table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid NOT NULL,
  target_user_id uuid,
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on admin_audit_logs
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admin audit logs
CREATE POLICY "Admins can manage audit logs" 
ON public.admin_audit_logs 
FOR ALL 
USING (is_admin_or_instructor(auth.uid()));

-- Create instructor_groups table
CREATE TABLE IF NOT EXISTS public.instructor_groups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id uuid NOT NULL,
  group_number text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(instructor_id, group_number)
);

-- Enable RLS on instructor_groups
ALTER TABLE public.instructor_groups ENABLE ROW LEVEL SECURITY;

-- Create policies for instructor_groups
CREATE POLICY "Instructors can view own groups" 
ON public.instructor_groups 
FOR SELECT 
USING (instructor_id = auth.uid() OR is_admin_or_instructor(auth.uid()));

CREATE POLICY "Admins can manage instructor groups" 
ON public.instructor_groups 
FOR ALL 
USING (is_admin_or_instructor(auth.uid()));

-- Create module_instructors table
CREATE TABLE IF NOT EXISTS public.module_instructors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id uuid NOT NULL,
  instructor_id uuid NOT NULL,
  group_number text,
  is_primary boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(module_id, instructor_id)
);

-- Enable RLS on module_instructors
ALTER TABLE public.module_instructors ENABLE ROW LEVEL SECURITY;

-- Create policies for module_instructors
CREATE POLICY "Anyone can view module instructors" 
ON public.module_instructors 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage module instructors" 
ON public.module_instructors 
FOR ALL 
USING (is_admin_or_instructor(auth.uid()));

-- Create has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update profiles RLS policies to allow admins to view all profiles
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;

CREATE POLICY "Users can read own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id OR is_admin_or_instructor(auth.uid()));

-- Create trigger for updated_at on new tables
CREATE TRIGGER update_admin_audit_logs_updated_at
BEFORE UPDATE ON public.admin_audit_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_instructor_groups_updated_at
BEFORE UPDATE ON public.instructor_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_module_instructors_updated_at
BEFORE UPDATE ON public.module_instructors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();