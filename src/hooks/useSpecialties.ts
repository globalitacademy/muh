
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Specialty, CreateSpecialtyData, UpdateSpecialtyData } from '@/types/specialty';
import { toast } from 'sonner';

export const useSpecialties = () => {
  return useQuery({
    queryKey: ['specialties'],
    queryFn: async (): Promise<Specialty[]> => {
      console.log('Fetching specialties...');
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching specialties:', error);
        throw error;
      }

      console.log('Specialties fetched:', data);
      return (data || []) as Specialty[];
    },
  });
};

export const useAdminSpecialties = () => {
  return useQuery({
    queryKey: ['adminSpecialties'],
    queryFn: async (): Promise<Specialty[]> => {
      console.log('Fetching all specialties for admin...');
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching admin specialties:', error);
        throw error;
      }

      console.log('Admin specialties fetched:', data);
      return (data || []) as Specialty[];
    },
  });
};

export const useCreateSpecialty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (specialtyData: CreateSpecialtyData) => {
      const { data, error } = await supabase
        .from('specialties')
        .insert([specialtyData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
      queryClient.invalidateQueries({ queryKey: ['adminSpecialties'] });
      toast.success('Մասնագիտությունը հաջողությամբ ստեղծվել է');
    },
    onError: (error) => {
      console.error('Error creating specialty:', error);
      toast.error('Մասնագիտության ստեղծման սխալ');
    },
  });
};

export const useUpdateSpecialty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateSpecialtyData }) => {
      const { data, error } = await supabase
        .from('specialties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
      queryClient.invalidateQueries({ queryKey: ['adminSpecialties'] });
      toast.success('Մասնագիտությունը հաջողությամբ թարմացվել է');
    },
    onError: (error) => {
      console.error('Error updating specialty:', error);
      toast.error('Մասնագիտության թարմացման սխալ');
    },
  });
};

export const useDeleteSpecialty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (specialtyId: string) => {
      const { error } = await supabase
        .from('specialties')
        .delete()
        .eq('id', specialtyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
      queryClient.invalidateQueries({ queryKey: ['adminSpecialties'] });
      toast.success('Մասնագիտությունը հաջողությամբ ջնջվել է');
    },
    onError: (error) => {
      console.error('Error deleting specialty:', error);
      toast.error('Մասնագիտության ջնջման սխալ');
    },
  });
};
