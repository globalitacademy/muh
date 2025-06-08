
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UseImageUploadOptions {
  bucket: 'avatars' | 'portfolio-images';
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export const useImageUpload = (options: UseImageUploadOptions) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    bucket,
    maxSizeMB = bucket === 'avatars' ? 5 : 10,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  } = options;

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'Չթույլատրված ֆայլի տիպ։ Օգտագործեք JPEG, PNG կամ WebP ֆորմատը։';
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `Ֆայլի չափը չպետք է գերազանցի ${maxSizeMB}MB։`;
    }

    return null;
  };

  const uploadImage = async (file: File, fileName?: string): Promise<string | null> => {
    if (!user) {
      throw new Error('Օգտատերը չի գտնվել');
    }

    const validationError = validateFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const finalFileName = fileName || `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${finalFileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setUploadProgress(100);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteImage = async (url: string): Promise<void> => {
    if (!user) {
      throw new Error('Օգտատերը չի գտնվել');
    }

    try {
      // Extract file path from URL
      const urlParts = url.split('/');
      const filePath = urlParts.slice(-2).join('/'); // user_id/filename

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
    uploadProgress,
    validateFile
  };
};
