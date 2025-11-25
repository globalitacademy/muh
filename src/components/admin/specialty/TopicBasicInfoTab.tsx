
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, FileText, Video } from 'lucide-react';
import { useVideoUpload } from '@/hooks/useVideoUpload';
import { usePdfUpload } from '@/hooks/usePdfUpload';
import { toast } from 'sonner';

interface TopicBasicInfoFormData {
  title: string;
  title_en: string;
  title_ru: string;
  description: string;
  description_en: string;
  description_ru: string;
  video_url: string;
  duration_minutes: number;
  order_index: number;
  is_free: boolean;
  content_type: 'video' | 'pdf' | 'none';
}

interface TopicBasicInfoTabProps {
  formData: TopicBasicInfoFormData;
  onFormDataChange: (updates: Partial<TopicBasicInfoFormData>) => void;
}

const TopicBasicInfoTab = ({ formData, onFormDataChange }: TopicBasicInfoTabProps) => {
  const { uploadVideo, deleteVideo, uploading: videoUploading } = useVideoUpload();
  const { uploadPdf, deletePdf, uploading: pdfUploading } = usePdfUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState<'video' | 'pdf'>(formData.content_type === 'pdf' ? 'pdf' : 'video');
  
  const uploading = videoUploading || pdfUploading;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    let url: string | null = null;
    if (contentType === 'video') {
      url = await uploadVideo(selectedFile);
    } else {
      url = await uploadPdf(selectedFile);
    }
    
    if (url) {
      onFormDataChange({ 
        video_url: url,
        content_type: contentType
      });
      setSelectedFile(null);
    }
  };

  const handleRemoveContent = async () => {
    if (formData.video_url && formData.video_url.includes('topic-videos')) {
      if (formData.content_type === 'pdf') {
        await deletePdf(formData.video_url);
      } else {
        await deleteVideo(formData.video_url);
      }
    }
    onFormDataChange({ 
      video_url: '',
      content_type: 'none'
    });
    setSelectedFile(null);
  };

  const isUploadedContent = formData.video_url && formData.video_url.includes('topic-videos');
  const isPdf = formData.content_type === 'pdf' || formData.video_url?.endsWith('.pdf');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title" className="font-armenian">Վերնագիր (հայերեն)</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onFormDataChange({ title: e.target.value })}
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="is_free"
            type="checkbox"
            checked={formData.is_free}
            onChange={(e) => onFormDataChange({ is_free: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="is_free" className="font-armenian">Անվճար թեմա</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration_minutes" className="font-armenian">Տևողություն (րոպե)</Label>
          <Input
            id="duration_minutes"
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => onFormDataChange({ duration_minutes: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="order_index" className="font-armenian">Հերթականություն</Label>
          <Input
            id="order_index"
            type="number"
            value={formData.order_index}
            onChange={(e) => onFormDataChange({ order_index: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="font-armenian">Նկարագրություն</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFormDataChange({ description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-3">
        <Label className="font-armenian">Դասի նյութ</Label>
        
        {/* Content Type Selection */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={contentType === 'video' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setContentType('video')}
            disabled={!!formData.video_url || uploading}
            className="font-armenian"
          >
            <Video className="w-4 h-4 mr-2" />
            Վիդեո
          </Button>
          <Button
            type="button"
            variant={contentType === 'pdf' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setContentType('pdf')}
            disabled={!!formData.video_url || uploading}
            className="font-armenian"
          >
            <FileText className="w-4 h-4 mr-2" />
            PDF պրեզենտացիա
          </Button>
        </div>
        
        {/* YouTube URL Input (only for video) */}
        {contentType === 'video' && (
          <div>
            <Label htmlFor="video_url" className="text-sm font-armenian">YouTube URL</Label>
            <Input
              id="video_url"
              value={formData.video_url}
              onChange={(e) => onFormDataChange({ 
                video_url: e.target.value,
                content_type: 'video'
              })}
              placeholder="https://youtube.com/..."
              disabled={!!selectedFile || uploading}
            />
          </div>
        )}

        {/* Divider */}
        {contentType === 'video' && (
          <div className="flex items-center gap-2">
            <div className="flex-1 border-t border-border" />
            <span className="text-sm text-muted-foreground font-armenian">կամ</span>
            <div className="flex-1 border-t border-border" />
          </div>
        )}

        {/* File Upload */}
        <div>
          <Label className="text-sm font-armenian">
            {contentType === 'video' ? 'Վերբեռնել վիդեո' : 'Վերբեռնել PDF'}
          </Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              type="file"
              accept={contentType === 'video' 
                ? "video/mp4,video/webm,video/ogg,video/quicktime" 
                : "application/pdf"}
              onChange={handleFileSelect}
              disabled={!!formData.video_url || uploading}
              className="flex-1"
            />
            {selectedFile && (
              <Button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                size="sm"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Վերբեռնում...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Վերբեռնել
                  </>
                )}
              </Button>
            )}
          </div>
          {selectedFile && (
            <p className="text-sm text-muted-foreground mt-1 font-armenian">
              Ընտրված: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Current Content Display */}
        {formData.video_url && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-medium font-armenian">
                {isUploadedContent 
                  ? (isPdf ? 'Վերբեռնված PDF' : 'Վերբեռնված վիդեո')
                  : 'YouTube հղում'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {formData.video_url}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveContent}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicBasicInfoTab;
