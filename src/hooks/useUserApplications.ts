
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserApplication {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  role: 'admin' | 'instructor' | 'student' | 'employer';
  department: string | null;
  group_number: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
}

export const useUserApplications = () => {
  return useQuery({
    queryKey: ['userApplications'],
    queryFn: async (): Promise<UserApplication[]> => {
      console.log('Fetching user applications...');
      const { data, error } = await supabase
        .from('user_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user applications:', error);
        throw error;
      }

      console.log('User applications fetched:', data);
      return data || [];
    },
  });
};

export const useApproveApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId }: { applicationId: string }) => {
      const { error } = await supabase.rpc('approve_user_application', {
        application_id: applicationId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userApplications'] });
      toast.success('Դիմումը հաջողությամբ հաստատվել է');
    },
    onError: (error) => {
      console.error('Error approving application:', error);
      toast.error('Դիմումի հաստատման սխալ');
    },
  });
};

export const useRejectApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, reason }: { applicationId: string; reason?: string }) => {
      const { error } = await supabase.rpc('reject_user_application', {
        application_id: applicationId,
        reason: reason || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userApplications'] });
      toast.success('Դիմումը մերժվել է');
    },
    onError: (error) => {
      console.error('Error rejecting application:', error);
      toast.error('Դիմումի մերժման սխալ');
    },
  });
};

export const useSubmitApplication = () => {
  return useMutation({
    mutationFn: async (application: {
      name: string;
      email: string;
      phone?: string | null;
      organization?: string | null;
      role: 'admin' | 'instructor' | 'student' | 'employer';
      department?: string | null;
      group_number?: string | null;
    }) => {
      const { error } = await supabase
        .from('user_applications')
        .insert([application]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Գրանցման դիմումը հաջողությամբ ուղարկվել է');
    },
    onError: (error) => {
      console.error('Error submitting application:', error);
      toast.error('Գրանցման դիմումի ուղարկման սխալ');
    },
  });
};
