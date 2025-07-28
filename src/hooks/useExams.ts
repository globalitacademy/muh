
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Exam {
  id: string;
  module_id?: string;
  title: string;
  description?: string;
  exam_date?: string;
  duration_minutes: number;
  max_score: number;
  is_active: boolean;
  created_at: string;
  modules?: {
    title: string;
  };
}

interface ExamRegistration {
  id: string;
  user_id: string;
  exam_id: string;
  status: string;
  score?: number;
  registered_at: string;
  completed_at?: string;
  exams?: Exam;
}

export const useExams = () => {
  return useQuery({
    queryKey: ['exams'],
    queryFn: async (): Promise<Exam[]> => {
      const { data, error } = await supabase
        .from('exams')
        .select(`
          *,
          modules (
            title
          )
        `)
        .eq('is_active', true)
        .order('exam_date', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useExamRegistrations = () => {
  return useQuery({
    queryKey: ['examRegistrations'],
    queryFn: async (): Promise<ExamRegistration[]> => {
      const { data, error } = await supabase
        .from('exam_registrations')
        .select(`
          *,
          exams (
            *,
            modules (
              title
            )
          )
        `)
        .order('registered_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useRegisterForExam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (examId: string) => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('exam_registrations')
        .insert([{ exam_id: examId, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examRegistrations'] });
    },
  });
};
