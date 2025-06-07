
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Topic } from '@/types/database';

export const useTopics = (moduleId: string) => {
  return useQuery({
    queryKey: ['topics', moduleId],
    queryFn: async (): Promise<Topic[]> => {
      console.log('Fetching topics for module:', moduleId);
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching topics:', error);
        throw error;
      }

      console.log('Topics fetched:', data);
      console.log('Total topics count:', data?.length || 0);
      console.log('Free topics:', data?.filter(t => t.is_free).length || 0);
      console.log('Paid topics:', data?.filter(t => !t.is_free).length || 0);
      
      return data || [];
    },
    enabled: !!moduleId,
    staleTime: 0, // Force fresh data on every request
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
