
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface InstructorStudent {
  id: string;
  user_id: string;
  module_id: string;
  enrolled_at: string;
  progress_percentage: number;
  completed_at?: string;
  profiles?: {
    name: string;
    email: string;
    group_number?: string;
  };
  modules?: {
    title: string;
  };
}

export const useInstructorStudents = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['instructorStudents', user?.id],
    queryFn: async (): Promise<InstructorStudent[]> => {
      if (!user) return [];

      const userEmail = user.email;
      console.log('Fetching students for instructor:', userEmail);

      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          profiles!enrollments_user_id_fkey (
            name,
            group_number
          ),
          modules!enrollments_module_id_fkey (
            title,
            instructor
          )
        `)
        .eq('modules.instructor', userEmail)
        .order('enrolled_at', { ascending: false });

      if (error) {
        console.error('Error fetching instructor students:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });
};
