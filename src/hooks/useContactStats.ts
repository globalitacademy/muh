
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useContactStats = () => {
  return useQuery({
    queryKey: ['contact-stats'],
    queryFn: async () => {
      // Use count queries for better performance instead of selecting all data
      const [studentsResult, modulesResult, instructorsResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'student'),
        supabase
          .from('modules')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'instructor'),
      ]);

      if (studentsResult.error) throw studentsResult.error;
      if (modulesResult.error) throw modulesResult.error;
      if (instructorsResult.error) throw instructorsResult.error;

      return {
        studentsCount: studentsResult.count || 0,
        modulesCount: modulesResult.count || 0,
        instructorsCount: instructorsResult.count || 0,
      };
    },
    // Defer this query to not block critical rendering path
    enabled: typeof window !== 'undefined',
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    // Add slight delay to ensure critical content loads first
    refetchOnMount: false, // Don't refetch on every mount
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};
