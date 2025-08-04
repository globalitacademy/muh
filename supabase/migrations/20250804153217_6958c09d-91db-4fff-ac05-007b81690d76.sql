-- Create user_applications table for managing user registration requests
CREATE TABLE public.user_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'instructor', 'employer', 'admin')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  application_type TEXT NOT NULL DEFAULT 'manual',
  rejection_reason TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.user_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for user_applications
CREATE POLICY "Admins can manage all applications"
ON public.user_applications
FOR ALL
USING (is_admin_or_instructor(auth.uid()));

CREATE POLICY "Users can view own applications"
ON public.user_applications
FOR SELECT
USING (auth.uid() = user_id OR is_admin_or_instructor(auth.uid()));

-- Create trigger for updating timestamp
CREATE TRIGGER update_user_applications_updated_at
BEFORE UPDATE ON public.user_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO public.user_applications (name, email, phone, organization, role, status) VALUES
('Անի Սարգսյան', 'ani.sargsyan@example.com', '+374 99 123 456', 'ԱՊՊԱ', 'student', 'pending'),
('Դավիթ Ղազարյան', 'davit.ghazaryan@example.com', '+374 77 987 654', 'IT Ընկերություն', 'instructor', 'pending'),
('Մարիամ Հակոբյան', 'mariam.hakobyan@example.com', '+374 94 555 333', 'Tech Solutions LLC', 'employer', 'approved'),
('Արամ Ավետիսյան', 'aram.avetisyan@example.com', '+374 91 777 888', '', 'student', 'rejected'),
('Լուսինե Մարտիրոսյան', 'lusine.martirosyan@example.com', '+374 98 444 222', 'Դիզայն Ստուդիո', 'instructor', 'approved');