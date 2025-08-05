-- Create sample admin user if not exists and insert USUM25 access code
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get first admin user or create a placeholder partner_id
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE raw_user_meta_data->>'role' = 'admin' 
    LIMIT 1;
    
    -- If no admin found, use a placeholder UUID
    IF admin_user_id IS NULL THEN
        admin_user_id := gen_random_uuid();
    END IF;
    
    -- Insert the access code
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
        admin_user_id,
        'USUM25',
        'USUM25 Demo Code',
        'Demonstration access code for testing partner access functionality',
        now() + interval '30 days',
        60,
        100,
        0,
        'active',
        true
    ) ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        expires_at = EXCLUDED.expires_at,
        activity_duration_minutes = EXCLUDED.activity_duration_minutes,
        max_uses = EXCLUDED.max_uses,
        is_active = EXCLUDED.is_active,
        updated_at = now();
END $$;