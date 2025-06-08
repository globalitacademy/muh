
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ModuleInstructor {
  id: string;
  module_id: string;
  instructor_id: string;
  group_number: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export const useModuleInstructors = (moduleId: string) => {
  return useQuery({
    queryKey: ['moduleInstructors', moduleId],
    queryFn: async (): Promise<ModuleInstructor[]> => {
      const { data, error } = await supabase
        .from('module_instructors')
        .select('*')
        .eq('module_id', moduleId)
        .order('is_primary', { ascending: false })
        .order('group_number', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useAssignInstructorToModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      moduleId,
      instructorId,
      groupNumber,
      isPrimary = false,
    }: {
      moduleId: string;
      instructorId: string;
      groupNumber?: string;
      isPrimary?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('module_instructors')
        .insert({
          module_id: moduleId,
          instructor_id: instructorId,
          group_number: groupNumber || null,
          is_primary: isPrimary,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['moduleInstructors', data.module_id] });
      toast.success('Դասախոսը հաջողությամբ նշանակվել է մոդուլին');
    },
    onError: (error) => {
      console.error('Error assigning instructor to module:', error);
      toast.error('Սխալ է տեղի ունեցել դասախոսին նշանակելիս');
    },
  });
};

export const useRemoveInstructorFromModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from('module_instructors')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moduleInstructors'] });
      toast.success('Դասախոսը հեռացվել է մոդուլից');
    },
    onError: (error) => {
      console.error('Error removing instructor from module:', error);
      toast.error('Սխալ է տեղի ունեցել դասախոսին հեռացնելիս');
    },
  });
};

export const useUpdateModuleInstructor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assignmentId,
      updates,
    }: {
      assignmentId: string;
      updates: Partial<Pick<ModuleInstructor, 'group_number' | 'is_primary'>>;
    }) => {
      const { data, error } = await supabase
        .from('module_instructors')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', assignmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['moduleInstructors', data.module_id] });
      toast.success('Դասախոսի տվյալները թարմացվել են');
    },
    onError: (error) => {
      console.error('Error updating module instructor:', error);
      toast.error('Սխալ է տեղի ունեցել տվյալները թարմացնելիս');
    },
  });
};
