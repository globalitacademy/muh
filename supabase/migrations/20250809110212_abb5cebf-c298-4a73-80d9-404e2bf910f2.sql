-- Check and fix the profiles table to make sure name column has proper default
-- Let's check current function content first and completely recreate it
DROP FUNCTION IF EXISTS public.handle_new_user_application() CASCADE;

-- Create the corrected function
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
      COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email, 'User'),
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
      COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email, 'User'), -- Triple fallback
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
      name = COALESCE(EXCLUDED.name, profiles.name, 'User'),
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

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_application();