import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export const usePdfUpload = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const uploadPdf = async (file: File): Promise<string | null> => {
    if (!user) {
      toast.error('Պետք է մուտք գործել');
      return null;
    }

    if (!file.type.includes('pdf')) {
      toast.error('Միայն PDF ֆայլեր են թույլատրվում');
      return null;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error('PDF ֆայլը չափազանց մեծ է (մաքս. 50MB)');
      return null;
    }

    setUploading(true);

    try {
      const fileExt = 'pdf';
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('topic-videos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('PDF վերբեռնումը ձախողվեց');
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('topic-videos')
        .getPublicUrl(filePath);

      toast.success('PDF-ը հաջողությամբ վերբեռնվեց');
      return publicUrl;
    } catch (error) {
      console.error('PDF upload error:', error);
      toast.error('PDF վերբեռնումը ձախողվեց');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deletePdf = async (url: string): Promise<void> => {
    if (!user) {
      toast.error('Պետք է մուտք գործել');
      return;
    }

    try {
      const path = url.split('/topic-videos/')[1];
      if (!path) {
        toast.error('Անվավեր PDF հղում');
        return;
      }

      const { error } = await supabase.storage
        .from('topic-videos')
        .remove([path]);

      if (error) {
        console.error('Delete error:', error);
        toast.error('PDF-ի հեռացումը ձախողվեց');
        return;
      }

      toast.success('PDF-ը հաջողությամբ հեռացվեց');
    } catch (error) {
      console.error('PDF delete error:', error);
      toast.error('PDF-ի հեռացումը ձախողվեց');
    }
  };

  return {
    uploadPdf,
    deletePdf,
    uploading,
  };
};
