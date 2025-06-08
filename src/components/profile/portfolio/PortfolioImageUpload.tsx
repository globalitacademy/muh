
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Upload, X, Edit, AlertCircle, Camera } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ImageEditor } from '@/components/ui/image-editor';
import { toast } from 'sonner';

interface PortfolioImageUploadProps {
  currentImageUrl?: string | null;
  onImageChange: (url: string | null) => void;
}

export const PortfolioImageUpload: React.FC<PortfolioImageUploadProps> = ({
  currentImageUrl,
  onImageChange
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { uploadImage, deleteImage, uploading, uploadProgress, validateFile } = useImageUpload({
    bucket: 'portfolio-images',
    maxSizeMB: 10
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('PortfolioImageUpload: File selected from input:', file?.name, file?.size, file?.type);
    
    if (file) {
      setError(null);
      const validationError = validateFile(file);
      
      if (validationError) {
        console.error('PortfolioImageUpload: File validation failed:', validationError);
        setError(validationError);
        toast.error(validationError);
        return;
      }
      
      console.log('PortfolioImageUpload: File passed validation, opening editor');
      setSelectedFile(file);
      setIsEditorOpen(true);
    }
    
    // Clear the input value so the same file can be selected again
    event.target.value = '';
  };

  const handleImageSave = async (editedFile: File) => {
    console.log('PortfolioImageUpload: Received edited file from ImageEditor:', editedFile.name, editedFile.size);
    
    try {
      setError(null);
      console.log('PortfolioImageUpload: Starting upload of edited portfolio image');
      const url = await uploadImage(editedFile);
      if (url) {
        console.log('PortfolioImageUpload: Upload successful, updating image URL:', url);
        onImageChange(url);
        toast.success('Նկարը հաջողությամբ վերբեռնվեց');
      }
    } catch (error) {
      const errorMessage = 'Սխալ նկարը վերբեռնելիս';
      console.error('PortfolioImageUpload: Upload error:', error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsEditorOpen(false);
      setSelectedFile(null);
    }
  };

  const handleDelete = async () => {
    if (!currentImageUrl) return;
    
    console.log('PortfolioImageUpload: Starting portfolio image deletion');
    
    try {
      setError(null);
      await deleteImage(currentImageUrl);
      onImageChange(null);
      toast.success('Նկարը հաջողությամբ ջնջվեց');
      console.log('PortfolioImageUpload: Portfolio image deleted successfully');
    } catch (error) {
      const errorMessage = 'Սխալ նկարը ջնջելիս';
      console.error('PortfolioImageUpload: Delete error:', error);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleEditorClose = () => {
    console.log('PortfolioImageUpload: Closing image editor');
    setIsEditorOpen(false);
    setSelectedFile(null);
  };

  const triggerFileInput = () => {
    console.log('PortfolioImageUpload: Triggering file input click');
    document.getElementById('portfolio-image-input')?.click();
  };

  return (
    <div className="space-y-4">
      {currentImageUrl ? (
        <Card className="relative overflow-hidden">
          <img
            src={currentImageUrl}
            alt="Portfolio նկար"
            className="w-full h-48 object-cover"
            onLoad={() => console.log('PortfolioImageUpload: Portfolio image loaded successfully')}
            onError={(e) => {
              console.error('PortfolioImageUpload: Portfolio image load error:', e);
              setError('Նկարը չի կարող բեռնվել');
            }}
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={triggerFileInput}
              disabled={uploading}
              title="Փոխել նկարը"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={uploading}
              title="Ջնջել նկարը"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
          <div className="p-8 text-center">
            <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">Ավելացնել նկար</h3>
            <p className="text-sm text-muted-foreground mb-4">
              PNG, JPG, WebP մինչև 10MB
            </p>
            <Button
              variant="outline"
              onClick={triggerFileInput}
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Ընտրել ֆայլ
            </Button>
          </div>
        </Card>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-sm text-center text-muted-foreground">
            Վերբեռնվում է... {uploadProgress}%
          </p>
        </div>
      )}

      <Input
        id="portfolio-image-input"
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
