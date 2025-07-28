import { useQuery } from '@tanstack/react-query';

// Placeholder hook since portfolios table doesn't exist
interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  project_url?: string;
  github_url?: string;
  demo_url?: string;
  technologies: string[];
  images: string[];
  featured: boolean;
  is_public: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  // Add missing fields for compatibility
  files_url?: string[];
  start_date?: string;
  end_date?: string;
  is_team_project?: boolean;
  is_thesis_project?: boolean;
  instructor_review?: string;
  employer_review?: string;
  image_url?: string;
}

export const usePortfolios = () => {
  return useQuery({
    queryKey: ['portfolios'],
    queryFn: async (): Promise<Portfolio[]> => {
      // Return empty data since portfolios table doesn't exist
      return [];
    },
    enabled: false,
  });
};

export const useUserPortfolios = (userId?: string) => {
  return useQuery({
    queryKey: ['user-portfolios', userId],
    queryFn: async (): Promise<Portfolio[]> => {
      // Return empty data since portfolios table doesn't exist
      return [];
    },
    enabled: false,
  });
};

export const useCreatePortfolio = () => {
  return {
    mutate: async (portfolioData: any) => {
      console.log('Create portfolio:', portfolioData);
    },
    mutateAsync: async (portfolioData: any) => {
      console.log('Create portfolio async:', portfolioData);
    },
    isLoading: false,
    isPending: false,
  };
};

// Alias for compatibility
export const useAddPortfolio = useCreatePortfolio;

export const useUpdatePortfolio = () => {
  return {
    mutate: async (data: { id: string; updates: any }) => {
      console.log('Update portfolio:', data);
    },
    mutateAsync: async (data: { id: string; updates: any }) => {
      console.log('Update portfolio async:', data);
    },
    isLoading: false,
    isPending: false,
  };
};

export const useDeletePortfolio = () => {
  return {
    mutate: async (id: string) => {
      console.log('Delete portfolio:', id);
    },
    mutateAsync: async (id: string) => {
      console.log('Delete portfolio async:', id);
    },
    isLoading: false,
  };
};