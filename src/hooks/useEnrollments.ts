
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  return useQuery({
    queryKey: ['enrollments'],
    queryFn: async (): Promise<Enrollment[]> => {
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
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};
