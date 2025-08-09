-- Fix user registration issues by ensuring proper constraints and debugging

-- First, ensure user_roles table has the correct unique constraint
DROP INDEX IF EXISTS user_roles_user_id_role_idx;
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_user_id_role_idx ON public.user_roles (user_id, role);

-- Add debug logging and fix the trigger function
DROP FUNCTION IF EXISTS public.handle_new_user_application() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  user_name TEXT;
  user_role_val TEXT;
BEGIN
  -- Debug logging
  RAISE LOG 'New user signup: ID=%, Email=%, Role=%', NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'role';
  
  -- Determine user name with triple fallback
  user_name := COALESCE(
    NEW.raw_user_meta_data ->> 'name', 
    NEW.raw_user_meta_data ->> 'firstName' || ' ' || NEW.raw_user_meta_data ->> 'lastName',
    NEW.email,
    'User'
  );
  
  -- Determine role
  user_role_val := COALESCE(NEW.raw_user_meta_data ->> 'role', 'student');
  
  RAISE LOG 'Computed user_name=%, user_role=%', user_name, user_role_val;
  
  -- Only create application if user is not admin
  IF user_role_val != 'admin' THEN
    -- Create user application
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
      user_name,
      NEW.email,
      NEW.raw_user_meta_data ->> 'phone',
      COALESCE(
        NEW.raw_user_meta_data ->> 'organizationName',
        NEW.raw_user_meta_data ->> 'institutionName',
        NEW.raw_user_meta_data ->> 'organization'
      ),
      NEW.raw_user_meta_data ->> 'department',
      NEW.raw_user_meta_data ->> 'groupNumber',
      user_role_val,
      'pending',
      'signup',
      now()
    );
    
    RAISE LOG 'User application created for user %', NEW.id;

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
      user_name,
      NEW.raw_user_meta_data ->> 'firstName',
      NEW.raw_user_meta_data ->> 'lastName',
      COALESCE(
        NEW.raw_user_meta_data ->> 'organizationName',
        NEW.raw_user_meta_data ->> 'institutionName',
        NEW.raw_user_meta_data ->> 'organization'
      ),
      user_role_val::user_role,
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
      name = COALESCE(EXCLUDED.name, 'User'),
      organization = EXCLUDED.organization,
      role = EXCLUDED.role,
      group_number = EXCLUDED.group_number,
      phone = EXCLUDED.phone,
      department = EXCLUDED.department,
      address = EXCLUDED.address,
      status = 'pending',
      updated_at = now();
      
    RAISE LOG 'Profile created for user %', NEW.id;

    -- Create user role record
    INSERT INTO public.user_roles (
      user_id,
      role
    ) VALUES (
      NEW.id,
      user_role_val::user_role
    ) ON CONFLICT (user_id, role) DO UPDATE SET
      updated_at = now();
      
    RAISE LOG 'User role created for user % with role %', NEW.id, user_role_val;
  ELSE
    RAISE LOG 'Admin user %, skipping application creation', NEW.id;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user_application for user %: %', NEW.id, SQLERRM;
    RAISE;
END;
$function$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_application();

-- Ensure RLS policies allow new user creation
-- Update profiles RLS to allow self-insert during signup
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Update user_roles RLS to allow self-insert during signup  
DROP POLICY IF EXISTS "Users can insert own roles" ON public.user_roles;
CREATE POLICY "Users can insert own roles" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update user_applications RLS to allow self-insert during signup
DROP POLICY IF EXISTS "Users can insert own application" ON public.user_applications;
CREATE POLICY "Users can insert own application" ON public.user_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);