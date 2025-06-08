
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Camera, Trash2, AlertCircle } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ImageEditor } from './image-editor';
import { toast } from 'sonner';

interface CoverPhotoUploadProps {
  currentCoverUrl?: string | null;
  onCoverChange: (url: string | null) => void;
}

export const CoverPhotoUpload: React.FC<CoverPhotoUploadProps> = ({
  currentCoverUrl,
  onCoverChange
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { uploadImage, deleteImage, uploading, uploadProgress, validateFile } = useImageUpload({
    bucket: 'avatars',
    maxSizeMB: 10
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('CoverPhotoUpload: File selected:', file?.name, file?.size, file?.type);
    
    if (file) {
      setError(null);
      const validationError = validateFile(file);
      
      if (validationError) {
        console.error('CoverPhotoUpload: File validation failed:', validationError);
        setError(validationError);
        toast.error(validationError);
        return;
      }
      
      console.log('CoverPhotoUpload: File passed validation, opening editor');
      setSelectedFile(file);
      setIsEditorOpen(true);
    }
    
    event.target.value = '';
  };

  const handleImageSave = async (editedFile: File) => {
    console.log('CoverPhotoUpload: Received edited file:', editedFile.name, editedFile.size);
    
    try {
      setError(null);
      console.log('CoverPhotoUpload: Starting upload of cover photo');
      const url = await uploadImage(editedFile, 'cover-photo');
      if (url) {
        console.log('CoverPhotoUpload: Upload successful, updating cover URL:', url);
        onCoverChange(url);
        toast.success('Ծածկագիրը հաջողությամբ վերբեռնվեց');
      }
    } catch (error) {
      const errorMessage = 'Սխալ ծածկագիրը վերբեռնելիս';
      console.error('CoverPhotoUpload: Upload error:', error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsEditorOpen(false);
      setSelectedFile(null);
    }
  };

  const handleDelete = async () => {
    if (!currentCoverUrl) return;
    
    console.log('CoverPhotoUpload: Starting cover photo deletion');
    
    try {
      setError(null);
      await deleteImage(currentCoverUrl);
      onCoverChange(null);
      toast.success('Ծածկագիրը հաջողությամբ ջնջվեց');
      console.log('CoverPhotoUpload: Cover photo deleted successfully');
    } catch (error) {
      const errorMessage = 'Սխալ ծածկագիրը ջնջելիս';
      console.error('CoverPhotoUpload: Delete error:', error);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleEditorClose = () => {
    console.log('CoverPhotoUpload: Closing image editor');
    setIsEditorOpen(false);
    setSelectedFile(null);
  };

  const triggerFileInput = () => {
    console.log('CoverPhotoUpload: Triggering file input click');
    document.getElementById('cover-input')?.click();
  };

  return (
    <div className="space-y-4">
      {/* Cover Photo Preview */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-lg overflow-hidden">
          {currentCoverUrl ? (
            <img 
              src={currentCoverUrl} 
              alt="Ծածկագիր" 
              className="w-full h-full object-cover"
              onLoad={() => console.log('CoverPhotoUpload: Cover image loaded successfully')}
              onError={(e) => {
                console.error('CoverPhotoUpload: Cover image load error:', e);
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          )}
          
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white text-center">
                <div className="text-sm mb-2">Վերբեռնվում է...</div>
                <div className="text-lg">{uploadProgress}%</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
          disabled={uploading}
        >
          <Camera className="w-4 h-4 mr-2" />
          {currentCoverUrl ? 'Փոխել ծածկագիրը' : 'Ավելացնել ծածկագիր'}
        </Button>
        
        {currentCoverUrl && (
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
        <Progress value={uploadProgress} className="w-full" />
      )}

      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <Input
        id="cover-input"
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
        aspectRatio={16/9}
      />
    </div>
  );
};
