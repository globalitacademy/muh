-- Add partner role to the user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'partner';

-- Create partner_institutions table for educational institutions
CREATE TABLE public.partner_institutions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id uuid NOT NULL,
  institution_name text NOT NULL,
  institution_type text DEFAULT 'educational',
  description text,
  logo_url text,
  website_url text,
  contact_email text,
  contact_phone text,
  address text,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on partner_institutions
ALTER TABLE public.partner_institutions ENABLE ROW LEVEL SECURITY;

-- RLS policies for partner_institutions
CREATE POLICY "Partners can manage their institution" 
ON public.partner_institutions 
FOR ALL 
USING (partner_id = auth.uid());

CREATE POLICY "Anyone can view active institutions" 
ON public.partner_institutions 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage all institutions" 
ON public.partner_institutions 
FOR ALL 
USING (is_admin_or_instructor(auth.uid()));

-- Create partner_courses table for private courses offered by partners
CREATE TABLE public.partner_courses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id uuid NOT NULL,
  institution_id uuid REFERENCES public.partner_institutions(id) ON DELETE CASCADE,
  title text NOT NULL,
  title_en text,
  title_ru text,
  description text,
  description_en text,
  description_ru text,
  course_type text DEFAULT 'private',
  duration_weeks integer DEFAULT 1,
  price numeric DEFAULT 0,
  max_students integer,
  current_students integer DEFAULT 0,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  application_deadline timestamp with time zone,
  requirements text,
  curriculum jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  status text DEFAULT 'draft',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on partner_courses
ALTER TABLE public.partner_courses ENABLE ROW LEVEL SECURITY;

-- RLS policies for partner_courses
CREATE POLICY "Partners can manage their courses" 
ON public.partner_courses 
FOR ALL 
USING (partner_id = auth.uid());

CREATE POLICY "Anyone can view active courses" 
ON public.partner_courses 
FOR SELECT 
USING (is_active = true AND status = 'published');

CREATE POLICY "Admins can manage all partner courses" 
ON public.partner_courses 
FOR ALL 
USING (is_admin_or_instructor(auth.uid()));

-- Create partner_course_enrollments table for student enrollments
CREATE TABLE public.partner_course_enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid REFERENCES public.partner_courses(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  partner_id uuid NOT NULL,
  enrollment_status text DEFAULT 'pending',
  enrolled_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(course_id, student_id)
);

-- Enable RLS on partner_course_enrollments
ALTER TABLE public.partner_course_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS policies for partner_course_enrollments
CREATE POLICY "Partners can manage enrollments for their courses" 
ON public.partner_course_enrollments 
FOR ALL 
USING (partner_id = auth.uid());

CREATE POLICY "Students can view their enrollments" 
ON public.partner_course_enrollments 
FOR SELECT 
USING (student_id = auth.uid());

CREATE POLICY "Students can create enrollments" 
ON public.partner_course_enrollments 
FOR INSERT 
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins can manage all enrollments" 
ON public.partner_course_enrollments 
FOR ALL 
USING (is_admin_or_instructor(auth.uid()));

-- Add triggers for updated_at columns
CREATE TRIGGER update_partner_institutions_updated_at
  BEFORE UPDATE ON public.partner_institutions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partner_courses_updated_at
  BEFORE UPDATE ON public.partner_courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partner_course_enrollments_updated_at
  BEFORE UPDATE ON public.partner_course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();