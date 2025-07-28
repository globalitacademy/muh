-- Create certificate_templates table
CREATE TABLE IF NOT EXISTS public.certificate_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  template_type text NOT NULL DEFAULT 'completion',
  design_config jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on certificate_templates
ALTER TABLE public.certificate_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for certificate templates
CREATE POLICY "Admins can manage certificate templates" 
ON public.certificate_templates 
FOR ALL 
USING (is_admin_or_instructor(auth.uid()));

CREATE POLICY "Anyone can view active certificate templates" 
ON public.certificate_templates 
FOR SELECT 
USING (is_active = true);

-- Add foreign key constraints to existing tables
ALTER TABLE public.module_instructors 
ADD CONSTRAINT fk_module_instructors_module_id 
FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;

ALTER TABLE public.module_instructors 
ADD CONSTRAINT fk_module_instructors_instructor_id 
FOREIGN KEY (instructor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.instructor_groups 
ADD CONSTRAINT fk_instructor_groups_instructor_id 
FOREIGN KEY (instructor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Create trigger for updated_at on certificate_templates
CREATE TRIGGER update_certificate_templates_updated_at
BEFORE UPDATE ON public.certificate_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create certificates table for issued certificates
CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  module_id uuid,
  template_id uuid,
  certificate_data jsonb DEFAULT '{}',
  issued_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_certificates_user_id FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_certificates_module_id FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE SET NULL,
  CONSTRAINT fk_certificates_template_id FOREIGN KEY (template_id) REFERENCES public.certificate_templates(id) ON DELETE SET NULL
);

-- Enable RLS on certificates
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create policies for certificates
CREATE POLICY "Users can view own certificates" 
ON public.certificates 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all certificates" 
ON public.certificates 
FOR ALL 
USING (is_admin_or_instructor(auth.uid()));

-- Create trigger for updated_at on certificates
CREATE TRIGGER update_certificates_updated_at
BEFORE UPDATE ON public.certificates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();