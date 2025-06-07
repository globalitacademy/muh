
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Certificate {
  id: string;
  user_id: string;
  module_id?: string;
  certificate_url?: string;
  qr_code?: string;
  issued_at: string;
  is_diploma: boolean;
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
