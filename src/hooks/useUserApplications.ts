import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserApplication {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  department?: string;
  group_number?: string;
  role: string;
  status: string;
  application_type: string;
  rejection_reason?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
}

export type { UserApplication };

export const useUserApplications = () => {
  return useQuery({
    queryKey: ['user-applications'],
    queryFn: async (): Promise<UserApplication[]> => {
      const { data, error } = await supabase
        .from('user_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }
      
      return data || [];
    },
  });
};

export const useSubmitApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (applicationData: Omit<UserApplication, 'id' | 'created_at' | 'updated_at' | 'submitted_at'>) => {
      const { data, error } = await supabase
        .from('user_applications')
        .insert([applicationData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-applications'] });
      toast.success('Դիմումը հաջողությամբ ուղարկվեց');
    },
    onError: (error) => {
      console.error('Error submitting application:', error);
      toast.error('Դիմումի ուղարկման սխալ');
    },
  });
};

export const useApproveApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ applicationId }: { applicationId: string }) => {
      const { data, error } = await supabase
        .from('user_applications')
        .update({ 
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', applicationId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-applications'] });
      toast.success('Դիմումը հաստատվեց');
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
      const { data, error } = await supabase
        .from('user_applications')
        .update({ 
          status: 'rejected',
          rejection_reason: reason,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', applicationId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-applications'] });
      toast.success('Դիմումը մերժվեց');
    },
    onError: (error) => {
      console.error('Error rejecting application:', error);
      toast.error('Դիմումի մերժման սխալ');
    },
  });
};