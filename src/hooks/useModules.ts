
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Module } from '@/types/database';

export const useModules = () => {
  return useQuery({
    queryKey: ['modules'],
    queryFn: async (): Promise<Module[]> => {
      console.log('Fetching modules...');
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching modules:', error);
        throw error;
      }

      console.log('Modules fetched:', data);
      return data || [];
    },
  });
};

export const useModule = (id: string) => {
  return useQuery({
    queryKey: ['module', id],
    queryFn: async (): Promise<Module | null> => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching module:', error);
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });
};
