
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

      // First get modules taught by this instructor
      const { data: instructorModules, error: modulesError } = await supabase
        .from('modules')
        .select('id')
        .eq('instructor', userEmail)
        .eq('is_active', true);

      if (modulesError) {
        console.error('Error fetching instructor modules:', modulesError);
        throw modulesError;
      }

      if (!instructorModules || instructorModules.length === 0) {
        return [];
      }

      const moduleIds = instructorModules.map(m => m.id);

      // Then get enrollments for those modules with student profiles
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          profiles!enrollments_user_id_fkey (
            name,
            group_number
          ),
          modules!enrollments_module_id_fkey (
            title
          )
        `)
        .in('module_id', moduleIds)
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
