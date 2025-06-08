
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, Trash2, Edit } from 'lucide-react';
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
  const { uploadImage, deleteImage, uploading, uploadProgress } = useImageUpload({
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
    if (file) {
      setSelectedFile(file);
      setIsEditorOpen(true);
    }
  };

  const handleImageSave = async (editedFile: File) => {
    try {
      const url = await uploadImage(editedFile, 'avatar');
      if (url) {
        onAvatarChange(url);
        toast.success('Նկարը հաջողությամբ վերբեռնվեց');
      }
    } catch (error) {
      toast.error('Սխալ նկարը վերբեռնելիս');
      console.error('Avatar upload error:', error);
    }
  };

  const handleDelete = async () => {
    if (!currentAvatarUrl) return;
    
    try {
      await deleteImage(currentAvatarUrl);
      onAvatarChange(null);
      toast.success('Նկարը հաջողությամբ ջնջվեց');
    } catch (error) {
      toast.error('Սխալ նկարը ջնջելիս');
      console.error('Avatar delete error:', error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={currentAvatarUrl || undefined} />
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

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('avatar-input')?.click()}
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
          <Progress value={uploadProgress} className="w-24" />
        )}

        <p className="text-xs text-muted-foreground">
          PNG, JPG մինչև 5MB
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
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedFile(null);
        }}
        onSave={handleImageSave}
        aspectRatio={1}
      />
    </div>
  );
};
