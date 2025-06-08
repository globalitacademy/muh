
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserGoal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: 'academic' | 'career' | 'skill' | 'personal';
  priority: 'high' | 'medium' | 'low';
  deadline: string | null;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

export const useUserGoals = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userGoals', user?.id],
    queryFn: async (): Promise<UserGoal[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useAddUserGoal = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (goalData: Omit<UserGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_goals')
        .insert({
          ...goalData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGoals'] });
    },
  });
};

export const useUpdateUserGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...goalData }: Partial<UserGoal> & { id: string }) => {
      const { data, error } = await supabase
        .from('user_goals')
        .update({
          ...goalData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGoals'] });
    },
  });
};

export const useDeleteUserGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGoals'] });
    },
  });
};
