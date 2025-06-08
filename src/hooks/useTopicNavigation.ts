
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Topic {
  id: string;
  title: string;
  order_index: number;
  is_free: boolean;
  module_id: string;
}

export const useTopicNavigation = (currentTopicId: string, moduleId: string) => {
  return useQuery({
    queryKey: ['topic-navigation', currentTopicId, moduleId],
    queryFn: async () => {
      console.log('Fetching topic navigation for module:', moduleId);
      
      // Get all topics for the module
      const { data: allTopics, error } = await supabase
        .from('topics')
        .select('id, title, order_index, is_free, module_id')
        .eq('module_id', moduleId)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching topics for navigation:', error);
        throw error;
      }

      console.log('All topics fetched for navigation:', allTopics);

      // Find current topic index
      const currentIndex = allTopics?.findIndex(topic => topic.id === currentTopicId) ?? -1;
      const currentTopic = allTopics?.[currentIndex];
      const previousTopic = currentIndex > 0 ? allTopics?.[currentIndex - 1] : undefined;
      const nextTopic = currentIndex < (allTopics?.length ?? 0) - 1 ? allTopics?.[currentIndex + 1] : undefined;

      console.log('Navigation data:', {
        currentTopic,
        previousTopic,
        nextTopic,
        currentIndex,
        totalTopics: allTopics?.length
      });

      return {
        currentTopic,
        previousTopic,
        nextTopic,
        allTopics: allTopics || []
      };
    },
    enabled: !!currentTopicId && !!moduleId
  });
};
