
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Camera, Trash2, AlertCircle, Upload } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ImageEditor } from './image-editor';
import { toast } from 'sonner';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  name?: string;
  onAvatarChange: (url: string | null) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  name = 'U',
  onAvatarChange,
  size = 'lg'
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { uploadImage, deleteImage, uploading, uploadProgress, validateFile } = useImageUpload({
    bucket: 'avatars',
    maxSizeMB: 5
  });

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('AvatarUpload: File selected from input:', file?.name, file?.size, file?.type);
    
    if (file) {
      setError(null);
      const validationError = validateFile(file);
      
      if (validationError) {
        console.error('AvatarUpload: File validation failed:', validationError);
        setError(validationError);
        toast.error(validationError);
        return;
      }
      
      console.log('AvatarUpload: File passed validation, opening editor');
      setSelectedFile(file);
      setIsEditorOpen(true);
    }
    
    // Clear the input value so the same file can be selected again
    event.target.value = '';
  };

  const handleImageSave = async (editedFile: File) => {
    console.log('AvatarUpload: Received edited file from ImageEditor:', editedFile.name, editedFile.size);
    
    try {
      setError(null);
      console.log('AvatarUpload: Starting upload of edited avatar');
      const url = await uploadImage(editedFile, 'avatar');
      if (url) {
        console.log('AvatarUpload: Upload successful, calling onAvatarChange with URL:', url);
        onAvatarChange(url);
        // Don't show success toast here - let the parent component handle it
      }
    } catch (error) {
      const errorMessage = 'Սխալ նկարը վերբեռնելիս';
      console.error('AvatarUpload: Upload error:', error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsEditorOpen(false);
      setSelectedFile(null);
    }
  };

  const handleDelete = async () => {
    if (!currentAvatarUrl) return;
    
    console.log('AvatarUpload: Starting avatar deletion');
    
    try {
      setError(null);
      await deleteImage(currentAvatarUrl);
      console.log('AvatarUpload: Avatar deleted successfully, calling onAvatarChange with null');
      onAvatarChange(null);
      // Don't show success toast here - let the parent component handle it
    } catch (error) {
      const errorMessage = 'Սխալ նկարը ջնջելիս';
      console.error('AvatarUpload: Delete error:', error);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleEditorClose = () => {
    console.log('AvatarUpload: Closing image editor');
    setIsEditorOpen(false);
    setSelectedFile(null);
  };

  const triggerFileInput = () => {
    console.log('AvatarUpload: Triggering file input click');
    document.getElementById('avatar-input')?.click();
  };

  return (
    <div className="flex items-start gap-4">
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage 
            src={currentAvatarUrl || undefined} 
            onLoad={() => console.log('AvatarUpload: Avatar image loaded successfully')}
            onError={(e) => {
              console.error('AvatarUpload: Avatar image load error:', e);
            }}
          />
          <AvatarFallback className="text-lg">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <div className="text-white text-xs">{uploadProgress}%</div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={triggerFileInput}
            disabled={uploading}
          >
            <Camera className="w-4 h-4 mr-2" />
            {currentAvatarUrl ? 'Փոխել' : 'Ավելացնել'}
          </Button>
          
          {currentAvatarUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={uploading}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {uploading && (
          <Progress value={uploadProgress} className="w-32" />
        )}

        {error && (
          <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-red-700">
            <AlertCircle className="w-3 h-3" />
            <span className="text-xs">{error}</span>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          PNG, JPG, WebP մինչև 5MB
        </p>
      </div>

      <Input
        id="avatar-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <ImageEditor
        imageFile={selectedFile}
        isOpen={isEditorOpen}
        onClose={handleEditorClose}
        onSave={handleImageSave}
        aspectRatio={1}
      />
    </div>
  );
};
