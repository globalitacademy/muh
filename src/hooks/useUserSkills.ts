
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserSkill {
  id: string;
  user_id: string;
  name: string;
  level: number;
  category: 'technical' | 'design' | 'business' | 'language';
  created_at: string;
  updated_at: string;
}

export const useUserSkills = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userSkills', user?.id],
    queryFn: async (): Promise<UserSkill[]> => {
      // Return empty data since user_skills table doesn't exist
      return [];
    },
    enabled: false,
  });
};

export const useAddUserSkill = () => {
  return {
    mutate: async (skillData: any) => console.log('Add skill:', skillData),
    mutateAsync: async (skillData: any) => console.log('Add skill async:', skillData),
    isLoading: false,
    isPending: false,
  };
};

export const useUpdateUserSkill = () => {
  return {
    mutate: async (data: { id: string; [key: string]: any }) => console.log('Update skill:', data),
    mutateAsync: async (data: { id: string; [key: string]: any }) => console.log('Update skill async:', data),
    isLoading: false,
    isPending: false,
  };
};

export const useDeleteUserSkill = () => {
  return {
    mutate: async (id: string) => console.log('Delete skill:', id),
    mutateAsync: async (id: string) => console.log('Delete skill async:', id),
    isLoading: false,
    isPending: false,
  };
};
