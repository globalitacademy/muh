
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface InstructorCourse {
  id: string;
  title: string;
  description?: string;
  instructor: string;
  students_count: number;
  total_lessons: number;
  difficulty_level: string;
  is_active: boolean;
  created_at: string;
  category: string;
  price: number;
  duration_weeks: number;
  rating?: number;
}

export const useInstructorCourses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['instructorCourses', user?.id],
    queryFn: async (): Promise<InstructorCourse[]> => {
      if (!user) return [];

      const userEmail = user.email;
      console.log('Fetching courses for instructor:', userEmail);

      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('instructor', userEmail)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching instructor courses:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (courseData: Partial<InstructorCourse>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('modules')
        .insert({
          ...courseData,
          instructor: user.email,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructorCourses'] });
    },
  });
};
