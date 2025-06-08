
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Upload, X, Edit, AlertCircle } from 'lucide-react';
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
    console.log('PortfolioImageUpload: File selected:', file?.name);
    
    if (file) {
      setError(null);
      const validationError = validateFile(file);
      
      if (validationError) {
        setError(validationError);
        toast.error(validationError);
        return;
      }
      
      setSelectedFile(file);
      setIsEditorOpen(true);
    }
    
    // Clear the input value so the same file can be selected again
    event.target.value = '';
  };

  const handleImageSave = async (editedFile: File) => {
    console.log('PortfolioImageUpload: Saving edited image');
    
    try {
      setError(null);
      const url = await uploadImage(editedFile);
      if (url) {
        onImageChange(url);
        toast.success('Նկարը հաջողությամբ վերբեռնվեց');
        console.log('PortfolioImageUpload: Image uploaded successfully:', url);
      }
    } catch (error) {
      const errorMessage = 'Սխալ նկարը վերբեռնելիս';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('PortfolioImageUpload: Upload error:', error);
    } finally {
      setIsEditorOpen(false);
      setSelectedFile(null);
    }
  };

  const handleDelete = async () => {
    if (!currentImageUrl) return;
    
    console.log('PortfolioImageUpload: Deleting current image');
    
    try {
      setError(null);
      await deleteImage(currentImageUrl);
      onImageChange(null);
      toast.success('Նկարը հաջողությամբ ջնջվեց');
      console.log('PortfolioImageUpload: Image deleted successfully');
    } catch (error) {
      const errorMessage = 'Սխալ նկարը ջնջելիս';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('PortfolioImageUpload: Delete error:', error);
    }
  };

  const handleEditorClose = () => {
    console.log('PortfolioImageUpload: Closing editor');
    setIsEditorOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-4">
      {currentImageUrl ? (
        <Card className="relative overflow-hidden">
          <img
            src={currentImageUrl}
            alt="Portfolio նկար"
            className="w-full h-48 object-cover"
            onError={(e) => {
              console.error('PortfolioImageUpload: Image load error:', e);
              setError('Նկարը չի կարող բեռնվել');
            }}
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => document.getElementById('portfolio-image-input')?.click()}
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
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">Ավելացնել նկար</h3>
            <p className="text-sm text-muted-foreground mb-4">
              PNG, JPG, WebP մինչև 10MB
            </p>
            <Button
              variant="outline"
              onClick={() => document.getElementById('portfolio-image-input')?.click()}
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
