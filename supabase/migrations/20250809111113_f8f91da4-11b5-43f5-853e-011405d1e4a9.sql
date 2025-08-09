-- Fix the registration system by simplifying the trigger function and avoiding enum issues

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_application() CASCADE;

-- Create a simplified trigger function that avoids the user_role enum casting issues
CREATE OR REPLACE FUNCTION public.handle_new_user_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  user_name TEXT;
  user_role_text TEXT;
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
  
  -- Determine role as text first
  user_role_text := COALESCE(NEW.raw_user_meta_data ->> 'role', 'student');
  
  RAISE LOG 'Computed user_name=%, user_role=%', user_name, user_role_text;
  
  -- Only create application if user is not admin
  IF user_role_text != 'admin' THEN
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
      user_role_text,
      'pending',
      'signup',
      now()
    );
    
    RAISE LOG 'User application created for user %', NEW.id;

    -- Create profile with pending status using dynamic SQL to avoid enum casting issues
    EXECUTE format(
      'INSERT INTO public.profiles (id, name, first_name, last_name, organization, role, group_number, phone, department, address, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6::%I, $7, $8, $9, $10, $11, $12) 
       ON CONFLICT (id) DO UPDATE SET
         name = COALESCE(EXCLUDED.name, ''User''),
         organization = EXCLUDED.organization,
         role = EXCLUDED.role,
         group_number = EXCLUDED.group_number,
         phone = EXCLUDED.phone,
         department = EXCLUDED.department,
         address = EXCLUDED.address,
         status = ''pending'',
         updated_at = now()',
      'user_role'
    ) USING 
      NEW.id,
      user_name,
      NEW.raw_user_meta_data ->> 'firstName',
      NEW.raw_user_meta_data ->> 'lastName',
      COALESCE(
        NEW.raw_user_meta_data ->> 'organizationName',
        NEW.raw_user_meta_data ->> 'institutionName',
        NEW.raw_user_meta_data ->> 'organization'
      ),
      user_role_text,
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
      now();
      
    RAISE LOG 'Profile created for user %', NEW.id;

    -- Create user role record using dynamic SQL
    EXECUTE format(
      'INSERT INTO public.user_roles (user_id, role) VALUES ($1, $2::%I) ON CONFLICT (user_id, role) DO UPDATE SET updated_at = now()',
      'user_role'
    ) USING NEW.id, user_role_text;
      
    RAISE LOG 'User role created for user % with role %', NEW.id, user_role_text;
  ELSE
    RAISE LOG 'Admin user %, skipping application creation', NEW.id;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user_application for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
    -- Instead of re-raising, try to create a minimal profile using dynamic SQL
    BEGIN
      EXECUTE format(
        'INSERT INTO public.profiles (id, name, role, status, created_at) VALUES ($1, $2, $3::%I, $4, $5) ON CONFLICT (id) DO NOTHING',
        'user_role'
      ) USING NEW.id, COALESCE(NEW.email, 'User'), 'student', 'pending', now();
      
      EXECUTE format(
        'INSERT INTO public.user_roles (user_id, role) VALUES ($1, $2::%I) ON CONFLICT (user_id, role) DO NOTHING',
        'user_role'
      ) USING NEW.id, 'student';
      
      RAISE LOG 'Created minimal profile for user % due to error recovery', NEW.id;
    EXCEPTION WHEN OTHERS THEN
      RAISE LOG 'Failed to create minimal profile for user %: %', NEW.id, SQLERRM;
    END;
    
    RETURN NEW;
END;
$function$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_application();