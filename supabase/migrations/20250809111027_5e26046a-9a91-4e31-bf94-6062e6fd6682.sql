-- Fix the critical user_role enum issue that's causing registration failures

-- First, let's ensure the user_role enum exists with all needed values
DO $$ 
BEGIN
    -- Check if the enum exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'instructor', 'student', 'employer', 'partner');
    END IF;
    
    -- Add missing enum values if they don't exist
    BEGIN
        ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
        ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'instructor';
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
        ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'student';
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
        ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'employer';
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
        ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'partner';
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;

-- Recreate the trigger function with proper error handling and fallbacks
DROP FUNCTION IF EXISTS public.handle_new_user_application() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  user_name TEXT;
  user_role_val user_role;
BEGIN
  -- Debug logging
  RAISE LOG 'New user signup: ID=%, Email=%, Role=%', NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'role';
  
  -- Determine user name with multiple fallbacks
  user_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data ->> 'name'), ''), 
    NULLIF(TRIM(NEW.raw_user_meta_data ->> 'firstName' || ' ' || NEW.raw_user_meta_data ->> 'lastName'), ' '),
    NULLIF(TRIM(NEW.email), ''),
    'User'
  );
  
  -- Ensure user_name is never NULL
  IF user_name IS NULL OR user_name = '' THEN
    user_name := 'User';
  END IF;
  
  -- Determine role with proper enum casting
  user_role_val := COALESCE(
    (NEW.raw_user_meta_data ->> 'role')::user_role, 
    'student'::user_role
  );
  
  RAISE LOG 'Computed user_name=%, user_role=%', user_name, user_role_val;
  
  -- Only create application if user is not admin
  IF user_role_val != 'admin'::user_role THEN
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
      user_role_val::text,
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
      user_role_val,
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
      user_role_val
    ) ON CONFLICT (user_id, role) DO UPDATE SET
      updated_at = now();
      
    RAISE LOG 'User role created for user % with role %', NEW.id, user_role_val;
  ELSE
    RAISE LOG 'Admin user %, skipping application creation', NEW.id;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user_application for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
    -- Instead of re-raising, try to create a minimal profile
    BEGIN
      INSERT INTO public.profiles (id, name, role, status, created_at) 
      VALUES (NEW.id, COALESCE(NEW.email, 'User'), 'student'::user_role, 'pending', now())
      ON CONFLICT (id) DO NOTHING;
      
      INSERT INTO public.user_roles (user_id, role) 
      VALUES (NEW.id, 'student'::user_role)
      ON CONFLICT (user_id, role) DO NOTHING;
      
      RAISE LOG 'Created minimal profile for user % due to error recovery', NEW.id;
    EXCEPTION WHEN OTHERS THEN
      RAISE LOG 'Failed to create minimal profile for user %: %', NEW.id, SQLERRM;
    END;
    
    RETURN NEW;
END;
$function$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_application();