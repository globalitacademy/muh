import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ReportStats {
  totalUsers: number;
  totalModules: number;
  totalEnrollments: number;
  totalApplications: number;
  recentCertificates: number;
  monthlyActivity: number;
}

export const useReportsData = () => {
  return useQuery({
    queryKey: ['reports-data'],
    queryFn: async (): Promise<ReportStats> => {
      // Get total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total modules count
      const { count: totalModules } = await supabase
        .from('modules')
        .select('*', { count: 'exact', head: true });

      // Get total enrollments count
      const { count: totalEnrollments } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true });

      // Get total applications count
      const { count: totalApplications } = await supabase
        .from('user_applications')
        .select('*', { count: 'exact', head: true });

      // Get recent certificates (this month)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: recentCertificates } = await supabase
        .from('certificates')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      // Get monthly activity (recent enrollments)
      const { count: monthlyActivity } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .gte('enrolled_at', startOfMonth.toISOString());

      return {
        totalUsers: totalUsers || 0,
        totalModules: totalModules || 0,
        totalEnrollments: totalEnrollments || 0,
        totalApplications: totalApplications || 0,
        recentCertificates: recentCertificates || 0,
        monthlyActivity: monthlyActivity || 0,
      };
    },
  });
};