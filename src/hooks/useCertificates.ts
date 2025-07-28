
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Certificate {
  id: string;
  user_id: string;
  module_id?: string;
  template_id?: string;
  certificate_data?: any;
  issued_at: string;
  created_at: string;
  updated_at: string;
  modules?: {
    title: string;
  };
}

export const useCertificates = () => {
  return useQuery({
    queryKey: ['certificates'],
    queryFn: async (): Promise<Certificate[]> => {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          modules (
            title
          )
        `)
        .order('issued_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};
