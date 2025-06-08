
import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Crop, RotateCw, Download, Scissors, Loader2 } from 'lucide-react';

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
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const processImage = useCallback(async () => {
    if (!imageRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      if (!ctx) return;

      // Set canvas size based on crop area
      const cropWidth = (img.naturalWidth * cropArea.width) / 100;
      const cropHeight = (img.naturalHeight * cropArea.height) / 100;
      
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // Apply rotation and cropping
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      const sourceX = (img.naturalWidth * cropArea.x) / 100;
      const sourceY = (img.naturalHeight * cropArea.y) / 100;

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

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const editedFile = new File([blob], imageFile?.name || 'edited-image.png', {
            type: 'image/png'
          });
          onSave(editedFile);
          onClose();
        }
      }, 'image/png', 0.9);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [cropArea, rotation, imageFile, onSave, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-armenian">Նկարի խմբագրում</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {imageUrl && (
            <div className="relative">
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Խմբագրվող նկար"
                className="max-w-full max-h-96 mx-auto"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  clipPath: `inset(${cropArea.y}% ${100 - cropArea.x - cropArea.width}% ${100 - cropArea.y - cropArea.height}% ${cropArea.x}%)`
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
                  <label className="text-sm text-muted-foreground">X դիրք</label>
                  <Slider
                    value={[cropArea.x]}
                    onValueChange={([x]) => setCropArea(prev => ({ ...prev, x }))}
                    max={100 - cropArea.width}
                    step={1}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Y դիրք</label>
                  <Slider
                    value={[cropArea.y]}
                    onValueChange={([y]) => setCropArea(prev => ({ ...prev, y }))}
                    max={100 - cropArea.height}
                    step={1}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Լայնություն</label>
                  <Slider
                    value={[cropArea.width]}
                    onValueChange={([width]) => setCropArea(prev => ({ ...prev, width }))}
                    min={10}
                    max={100 - cropArea.x}
                    step={1}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Բարձրություն</label>
                  <Slider
                    value={[cropArea.height]}
                    onValueChange={([height]) => setCropArea(prev => ({ ...prev, height }))}
                    min={10}
                    max={100 - cropArea.y}
                    step={1}
                  />
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
                />
                <p className="text-sm text-muted-foreground">{rotation}°</p>
              </div>
            </Card>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
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
