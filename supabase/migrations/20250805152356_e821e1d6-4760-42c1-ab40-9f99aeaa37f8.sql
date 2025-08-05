-- Update profiles table to have default 'pending' status for new users
UPDATE profiles SET status = 'pending' WHERE status = 'active' AND role != 'admin';

-- Create a trigger function to automatically create application record when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
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
    ) ON CONFLICT (user_id) DO UPDATE SET
      role = EXCLUDED.role;
  END IF;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user registrations
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_application();

-- Function to approve user application
CREATE OR REPLACE FUNCTION public.approve_user_application(application_id uuid, admin_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  app_record RECORD;
BEGIN
  -- Get application details
  SELECT * INTO app_record FROM public.user_applications WHERE id = application_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found';
  END IF;
  
  -- Update application status
  UPDATE public.user_applications 
  SET 
    status = 'approved',
    reviewed_at = now(),
    reviewed_by = admin_id,
    updated_at = now()
  WHERE id = application_id;
  
  -- Update profile status to active
  UPDATE public.profiles 
  SET 
    status = 'active',
    updated_at = now()
  WHERE id = app_record.user_id;
  
  -- Log the approval
  INSERT INTO public.admin_audit_logs (
    admin_id,
    target_user_id,
    action,
    details
  ) VALUES (
    admin_id,
    app_record.user_id,
    'application_approved',
    jsonb_build_object(
      'application_id', application_id,
      'user_role', app_record.role,
      'user_name', app_record.name
    )
  );
END;
$$;