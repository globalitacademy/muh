
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Module } from '@/types/database';

export const useSpecialtyModules = (specialtyId: string) => {
  return useQuery({
    queryKey: ['specialtyModules', specialtyId],
    queryFn: async (): Promise<Module[]> => {
      console.log('Fetching modules for specialty:', specialtyId);
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('specialty_id', specialtyId)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching specialty modules:', error);
        throw error;
      }

      console.log('Specialty modules fetched:', data);
      return (data || []) as Module[];
    },
    enabled: !!specialtyId,
  });
};
