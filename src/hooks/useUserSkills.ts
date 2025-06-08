
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserSkill {
  id: string;
  user_id: string;
  name: string;
  level: number;
  category: 'technical' | 'design' | 'business' | 'language';
  created_at: string;
  updated_at: string;
}

export const useUserSkills = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userSkills', user?.id],
    queryFn: async (): Promise<UserSkill[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useAddUserSkill = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (skillData: Omit<UserSkill, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_skills')
        .insert({
          ...skillData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSkills'] });
    },
  });
};

export const useUpdateUserSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...skillData }: Partial<UserSkill> & { id: string }) => {
      const { data, error } = await supabase
        .from('user_skills')
        .update({
          ...skillData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSkills'] });
    },
  });
};

export const useDeleteUserSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSkills'] });
    },
  });
};
