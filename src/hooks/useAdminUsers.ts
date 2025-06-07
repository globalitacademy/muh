
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string | null;
  organization: string | null;
  role: string;
  group_number: string | null;
  created_at: string;
}

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: async (): Promise<UserProfile[]> => {
      console.log('Fetching all users for admin...');
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, organization, role, group_number, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin users:', error);
        throw error;
      }

      console.log('Admin users fetched:', data);
      return data || [];
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'instructor' | 'student' | 'employer' }) => {
      // Update in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update in user_roles table
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });

      if (roleError) throw roleError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('Օգտատիրոջ ռոլը հաջողությամբ թարմացվել է');
    },
    onError: (error) => {
      console.error('Error updating user role:', error);
      toast.error('Օգտատիրոջ ռոլի թարմացման սխալ');
    },
  });
};
