
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  project_url?: string;
  github_url?: string;
  files_url?: string;
  is_team_project: boolean;
  is_thesis_project: boolean;
  instructor_review?: string;
  employer_review?: string;
  created_at: string;
  updated_at: string;
}

export const usePortfolios = () => {
  return useQuery({
    queryKey: ['portfolios'],
    queryFn: async (): Promise<Portfolio[]> => {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (portfolioData: Omit<Portfolio, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('portfolios')
        .insert([portfolioData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...portfolioData }: Partial<Portfolio> & { id: string }) => {
      const { data, error } = await supabase
        .from('portfolios')
        .update({ ...portfolioData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};
