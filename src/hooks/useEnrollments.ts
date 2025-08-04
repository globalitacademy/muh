
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface Enrollment {
  id: string;
  user_id: string;
  module_id: string;
  enrolled_at: string;
  completed_at?: string;
  progress_percentage?: number;
  modules?: {
    title: string;
    description?: string;
    difficulty_level: string;
    instructor: string;
  };
}

export const useEnrollments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: async (): Promise<Enrollment[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          modules (
            title,
            description,
            difficulty_level,
            instructor
          )
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
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
