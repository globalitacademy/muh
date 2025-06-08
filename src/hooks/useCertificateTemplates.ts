
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CertificateTemplate {
  id: string;
  name: string;
  description?: string;
  template_type: 'certificate' | 'diploma' | 'participation';
  design_config: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateTemplateData {
  name: string;
  description?: string;
  template_type: 'certificate' | 'diploma' | 'participation';
  design_config: string;
}

export const useCertificateTemplates = () => {
  return useQuery({
    queryKey: ['certificate-templates'],
    queryFn: async (): Promise<CertificateTemplate[]> => {
      const { data, error } = await supabase
        .from('certificate_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as CertificateTemplate[];
    },
  });
};

export const useCreateCertificateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateData: CreateTemplateData): Promise<CertificateTemplate> => {
      let parsedConfig = {};
      try {
        parsedConfig = templateData.design_config ? JSON.parse(templateData.design_config) : {};
      } catch (error) {
        // If parsing fails, store as string in a wrapper object
        parsedConfig = { config: templateData.design_config };
      }

      const { data, error } = await supabase
        .from('certificate_templates')
        .insert({
          name: templateData.name,
          description: templateData.description,
          template_type: templateData.template_type,
          design_config: parsedConfig,
        })
        .select()
        .single();

      if (error) throw error;
      return data as CertificateTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificate-templates'] });
    },
  });
};

export const useDeleteCertificateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateId: string): Promise<void> => {
      const { error } = await supabase
        .from('certificate_templates')
        .update({ is_active: false })
        .eq('id', templateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificate-templates'] });
    },
  });
};
