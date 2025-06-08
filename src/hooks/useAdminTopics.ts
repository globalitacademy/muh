
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Topic } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export interface CreateTopicData {
  module_id: string;
  title: string;
  title_en?: string;
  title_ru?: string;
  description?: string;
  description_en?: string;
  description_ru?: string;
  content?: string;
  video_url?: string;
  duration_minutes: number;
  order_index: number;
  is_free: boolean;
  exercises?: any;
  quiz_questions?: any;
  resources?: any;
}

export interface UpdateTopicData {
  title?: string;
  title_en?: string;
  title_ru?: string;
  description?: string;
  description_en?: string;
  description_ru?: string;
  content?: string;
  video_url?: string;
  duration_minutes?: number;
  order_index?: number;
  is_free?: boolean;
  exercises?: any;
  quiz_questions?: any;
  resources?: any;
}

export const useCreateTopic = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateTopicData): Promise<Topic> => {
      console.log('Creating topic:', data);
      const { data: topic, error } = await supabase
        .from('topics')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('Error creating topic:', error);
        throw error;
      }

      return topic;
    },
    onSuccess: (topic) => {
      queryClient.invalidateQueries({ queryKey: ['topics', topic.module_id] });
      toast({
        title: 'Հաջողություն',
        description: 'Թեման հաջողությամբ ստեղծվեց',
      });
    },
    onError: (error) => {
      console.error('Topic creation failed:', error);
      toast({
        title: 'Սխալ',
        description: 'Թեման ստեղծելիս սխալ տեղի ունեցավ',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateTopic = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateTopicData }): Promise<Topic> => {
      console.log('Updating topic:', id, updates);
      const { data: topic, error } = await supabase
        .from('topics')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating topic:', error);
        throw error;
      }

      return topic;
    },
    onSuccess: (topic) => {
      queryClient.invalidateQueries({ queryKey: ['topics', topic.module_id] });
      toast({
        title: 'Հաջողություն',
        description: 'Թեման հաջողությամբ թարմացվեց',
      });
    },
    onError: (error) => {
      console.error('Topic update failed:', error);
      toast({
        title: 'Սխալ',
        description: 'Թեման թարմացնելիս սխալ տեղի ունեցավ',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTopic = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (topicId: string): Promise<void> => {
      console.log('Deleting topic:', topicId);
      
      // First get the topic to know which module to invalidate
      const { data: topic } = await supabase
        .from('topics')
        .select('module_id')
        .eq('id', topicId)
        .single();

      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', topicId);

      if (error) {
        console.error('Error deleting topic:', error);
        throw error;
      }

      // Invalidate queries for the module
      if (topic) {
        queryClient.invalidateQueries({ queryKey: ['topics', topic.module_id] });
      }
    },
    onSuccess: () => {
      toast({
        title: 'Հաջողություն',
        description: 'Թեման հաջողությամբ ջնջվեց',
      });
    },
    onError: (error) => {
      console.error('Topic deletion failed:', error);
      toast({
        title: 'Սխալ',
        description: 'Թեման ջնջելիս սխալ տեղի ունեցավ',
        variant: 'destructive',
      });
    },
  });
};
