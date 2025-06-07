
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UserProgress {
  id: string;
  user_id: string;
  module_id?: string;
  topic_id?: string;
  completed: boolean;
  completion_date?: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
  modules?: {
    title: string;
    description?: string;
  };
  topics?: {
    title: string;
    description?: string;
  };
}

export const useUserProgress = () => {
  return useQuery({
    queryKey: ['userProgress'],
    queryFn: async (): Promise<UserProgress[]> => {
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          *,
          modules (
            title,
            description
          ),
          topics (
            title,
            description
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      topicId, 
      moduleId, 
      progressPercentage, 
      completed 
    }: { 
      topicId?: string; 
      moduleId?: string; 
      progressPercentage: number; 
      completed?: boolean; 
    }) => {
      const updateData: any = {
        progress_percentage: progressPercentage,
        updated_at: new Date().toISOString(),
      };
      
      if (completed) {
        updateData.completed = true;
        updateData.completion_date = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          topic_id: topicId,
          module_id: moduleId,
          ...updateData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
};
