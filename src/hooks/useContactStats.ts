
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useContactStats = () => {
  return useQuery({
    queryKey: ['contact-stats'],
    queryFn: async () => {
      // Get total active students count
      const { count: studentsCount, error: studentsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      if (studentsError) throw studentsError;

      // Get total modules count (representing courses/content available)
      const { count: modulesCount, error: modulesError } = await supabase
        .from('modules')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (modulesError) throw modulesError;

      // Get total instructors count
      const { count: instructorsCount, error: instructorsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'instructor');

      if (instructorsError) throw instructorsError;

      return {
        studentsCount: studentsCount || 0,
        modulesCount: modulesCount || 0,
        instructorsCount: instructorsCount || 0
      };
    }
  });
};
