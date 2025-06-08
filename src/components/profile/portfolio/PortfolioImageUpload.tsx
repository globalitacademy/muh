
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Upload, X, Edit } from 'lucide-react';
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
  const { uploadImage, deleteImage, uploading, uploadProgress } = useImageUpload({
    bucket: 'portfolio-images',
    maxSizeMB: 10
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsEditorOpen(true);
    }
  };

  const handleImageSave = async (editedFile: File) => {
    try {
      const url = await uploadImage(editedFile);
      if (url) {
        onImageChange(url);
        toast.success('Նկարը հաջողությամբ վերբեռնվեց');
      }
    } catch (error) {
      toast.error('Սխալ նկարը վերբեռնելիս');
      console.error('Portfolio image upload error:', error);
    }
  };

  const handleDelete = async () => {
    if (!currentImageUrl) return;
    
    try {
      await deleteImage(currentImageUrl);
      onImageChange(null);
      toast.success('Նկարը հաջողությամբ ջնջվեց');
    } catch (error) {
      toast.error('Սխալ նկարը ջնջելիս');
      console.error('Portfolio image delete error:', error);
    }
  };

  return (
    <div className="space-y-4">
      {currentImageUrl ? (
        <Card className="relative overflow-hidden">
          <img
            src={currentImageUrl}
            alt="Portfolio նկար"
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => document.getElementById('portfolio-image-input')?.click()}
              disabled={uploading}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={uploading}
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
              PNG, JPG մինչև 10MB
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
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedFile(null);
        }}
        onSave={handleImageSave}
        aspectRatio={16/9}
      />
    </div>
  );
};
