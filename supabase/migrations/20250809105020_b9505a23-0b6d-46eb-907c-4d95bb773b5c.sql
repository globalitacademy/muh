-- Create user_role enum type if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'instructor', 'student', 'employer', 'partner');
    END IF;
END
$$;

-- Ensure user_roles table exists with correct structure
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_roles table
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
    DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
    
    -- Create new policies
    CREATE POLICY "Users can view their own roles" ON public.user_roles
        FOR SELECT USING (user_id = auth.uid());
    
    CREATE POLICY "Admins can manage all roles" ON public.user_roles
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM public.user_roles ur 
                WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
            )
        );
END
$$;

-- Update the handle_new_user_application function to use the correct enum
CREATE OR REPLACE FUNCTION public.handle_new_user_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Only create application if user is not admin
  IF (NEW.raw_user_meta_data ->> 'role') != 'admin' THEN
    INSERT INTO public.user_applications (
      user_id,
      name,
      email,
      phone,
      organization,
      department,
      group_number,
      role,
      status,
      application_type,
      submitted_at
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
      NEW.email,
      NEW.raw_user_meta_data ->> 'phone',
      COALESCE(
        NEW.raw_user_meta_data ->> 'organizationName',
        NEW.raw_user_meta_data ->> 'institutionName',
        NEW.raw_user_meta_data ->> 'organization'
      ),
      NEW.raw_user_meta_data ->> 'department',
      NEW.raw_user_meta_data ->> 'groupNumber',
      COALESCE(NEW.raw_user_meta_data ->> 'role', 'student'),
      'pending',
      'signup',
      now()
    );

    -- Create profile with pending status
    INSERT INTO public.profiles (
      id,
      name,
      first_name,
      last_name,
      organization,
      role,
      group_number,
      phone,
      department,
      address,
      status,
      created_at
    ) VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'name',
      NEW.raw_user_meta_data ->> 'firstName',
      NEW.raw_user_meta_data ->> 'lastName',
      COALESCE(
        NEW.raw_user_meta_data ->> 'organizationName',
        NEW.raw_user_meta_data ->> 'institutionName',
        NEW.raw_user_meta_data ->> 'organization'
      ),
      COALESCE(NEW.raw_user_meta_data ->> 'role', 'student')::user_role,
      NEW.raw_user_meta_data ->> 'groupNumber',
      COALESCE(
        NEW.raw_user_meta_data ->> 'organizationPhone',
        NEW.raw_user_meta_data ->> 'institutionPhone',
        NEW.raw_user_meta_data ->> 'phone'
      ),
      NEW.raw_user_meta_data ->> 'department',
      COALESCE(
        NEW.raw_user_meta_data ->> 'organizationAddress',
        NEW.raw_user_meta_data ->> 'institutionAddress',
        NEW.raw_user_meta_data ->> 'address'
      ),
      'pending',
      now()
    ) ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      organization = EXCLUDED.organization,
      role = EXCLUDED.role,
      group_number = EXCLUDED.group_number,
      phone = EXCLUDED.phone,
      department = EXCLUDED.department,
      address = EXCLUDED.address,
      status = 'pending',
      updated_at = now();

    -- Create user role record
    INSERT INTO public.user_roles (
      user_id,
      role
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'role', 'student')::user_role
    ) ON CONFLICT (user_id, role) DO UPDATE SET
      role = EXCLUDED.role,
      updated_at = now();
  END IF;

  RETURN NEW;
END;
$function$;