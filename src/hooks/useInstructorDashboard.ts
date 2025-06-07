
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CourseStats {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  completionRate: number;
}

export interface StudentProgress {
  id: string;
  name: string;
  email: string;
  courseName: string;
  progress: number;
  enrolledDate: string;
  lastActivity: string;
  status: 'active' | 'completed' | 'inactive';
}

export interface CoursePerformance {
  id: string;
  title: string;
  students: number;
  completion: number;
  rating: number;
  revenue: number;
  trend: 'up' | 'down' | 'stable';
}

export const useInstructorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  return useQuery({
    queryKey: ['instructorDashboard', user?.id],
    queryFn: async () => {
      if (!user?.email) throw new Error('Instructor not authenticated');

      // Get instructor's courses
      const { data: courses, error: coursesError } = await supabase
        .from('modules')
        .select('*')
        .eq('instructor', user.email)
        .eq('is_active', true);

      if (coursesError) throw coursesError;

      const courseIds = courses?.map(c => c.id) || [];
      
      // Get enrollments for instructor's courses
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          *,
          profiles(name)
        `)
        .in('module_id', courseIds);

      if (enrollmentsError) throw enrollmentsError;

      // Calculate stats
      const stats: CourseStats = {
        totalCourses: courses?.length || 0,
        activeCourses: courses?.filter(c => c.is_active).length || 0,
        totalStudents: enrollments?.length || 0,
        totalRevenue: courses?.reduce((sum, course) => sum + (course.price * course.students_count), 0) || 0,
        averageRating: courses?.reduce((sum, course) => sum + (course.rating || 0), 0) / (courses?.length || 1),
        completionRate: enrollments?.filter(e => e.completed_at).length / (enrollments?.length || 1) * 100
      };

      // Format student progress
      const studentProgress: StudentProgress[] = enrollments?.map(enrollment => ({
        id: enrollment.id,
        name: enrollment.profiles?.name || 'Անանուն',
        email: enrollment.user_id,
        courseName: courses?.find(c => c.id === enrollment.module_id)?.title || '',
        progress: enrollment.progress_percentage || 0,
        enrolledDate: enrollment.enrolled_at,
        lastActivity: enrollment.enrolled_at,
        status: enrollment.completed_at ? 'completed' : enrollment.progress_percentage > 0 ? 'active' : 'inactive'
      })) || [];

      // Format course performance
      const coursePerformance: CoursePerformance[] = courses?.map(course => {
        const courseEnrollments = enrollments?.filter(e => e.module_id === course.id) || [];
        return {
          id: course.id,
          title: course.title,
          students: courseEnrollments.length,
          completion: courseEnrollments.filter(e => e.completed_at).length / courseEnrollments.length * 100 || 0,
          rating: course.rating || 0,
          revenue: course.price * course.students_count,
          trend: 'stable' as const
        };
      }) || [];

      return {
        stats,
        studentProgress,
        coursePerformance,
        recentActivity: studentProgress.slice(0, 5)
      };
    },
    enabled: !!user?.email,
  });
};

export const useCreateCourseAction = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (courseData: {
      title: string;
      description?: string;
      category: string;
      difficulty_level: string;
      price: number;
      duration_weeks: number;
    }) => {
      if (!user?.email) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('modules')
        .insert({
          ...courseData,
          instructor: user.email,
          is_active: true,
          total_lessons: 0,
          students_count: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructorDashboard'] });
      toast({
        title: "Հաջողություն",
        description: "Դասընթացը հաջողությամբ ստեղծվել է",
      });
    },
    onError: (error) => {
      toast({
        title: "Սխալ",
        description: "Դասընթացը ստեղծելու ժամանակ առաջացել է սխալ",
        variant: "destructive",
      });
    },
  });
};
