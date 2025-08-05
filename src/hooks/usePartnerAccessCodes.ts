import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type AccessCodeStatus = Database['public']['Enums']['access_code_status'];

export interface PartnerAccessCode {
  id: string;
  partner_id: string;
  module_id?: string | null;
  code: string;
  name: string;
  description?: string | null;
  expires_at: string;
  activity_duration_minutes: number;
  max_uses: number;
  current_uses: number;
  status: AccessCodeStatus;
  is_active: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface AccessCodeUsage {
  id: string;
  access_code_id: string;
  user_id?: string | null;
  module_id?: string | null;
  used_at: string;
  session_duration_minutes?: number | null;
  ip_address?: string | null;
  user_agent?: string | null;
  session_started_at?: string | null;
  session_ended_at?: string | null;
  metadata: any;
}

export interface CreateAccessCodeData {
  partner_id: string;
  module_id?: string;
  name: string;
  description?: string;
  expires_at: string;
  activity_duration_minutes: number;
  max_uses: number;
}

export interface UpdateAccessCodeData {
  name?: string;
  description?: string;
  expires_at?: string;
  activity_duration_minutes?: number;
  max_uses?: number;
  is_active?: boolean;
}

// Get all access codes for admin or partner
export const usePartnerAccessCodes = (partnerId?: string) => {
  return useQuery({
    queryKey: ['partner-access-codes', partnerId],
    queryFn: async (): Promise<PartnerAccessCode[]> => {
      let query = supabase
        .from('partner_access_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (partnerId) {
        query = query.eq('partner_id', partnerId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });
};

// Get single access code
export const useAccessCode = (id: string) => {
  return useQuery({
    queryKey: ['access-code', id],
    queryFn: async (): Promise<PartnerAccessCode | null> => {
      const { data, error } = await supabase
        .from('partner_access_codes')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// Get access code usage logs
export const useAccessCodeUsage = (accessCodeId?: string) => {
  return useQuery({
    queryKey: ['access-code-usage', accessCodeId],
    queryFn: async (): Promise<AccessCodeUsage[]> => {
      let query = supabase
        .from('partner_access_code_usage')
        .select('*')
        .order('used_at', { ascending: false });

      if (accessCodeId) {
        query = query.eq('access_code_id', accessCodeId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });
};

// Create new access code
export const useCreateAccessCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAccessCodeData): Promise<PartnerAccessCode> => {
      // Generate unique code
      const { data: codeData, error: codeError } = await supabase.rpc('generate_access_code');
      if (codeError) throw codeError;

      const { data: newCode, error } = await supabase
        .from('partner_access_codes')
        .insert({
          ...data,
          code: codeData,
        })
        .select()
        .single();

      if (error) throw error;
      return newCode;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['partner-access-codes'] });
      queryClient.setQueryData(['access-code', data.id], data);
    },
  });
};

// Update access code
export const useUpdateAccessCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateAccessCodeData & { id: string }): Promise<PartnerAccessCode> => {
      const { data: updatedCode, error } = await supabase
        .from('partner_access_codes')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedCode;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['partner-access-codes'] });
      queryClient.setQueryData(['access-code', data.id], data);
    },
  });
};

// Delete access code
export const useDeleteAccessCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('partner_access_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['partner-access-codes'] });
      queryClient.removeQueries({ queryKey: ['access-code', id] });
    },
  });
};

// Toggle access code active status
export const useToggleAccessCodeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }): Promise<PartnerAccessCode> => {
      const { data, error } = await supabase
        .from('partner_access_codes')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['partner-access-codes'] });
      queryClient.setQueryData(['access-code', data.id], data);
    },
  });
};

// Validate access code (for students/users)
export const useValidateAccessCode = () => {
  return useMutation({
    mutationFn: async ({ code, userId, moduleId }: { 
      code: string; 
      userId?: string; 
      moduleId?: string; 
    }): Promise<any> => {
      const { data, error } = await supabase.rpc('use_access_code', {
        p_code: code,
        p_user_id: userId,
        p_module_id: moduleId,
      });

      if (error) throw error;
      return data;
    },
  });
};

// Check access code status (public function)
export const useCheckAccessCodeStatus = () => {
  return useMutation({
    mutationFn: async (code: string): Promise<any> => {
      const { data, error } = await supabase.rpc('check_access_code_status', {
        p_code: code,
      });

      if (error) throw error;
      return data;
    },
  });
};