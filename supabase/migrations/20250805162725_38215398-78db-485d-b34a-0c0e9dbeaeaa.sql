-- Create access code status enum
CREATE TYPE access_code_status AS ENUM ('active', 'inactive', 'expired', 'exhausted');

-- Create partner access codes table
CREATE TABLE public.partner_access_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL,
  module_id UUID,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Time settings
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  activity_duration_minutes INTEGER NOT NULL DEFAULT 60,
  
  -- Usage settings
  max_uses INTEGER NOT NULL DEFAULT 1,
  current_uses INTEGER NOT NULL DEFAULT 0,
  
  -- Status and controls
  status access_code_status NOT NULL DEFAULT 'active',
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_max_uses CHECK (max_uses > 0),
  CONSTRAINT valid_current_uses CHECK (current_uses >= 0),
  CONSTRAINT valid_duration CHECK (activity_duration_minutes > 0),
  CONSTRAINT current_uses_not_exceed_max CHECK (current_uses <= max_uses)
);

-- Create access code usage logs table
CREATE TABLE public.partner_access_code_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  access_code_id UUID NOT NULL REFERENCES public.partner_access_codes(id) ON DELETE CASCADE,
  user_id UUID,
  module_id UUID,
  
  -- Usage details
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_duration_minutes INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  
  -- Session tracking
  session_started_at TIMESTAMP WITH TIME ZONE,
  session_ended_at TIMESTAMP WITH TIME ZONE,
  
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.partner_access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_access_code_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for partner_access_codes
CREATE POLICY "Admins can manage all access codes"
ON public.partner_access_codes FOR ALL
USING (is_admin_or_instructor(auth.uid()));

CREATE POLICY "Partners can manage their own access codes"
ON public.partner_access_codes FOR ALL
USING (partner_id = auth.uid());

CREATE POLICY "Anyone can view active access codes for validation"
ON public.partner_access_codes FOR SELECT
USING (is_active = true AND status = 'active' AND expires_at > now());

-- Create policies for partner_access_code_usage
CREATE POLICY "Admins can view all usage logs"
ON public.partner_access_code_usage FOR SELECT
USING (is_admin_or_instructor(auth.uid()));

CREATE POLICY "Partners can view usage logs for their codes"
ON public.partner_access_code_usage FOR SELECT
USING (
  access_code_id IN (
    SELECT id FROM public.partner_access_codes 
    WHERE partner_id = auth.uid()
  )
);

CREATE POLICY "System can insert usage logs"
ON public.partner_access_code_usage FOR INSERT
WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_partner_access_codes_updated_at
BEFORE UPDATE ON public.partner_access_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate unique access code
CREATE OR REPLACE FUNCTION public.generate_access_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    new_code := UPPER(SUBSTRING(md5(random()::text || clock_timestamp()::text) FROM 1 FOR 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM partner_access_codes WHERE code = new_code) INTO code_exists;
    
    -- Exit loop if code is unique
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_code;
END;
$$;

-- Create function to validate and use access code
CREATE OR REPLACE FUNCTION public.use_access_code(
  p_code TEXT,
  p_user_id UUID DEFAULT NULL,
  p_module_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  access_code_record RECORD;
  result JSONB;
BEGIN
  -- Get access code details
  SELECT * INTO access_code_record
  FROM partner_access_codes
  WHERE code = p_code AND is_active = true;
  
  -- Check if code exists
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Code not found or inactive');
  END IF;
  
  -- Check if code is expired
  IF access_code_record.expires_at <= now() THEN
    UPDATE partner_access_codes 
    SET status = 'expired' 
    WHERE id = access_code_record.id;
    
    RETURN jsonb_build_object('success', false, 'error', 'Code has expired');
  END IF;
  
  -- Check if code is exhausted
  IF access_code_record.current_uses >= access_code_record.max_uses THEN
    UPDATE partner_access_codes 
    SET status = 'exhausted' 
    WHERE id = access_code_record.id;
    
    RETURN jsonb_build_object('success', false, 'error', 'Code usage limit exceeded');
  END IF;
  
  -- Check module access if specified
  IF access_code_record.module_id IS NOT NULL AND p_module_id IS NOT NULL THEN
    IF access_code_record.module_id != p_module_id THEN
      RETURN jsonb_build_object('success', false, 'error', 'Code not valid for this module');
    END IF;
  END IF;
  
  -- Update usage count
  UPDATE partner_access_codes 
  SET 
    current_uses = current_uses + 1,
    updated_at = now()
  WHERE id = access_code_record.id;
  
  -- Log usage
  INSERT INTO partner_access_code_usage (
    access_code_id, user_id, module_id, session_started_at
  ) VALUES (
    access_code_record.id, p_user_id, COALESCE(p_module_id, access_code_record.module_id), now()
  );
  
  -- Return success with session details
  RETURN jsonb_build_object(
    'success', true,
    'access_code_id', access_code_record.id,
    'partner_id', access_code_record.partner_id,
    'module_id', COALESCE(p_module_id, access_code_record.module_id),
    'activity_duration_minutes', access_code_record.activity_duration_minutes,
    'remaining_uses', access_code_record.max_uses - access_code_record.current_uses - 1
  );
END;
$$;

-- Create function to check code status
CREATE OR REPLACE FUNCTION public.check_access_code_status(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  access_code_record RECORD;
BEGIN
  SELECT * INTO access_code_record
  FROM partner_access_codes
  WHERE code = p_code;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('exists', false);
  END IF;
  
  RETURN jsonb_build_object(
    'exists', true,
    'is_active', access_code_record.is_active,
    'status', access_code_record.status,
    'expires_at', access_code_record.expires_at,
    'remaining_uses', access_code_record.max_uses - access_code_record.current_uses,
    'activity_duration_minutes', access_code_record.activity_duration_minutes
  );
END;
$$;