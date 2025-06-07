
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface JobPosting {
  id: string;
  employer_id: string;
  title: string;
  description?: string;
  requirements?: string;
  location?: string;
  is_internship: boolean;
  is_active: boolean;
  created_at: string;
  profiles?: {
    name?: string;
    organization?: string;
  };
}

interface JobApplication {
  id: string;
  user_id: string;
  job_posting_id: string;
  status: 'pending' | 'rejected' | 'accepted';
  cover_letter?: string;
  applied_at: string;
  updated_at: string;
  job_postings?: JobPosting;
}

export const useJobPostings = () => {
  return useQuery({
    queryKey: ['jobPostings'],
    queryFn: async (): Promise<JobPosting[]> => {
      const { data, error } = await supabase
        .from('job_postings')
        .select(`
          *,
          profiles (
            name,
            organization
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useJobApplications = () => {
  return useQuery({
    queryKey: ['jobApplications'],
    queryFn: async (): Promise<JobApplication[]> => {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job_postings (
            *,
            profiles (
              name,
              organization
            )
          )
        `)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useApplyToJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ jobId, coverLetter }: { jobId: string; coverLetter: string }) => {
      const { data, error } = await supabase
        .from('job_applications')
        .insert([{
          job_posting_id: jobId,
          cover_letter: coverLetter,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobApplications'] });
    },
  });
};
