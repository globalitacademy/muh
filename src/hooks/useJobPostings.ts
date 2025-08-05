import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface JobPosting {
  id: string;
  employer_id: string;
  title: string;
  description?: string;
  requirements?: string;
  salary_range?: string;
  location?: string;
  is_remote: boolean;
  posting_type: 'job' | 'internship' | 'project';
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    organization?: string;
  };
}

export interface JobApplication {
  id: string;
  job_posting_id: string;
  applicant_id: string;
  cover_letter?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  applied_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
  job_postings?: {
    title: string;
    description?: string;
    salary_range?: string;
    location?: string;
    profiles?: {
      name: string;
      organization?: string;
    };
  };
  profiles?: {
    name: string;
    organization?: string;
  };
}

export interface CreateJobPostingData {
  title: string;
  description?: string;
  requirements?: string;
  salary_range?: string;
  location?: string;
  is_remote: boolean;
  posting_type: 'job' | 'internship' | 'project';
  expires_at?: string;
}

export const useJobPostings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['job-postings'],
    queryFn: async (): Promise<JobPosting[]> => {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as JobPosting[];
    },
  });
};

export const useEmployerJobPostings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['employer-job-postings', user?.id],
    queryFn: async (): Promise<JobPosting[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useCreateJobPosting = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateJobPostingData) => {
      if (!user) throw new Error('User not authenticated');

      const { data: jobPosting, error } = await supabase
        .from('job_postings')
        .insert({
          ...data,
          employer_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return jobPosting;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
      queryClient.invalidateQueries({ queryKey: ['employer-job-postings'] });
      toast.success('Աշխատանքի առաջարկը հրապարակվել է հաջողությամբ');
    },
    onError: (error: any) => {
      console.error('Error creating job posting:', error);
      toast.error('Սխալ է տեղի ունեցել առաջարկը ստեղծելիս');
    },
  });
};

export const useJobApplications = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['job-applications', user?.id],
    queryFn: async (): Promise<JobApplication[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job_postings (
            title,
            description,
            salary_range,
            location,
            profiles!job_postings_employer_id_fkey (
              name,
              organization
            )
          ),
          profiles!job_applications_applicant_id_fkey (
            name,
            organization
          )
        `)
        .eq('applicant_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data as unknown as JobApplication[];
    },
    enabled: !!user,
  });
};

export const useEmployerApplications = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['employer-applications', user?.id],
    queryFn: async (): Promise<JobApplication[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job_postings!inner (
            title,
            description,
            salary_range,
            location,
            employer_id
          ),
          profiles!job_applications_applicant_id_fkey (
            name,
            organization
          )
        `)
        .eq('job_postings.employer_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data as unknown as JobApplication[];
    },
    enabled: !!user,
  });
};

export const useApplyToJob = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: { jobId: string; coverLetter: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: application, error } = await supabase
        .from('job_applications')
        .insert({
          job_posting_id: data.jobId,
          applicant_id: user.id,
          cover_letter: data.coverLetter,
        })
        .select()
        .single();

      if (error) throw error;
      return application;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      toast.success('Դիմումը հաջողությամբ ուղարկվել է');
    },
    onError: (error: any) => {
      console.error('Error applying to job:', error);
      if (error.code === '23505') {
        toast.error('Դուք արդեն դիմել եք այս առաջարկին');
      } else {
        toast.error('Սխալ է տեղի ունեցել դիմելիս');
      }
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: { applicationId: string; status: 'pending' | 'reviewed' | 'accepted' | 'rejected' }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: application, error } = await supabase
        .from('job_applications')
        .update({
          status: data.status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq('id', data.applicationId)
        .select()
        .single();

      if (error) throw error;
      return application;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-applications'] });
      toast.success('Դիմումի կարգավիճակը թարմացվել է');
    },
    onError: (error: any) => {
      console.error('Error updating application status:', error);
      toast.error('Սխալ է տեղի ունեցել կարգավիճակը թարմացնելիս');
    },
  });
};