
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  project_url: string | null;
  github_url: string | null;
  files_url: string | null;
  start_date: string | null;
  end_date: string | null;
  is_team_project: boolean | null;
  is_thesis_project: boolean | null;
  instructor_review: string | null;
  employer_review: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export const usePortfolios = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['portfolios', user?.id],
    queryFn: async (): Promise<Portfolio[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useAddPortfolio = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (portfolioData: Omit<Portfolio, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('portfolios')
        .insert({
          ...portfolioData,
          user_id: user.id,
        })
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
        .update({
          ...portfolioData,
          updated_at: new Date().toISOString(),
        })
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
