
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  activeUsers: number;
  completedCourses: number;
  dailyActivity: number;
  averageRating: number;
  completionRate: number;
  satisfaction: number;
  averageStudyTime: string;
  monthlyEnrollments: number[];
  courseCompletions: number[];
  userGrowth: number[];
}

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: async (): Promise<AnalyticsData> => {
      console.log('Fetching admin analytics...');

      // Get active users count
      const { count: activeUsersCount, error: activeUsersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (activeUsersError) throw activeUsersError;

      // Get completed enrollments
      const { count: completedCoursesCount, error: completedCoursesError } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .not('completed_at', 'is', null);

      if (completedCoursesError) throw completedCoursesError;

      // Get total enrollments for completion rate calculation
      const { count: totalEnrollmentsCount, error: totalEnrollmentsError } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true });

      if (totalEnrollmentsError) throw totalEnrollmentsError;

      // Get average rating from modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('rating')
        .not('rating', 'is', null);

      if (modulesError) throw modulesError;

      const averageRating = modulesData && modulesData.length > 0 
        ? modulesData.reduce((sum, module) => sum + (module.rating || 0), 0) / modulesData.length
        : 0;

      // Calculate completion rate
      const completionRate = totalEnrollmentsCount && totalEnrollmentsCount > 0
        ? ((completedCoursesCount || 0) / totalEnrollmentsCount) * 100
        : 0;

      // Generate mock data for charts (these would need more complex queries for real data)
      const monthlyEnrollments = Array.from({ length: 12 }, () => Math.floor(Math.random() * 50) + 10);
      const courseCompletions = Array.from({ length: 12 }, () => Math.floor(Math.random() * 30) + 5);
      const userGrowth = Array.from({ length: 12 }, () => Math.floor(Math.random() * 20) + 5);

      return {
        activeUsers: activeUsersCount || 0,
        completedCourses: completedCoursesCount || 0,
        dailyActivity: Math.floor(completionRate), // Using completion rate as daily activity proxy
        averageRating: Number(averageRating.toFixed(1)),
        completionRate: Number(completionRate.toFixed(0)),
        satisfaction: Math.floor(averageRating * 20), // Convert 5-star rating to percentage
        averageStudyTime: '2.3ժ', // This would need user session tracking
        monthlyEnrollments,
        courseCompletions,
        userGrowth,
      };
    },
  });
};
