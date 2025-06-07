
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Enrollment } from '@/types/database';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useEnrollments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: async (): Promise<Enrollment[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching enrollments:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });
};

export const useEnrollModule = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (moduleId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          module_id: moduleId,
          progress_percentage: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      toast.success('Հաջողությամբ գրանցվեցիք դասընթացին');
    },
    onError: (error: any) => {
      console.error('Error enrolling:', error);
      toast.error('Սխալ է տեղի ունեցել գրանցման ժամանակ');
    },
  });
};
