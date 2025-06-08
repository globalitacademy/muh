
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
    console.log('useImageUpload: Validating file:', file.name, file.type, file.size);
    
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
    console.log('useImageUpload: Starting upload for file:', file.name);
    
    if (!user) {
      console.error('useImageUpload: No user found');
      throw new Error('Օգտատերը չի գտնվել');
    }

    const validationError = validateFile(file);
    if (validationError) {
      console.error('useImageUpload: Validation failed:', validationError);
      throw new Error(validationError);
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const finalFileName = fileName || `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${finalFileName}`;

      console.log('useImageUpload: Uploading to path:', filePath);

      setUploadProgress(50);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('useImageUpload: Storage upload error:', error);
        throw error;
      }

      console.log('useImageUpload: Upload successful, getting public URL');
      setUploadProgress(80);

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log('useImageUpload: Public URL obtained:', publicUrl);
      setUploadProgress(100);
      
      return publicUrl;
    } catch (error) {
      console.error('useImageUpload: Upload failed:', error);
      throw error;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const deleteImage = async (url: string): Promise<void> => {
    console.log('useImageUpload: Deleting image:', url);
    
    if (!user) {
      console.error('useImageUpload: No user found for deletion');
      throw new Error('Օգտատերը չի գտնվել');
    }

    try {
      // Extract file path from URL
      const urlParts = url.split('/');
      const filePath = urlParts.slice(-2).join('/'); // user_id/filename
      
      console.log('useImageUpload: Deleting from path:', filePath);

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('useImageUpload: Delete error:', error);
        throw error;
      }
      
      console.log('useImageUpload: Image deleted successfully');
    } catch (error) {
      console.error('useImageUpload: Delete failed:', error);
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
