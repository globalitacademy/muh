
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  name: string | null;
  organization: string | null;
  role: string;
  group_number: string | null;
  created_at: string;
  phone: string | null;
  department: string | null;
  avatar_url: string | null;
  bio: string | null;
  status: string;
  language_preference: string;
}

export interface UserStats {
  totalInstructors: number;
  totalStudents: number;
  totalAdmins: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: async (): Promise<UserProfile[]> => {
      console.log('Fetching all users for admin...');
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, organization, role, group_number, created_at, phone, department, avatar_url, bio, status, language_preference')
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

export const useUserStats = () => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: async (): Promise<UserStats> => {
      console.log('Fetching user statistics...');

      // Get instructors count
      const { count: instructorsCount, error: instructorsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'instructor');

      if (instructorsError) throw instructorsError;

      // Get students count
      const { count: studentsCount, error: studentsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      if (studentsError) throw studentsError;

      // Get admins count
      const { count: adminsCount, error: adminsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      if (adminsError) throw adminsError;

      // Get active users (status = 'active')
      const { count: activeUsersCount, error: activeUsersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (activeUsersError) throw activeUsersError;

      // Get new users this month
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      const { count: newUsersCount, error: newUsersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayOfMonth.toISOString());

      if (newUsersError) throw newUsersError;

      return {
        totalInstructors: instructorsCount || 0,
        totalStudents: studentsCount || 0,
        totalAdmins: adminsCount || 0,
        activeUsers: activeUsersCount || 0,
        newUsersThisMonth: newUsersCount || 0,
      };
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
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('Օգտատիրոջ ռոլը հաջողությամբ թարմացվել է');
    },
    onError: (error) => {
      console.error('Error updating user role:', error);
      toast.error('Օգտատիրոջ ռոլի թարմացման սխալ');
    },
  });
};
