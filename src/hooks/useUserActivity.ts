
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'study' | 'project' | 'exam' | 'assignment';
  title: string;
  description: string | null;
  duration_minutes: number | null;
  date: string;
  created_at: string;
}

export const useUserActivity = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userActivity', user?.id],
    queryFn: async (): Promise<UserActivity[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return data as UserActivity[] || [];
    },
    enabled: !!user,
  });
};

export const useAddUserActivity = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (activityData: Omit<UserActivity, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_activity')
        .insert({
          ...activityData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userActivity'] });
    },
  });
};
