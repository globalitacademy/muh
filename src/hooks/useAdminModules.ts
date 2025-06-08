
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Module } from '@/types/database';
import { toast } from 'sonner';

export const useAdminModules = () => {
  return useQuery({
    queryKey: ['adminModules'],
    queryFn: async (): Promise<Module[]> => {
      console.log('Fetching all modules for admin...');
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching admin modules:', error);
        throw error;
      }

      console.log('Admin modules fetched:', data);
      return (data || []) as Module[];
    },
  });
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (moduleData: {
      title: string;
      description: string;
      category: string;
      difficulty_level: 'beginner' | 'intermediate' | 'advanced';
      duration_weeks: number;
      price: number;
      instructor: string;
      total_lessons: number;
      order_index: number;
      specialty_id?: string;
    }) => {
      const { data, error } = await supabase
        .from('modules')
        .insert([moduleData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminModules'] });
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      queryClient.invalidateQueries({ queryKey: ['specialtyModuleCounts'] });
      toast.success('Մոդուլը հաջողությամբ ստեղծվել է');
    },
    onError: (error) => {
      console.error('Error creating module:', error);
      toast.error('Մոդուլի ստեղծման սխալ');
    },
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Module> }) => {
      const { data, error } = await supabase
        .from('modules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminModules'] });
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      queryClient.invalidateQueries({ queryKey: ['specialtyModuleCounts'] });
      toast.success('Մոդուլը հաջողությամբ թարմացվել է');
    },
    onError: (error) => {
      console.error('Error updating module:', error);
      toast.error('Մոդուլի թարմացման սխալ');
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (moduleId: string) => {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminModules'] });
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      queryClient.invalidateQueries({ queryKey: ['specialtyModuleCounts'] });
      toast.success('Մոդուլը հաջողությամբ ջնջվել է');
    },
    onError: (error) => {
      console.error('Error deleting module:', error);
      toast.error('Մոդուլի ջնջման սխալ');
    },
  });
};
