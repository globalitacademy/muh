
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface InstructorAnalytics {
  totalCourses: number;
  totalStudents: number;
  averageRating: number;
  completionRate: number;
  monthlyEnrollments: number[];
  coursePerformance: {
    courseId: string;
    title: string;
    studentsCount: number;
    averageProgress: number;
    completionRate: number;
  }[];
}

export const useInstructorAnalytics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['instructorAnalytics', user?.id],
    queryFn: async (): Promise<InstructorAnalytics> => {
      if (!user) {
        return {
          totalCourses: 0,
          totalStudents: 0,
          averageRating: 0,
          completionRate: 0,
          monthlyEnrollments: [],
          coursePerformance: [],
        };
      }

      const userEmail = user.email;

      // Get instructor courses
      const { data: courses, error: coursesError } = await supabase
        .from('modules')
        .select('*')
        .eq('instructor', userEmail)
        .eq('is_active', true);

      if (coursesError) throw coursesError;

      // Get enrollments for instructor courses
      const courseIds = courses?.map(c => c.id) || [];
      
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('*')
        .in('module_id', courseIds);

      if (enrollmentsError) throw enrollmentsError;

      const totalCourses = courses?.length || 0;
      const totalStudents = enrollments?.length || 0;
      const completedStudents = enrollments?.filter(e => e.completed_at).length || 0;
      const completionRate = totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0;
      const averageRating = courses?.reduce((sum, course) => sum + (course.rating || 0), 0) / totalCourses || 0;

      // Calculate course performance
      const coursePerformance = courses?.map(course => {
        const courseEnrollments = enrollments?.filter(e => e.module_id === course.id) || [];
        const averageProgress = courseEnrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / courseEnrollments.length || 0;
        const courseCompletionRate = courseEnrollments.filter(e => e.completed_at).length / courseEnrollments.length * 100 || 0;

        return {
          courseId: course.id,
          title: course.title,
          studentsCount: courseEnrollments.length,
          averageProgress,
          completionRate: courseCompletionRate,
        };
      }) || [];

      return {
        totalCourses,
        totalStudents,
        averageRating,
        completionRate,
        monthlyEnrollments: [12, 19, 15, 28, 24, 18, 22, 31, 25, 20, 17, 29],
        coursePerformance,
      };
    },
    enabled: !!user,
  });
};
