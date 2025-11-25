import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseVideoUploadOptions {
  bucket?: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export const useVideoUpload = (options: UseVideoUploadOptions = {}) => {
  const {
    bucket = 'topic-videos',
    maxSizeMB = 100, // 100MB max for videos
    allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
  } = options;

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`;
    }
    
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSizeMB}MB limit`;
    }
    
    return null;
  };

  const uploadVideo = async (file: File, fileName?: string): Promise<string | null> => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Verify user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to upload videos');
        return null;
      }

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        toast.error(validationError);
        return null;
      }

      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const uniqueFileName = fileName || `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${uniqueFileName}`;

      // Upload file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload video');
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setUploadProgress(100);
      toast.success('Video uploaded successfully');
      return publicUrl;
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('An error occurred while uploading');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteVideo = async (url: string): Promise<void> => {
    try {
      // Verify user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to delete videos');
        return;
      }

      // Extract file path from URL
      const urlParts = url.split(`/${bucket}/`);
      if (urlParts.length < 2) {
        toast.error('Invalid video URL');
        return;
      }

      const filePath = urlParts[1];

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete video');
        return;
      }

      toast.success('Video deleted successfully');
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('An error occurred while deleting');
    }
  };

  return {
    uploadVideo,
    deleteVideo,
    uploading,
    uploadProgress,
    validateFile
  };
};
