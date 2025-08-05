-- Create enum for job posting types
CREATE TYPE job_posting_type AS ENUM ('job', 'internship', 'project');

-- Create enum for application status
CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');

-- Create job_postings table
CREATE TABLE public.job_postings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  salary_range TEXT,
  location TEXT,
  is_remote BOOLEAN NOT NULL DEFAULT false,
  posting_type job_posting_type NOT NULL DEFAULT 'job',
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_posting_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL,
  cover_letter TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_posting_id, applicant_id)
);

-- Enable RLS
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_postings
CREATE POLICY "Anyone can view active job postings" 
ON public.job_postings 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Employers can manage their job postings" 
ON public.job_postings 
FOR ALL 
USING (employer_id = auth.uid());

CREATE POLICY "Employers can create job postings" 
ON public.job_postings 
FOR INSERT 
WITH CHECK (employer_id = auth.uid());

-- RLS Policies for job_applications
CREATE POLICY "Students can view their own applications" 
ON public.job_applications 
FOR SELECT 
USING (applicant_id = auth.uid());

CREATE POLICY "Students can create applications" 
ON public.job_applications 
FOR INSERT 
WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Employers can view applications for their postings" 
ON public.job_applications 
FOR SELECT 
USING (job_posting_id IN (
  SELECT id FROM public.job_postings WHERE employer_id = auth.uid()
));

CREATE POLICY "Employers can update applications for their postings" 
ON public.job_applications 
FOR UPDATE 
USING (job_posting_id IN (
  SELECT id FROM public.job_postings WHERE employer_id = auth.uid()
));

-- Add triggers for updated_at
CREATE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();