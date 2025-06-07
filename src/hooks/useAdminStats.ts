
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalModules: number;
  totalUsers: number;
  activeCourses: number;
  systemStatus: 'active' | 'maintenance' | 'error';
  totalEnrollments: number;
  totalInstructors: number;
  totalStudents: number;
  totalAdmins: number;
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async (): Promise<AdminStats> => {
      console.log('Fetching admin statistics...');

      // Get total modules
      const { count: modulesCount, error: modulesError } = await supabase
        .from('modules')
        .select('*', { count: 'exact', head: true });

      if (modulesError) {
        console.error('Error fetching modules count:', modulesError);
        throw modulesError;
      }

      // Get active modules
      const { count: activeModulesCount, error: activeModulesError } = await supabase
        .from('modules')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (activeModulesError) {
        console.error('Error fetching active modules count:', activeModulesError);
        throw activeModulesError;
      }

      // Get total users
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) {
        console.error('Error fetching users count:', usersError);
        throw usersError;
      }

      // Get total enrollments
      const { count: enrollmentsCount, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true });

      if (enrollmentsError) {
        console.error('Error fetching enrollments count:', enrollmentsError);
        throw enrollmentsError;
      }

      // Get instructors count
      const { count: instructorsCount, error: instructorsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'instructor');

      if (instructorsError) {
        console.error('Error fetching instructors count:', instructorsError);
        throw instructorsError;
      }

      // Get students count
      const { count: studentsCount, error: studentsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      if (studentsError) {
        console.error('Error fetching students count:', studentsError);
        throw studentsError;
      }

      // Get admins count
      const { count: adminsCount, error: adminsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      if (adminsError) {
        console.error('Error fetching admins count:', adminsError);
        throw adminsError;
      }

      const stats: AdminStats = {
        totalModules: modulesCount || 0,
        totalUsers: usersCount || 0,
        activeCourses: activeModulesCount || 0,
        systemStatus: 'active',
        totalEnrollments: enrollmentsCount || 0,
        totalInstructors: instructorsCount || 0,
        totalStudents: studentsCount || 0,
        totalAdmins: adminsCount || 0,
      };

      console.log('Admin stats fetched:', stats);
      return stats;
    },
  });
};
