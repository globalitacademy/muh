import { useQuery } from '@tanstack/react-query';

// Placeholder hook since job_postings table doesn't exist
interface JobPosting {
  id: string;
  employer_id: string;
  title: string;
  description?: string;
  requirements?: string;
  salary_range?: string;
  location?: string;
  is_remote: boolean;
  is_internship: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  profiles?: { // Add nested relation for compatibility
    name: string;
    organization?: string;
  };
}

interface JobApplication {
  id: string;
  job_posting_id: string;
  applicant_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  applied_at?: string; // Add missing field for compatibility
  job_postings?: { // Add nested relation for compatibility
    title: string;
    description?: string;
    salary_range?: string;
    location?: string;
    profiles?: {
      name: string;
      organization?: string;
    };
  };
}

export const useJobPostings = () => {
  return useQuery({
    queryKey: ['job-postings'],
    queryFn: async (): Promise<JobPosting[]> => {
      // Return empty data since job_postings table doesn't exist
      return [];
    },
    enabled: false,
  });
};

export const useActiveJobPostings = () => {
  return useQuery({
    queryKey: ['active-job-postings'],
    queryFn: async (): Promise<JobPosting[]> => {
      // Return empty data since job_postings table doesn't exist
      return [];
    },
    enabled: false,
  });
};

export const useJobApplications = () => {
  return useQuery({
    queryKey: ['job-applications'],
    queryFn: async (): Promise<JobApplication[]> => {
      // Return empty data since job_applications table doesn't exist
      return [];
    },
    enabled: false,
  });
};

export const useApplyToJob = () => {
  return {
    mutate: async (data: { jobId: string; coverLetter: string }) => {
      console.log('Apply to job:', data);
    },
    isLoading: false,
  };
};