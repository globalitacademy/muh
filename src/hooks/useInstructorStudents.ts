
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

      // Get enrollments for those modules
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('*')
        .in('module_id', moduleIds)
        .order('enrolled_at', { ascending: false });

      if (enrollmentsError) {
        console.error('Error fetching enrollments:', enrollmentsError);
        throw enrollmentsError;
      }

      if (!enrollments || enrollments.length === 0) {
        return [];
      }

      // Get user profiles for the enrolled students
      const userIds = enrollments.map(e => e.user_id).filter(Boolean);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, group_number')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Get module details
      const { data: modules, error: modulesDetailError } = await supabase
        .from('modules')
        .select('id, title')
        .in('id', moduleIds);

      if (modulesDetailError) {
        console.error('Error fetching module details:', modulesDetailError);
        throw modulesDetailError;
      }

      // Combine the data
      const result = enrollments.map(enrollment => ({
        ...enrollment,
        profiles: profiles?.find(p => p.id === enrollment.user_id) || null,
        modules: modules?.find(m => m.id === enrollment.module_id) || null,
      }));

      return result;
    },
    enabled: !!user,
  });
};
