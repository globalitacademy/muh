
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
  totalEmployers: number;
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

      // Get employers count
      const { count: employersCount, error: employersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'employer');

      if (employersError) throw employersError;

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
        totalEmployers: employersCount || 0,
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
      // Get current user for audit log
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
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

      // Log the action
      if (currentUser) {
        await supabase
          .from('admin_audit_logs')
          .insert({
            admin_id: currentUser.id,
            target_user_id: userId,
            action: 'role_changed',
            details: { new_role: role }
          });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminInstructors'] });
      queryClient.invalidateQueries({ queryKey: ['adminStudents'] });
      queryClient.invalidateQueries({ queryKey: ['adminEmployers'] });
      queryClient.invalidateQueries({ queryKey: ['adminInstructorsWithGroups'] });
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

export const useManageInstructorGroups = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ instructorId, groups }: { instructorId: string; groups: string[] }) => {
      // First, remove existing groups for this instructor
      const { error: deleteError } = await supabase
        .from('instructor_groups')
        .delete()
        .eq('instructor_id', instructorId);

      if (deleteError) throw deleteError;

      // Then add new groups
      if (groups.length > 0) {
        const groupRecords = groups.map(group => ({
          instructor_id: instructorId,
          group_number: group
        }));

        const { error: insertError } = await supabase
          .from('instructor_groups')
          .insert(groupRecords);

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminInstructorsWithGroups'] });
      toast.success('Դասախոսի խմբերը հաջողությամբ թարմացվել են');
    },
    onError: (error) => {
      console.error('Error managing instructor groups:', error);
      toast.error('Դասախոսի խմբերի թարմացման սխալ');
    },
  });
};
