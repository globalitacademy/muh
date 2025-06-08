
import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Crop, RotateCw, Download, Loader2 } from 'lucide-react';

interface ImageEditorProps {
  imageFile: File | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedFile: File) => void;
  aspectRatio?: number;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  imageFile,
  isOpen,
  onClose,
  onSave,
  aspectRatio = 1
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (imageFile && isOpen) {
      console.log('ImageEditor: Loading new image file:', imageFile.name, imageFile.size);
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      // Reset editing state when new image is loaded
      setCropArea({ x: 0, y: 0, width: 100, height: 100 });
      setRotation(0);
      setIsProcessing(false);
      console.log('ImageEditor: Image URL created and state reset');
      return () => {
        URL.revokeObjectURL(url);
        console.log('ImageEditor: Image URL revoked');
      };
    }
  }, [imageFile, isOpen]);

  const processImage = useCallback(async () => {
    console.log('ImageEditor: Starting image processing...');
    
    if (!imageRef.current || !canvasRef.current || !imageFile) {
      console.error('ImageEditor: Missing required elements for processing');
      return;
    }

    setIsProcessing(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      console.log('ImageEditor: Image natural dimensions:', img.naturalWidth, 'x', img.naturalHeight);
      console.log('ImageEditor: Crop area:', cropArea);
      console.log('ImageEditor: Rotation:', rotation);

      // Calculate crop dimensions
      const cropWidth = Math.max(1, (img.naturalWidth * cropArea.width) / 100);
      const cropHeight = Math.max(1, (img.naturalHeight * cropArea.height) / 100);
      
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      console.log('ImageEditor: Canvas dimensions set to:', canvas.width, 'x', canvas.height);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply rotation and cropping
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      const sourceX = (img.naturalWidth * cropArea.x) / 100;
      const sourceY = (img.naturalHeight * cropArea.y) / 100;

      console.log('ImageEditor: Drawing image with source coordinates:', sourceX, sourceY);

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        cropWidth,
        cropHeight,
        -cropWidth / 2,
        -cropHeight / 2,
        cropWidth,
        cropHeight
      );
      
      ctx.restore();

      console.log('ImageEditor: Image drawn on canvas, converting to blob...');

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const editedFile = new File([blob], imageFile.name || 'edited-image.png', {
            type: 'image/png'
          });
          console.log('ImageEditor: Image processed successfully, file size:', editedFile.size);
          onSave(editedFile);
        } else {
          console.error('ImageEditor: Failed to create blob from canvas');
          throw new Error('Failed to create blob from canvas');
        }
      }, 'image/png', 0.9);
    } catch (error) {
      console.error('ImageEditor: Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [cropArea, rotation, imageFile, onSave]);

  const handleClose = () => {
    console.log('ImageEditor: Closing editor');
    setImageUrl('');
    setCropArea({ x: 0, y: 0, width: 100, height: 100 });
    setRotation(0);
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen || !imageFile) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-armenian">Նկարի խմբագրում</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {imageUrl && (
            <div className="relative bg-gray-100 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Խմբագրվող նկար"
                className="max-w-full max-h-96 mx-auto block"
                style={{
                  transform: `rotate(${rotation}deg)`,
                }}
                onLoad={() => console.log('ImageEditor: Preview image loaded successfully')}
                onError={(e) => {
                  console.error('ImageEditor: Preview image load error:', e);
                  console.error('ImageEditor: Image URL:', imageUrl);
                }}
              />
              <div 
                className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-30 pointer-events-none"
                style={{
                  left: `${cropArea.x}%`,
                  top: `${cropArea.y}%`,
                  width: `${cropArea.width}%`,
                  height: `${cropArea.height}%`,
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-armenian font-medium mb-3 flex items-center gap-2">
                <Crop className="w-4 h-4" />
                Կտրում
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">X դիրք (%)</label>
                  <Slider
                    value={[cropArea.x]}
                    onValueChange={([x]) => setCropArea(prev => ({ ...prev, x }))}
                    max={100 - cropArea.width}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{cropArea.x}%</span>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Y դիրք (%)</label>
                  <Slider
                    value={[cropArea.y]}
                    onValueChange={([y]) => setCropArea(prev => ({ ...prev, y }))}
                    max={100 - cropArea.height}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{cropArea.y}%</span>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Լայնություն (%)</label>
                  <Slider
                    value={[cropArea.width]}
                    onValueChange={([width]) => setCropArea(prev => ({ ...prev, width }))}
                    min={10}
                    max={100 - cropArea.x}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{cropArea.width}%</span>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Բարձրություն (%)</label>
                  <Slider
                    value={[cropArea.height]}
                    onValueChange={([height]) => setCropArea(prev => ({ ...prev, height }))}
                    min={10}
                    max={100 - cropArea.y}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{cropArea.height}%</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-armenian font-medium mb-3 flex items-center gap-2">
                <RotateCw className="w-4 h-4" />
                Պտտում
              </h3>
              <div className="space-y-3">
                <Slider
                  value={[rotation]}
                  onValueChange={([rot]) => setRotation(rot)}
                  min={-180}
                  max={180}
                  step={15}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">{rotation}°</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setRotation(0)}
                >
                  Վերականգնել պտտումը
                </Button>
              </div>
            </Card>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
            Չեղարկել
          </Button>
          <Button onClick={processImage} disabled={isProcessing}>
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Պահպանել
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
