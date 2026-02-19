import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, FileText, Video, Sparkles } from 'lucide-react';
import { useVideoUpload } from '@/hooks/useVideoUpload';
import { usePdfUpload } from '@/hooks/usePdfUpload';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

type AIGenerationStatus =
  | 'idle'
  | 'generating_script'
  | 'generating_video'
  | 'uploading'
  | 'done'
  | 'error';

const STATUS_MESSAGES: Record<AIGenerationStatus, string> = {
  idle: '',
  generating_script: 'Ստեղծում եմ վիդեո սցենար...',
  generating_video: 'Ստեղծում եմ վիդեո AI-ի միջոցով... (կարող է տևել 2-5 րոպե)',
  uploading: 'Վերբեռնում եմ վիդեոն...',
  done: 'Պատրաստ է!',
  error: '',
};

const TopicBasicInfoTab = ({ formData, onFormDataChange }: TopicBasicInfoTabProps) => {
  const { uploadVideo, deleteVideo, uploading: videoUploading } = useVideoUpload();
  const { uploadPdf, deletePdf, uploading: pdfUploading } = usePdfUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState<'video' | 'pdf'>(formData.content_type === 'pdf' ? 'pdf' : 'video');
  const [aiStatus, setAiStatus] = useState<AIGenerationStatus>('idle');
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const uploading = videoUploading || pdfUploading;
  const isAiGenerating = aiStatus !== 'idle' && aiStatus !== 'done' && aiStatus !== 'error';

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const handleGenerateWithAI = async () => {
    if (!formData.title.trim()) {
      toast.error('Նախ մուտքագրեք թեմայի վերնագիրը');
      return;
    }

    setAiStatus('generating_script');

    try {
      // Step 1: Start the generation job
      const { data: startData, error: startError } = await supabase.functions.invoke(
        'generate-topic-video',
        {
          body: { topicTitle: formData.title },
          headers: { 'x-query-action': 'start' },
        }
      );

      // invoke doesn't support query params directly; use fetch instead
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const startResp = await fetch(
        `${supabaseUrl}/functions/v1/generate-topic-video?action=start`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${anonKey}`,
            apikey: anonKey,
          },
          body: JSON.stringify({ topicTitle: formData.title }),
        }
      );

      const startResult = await startResp.json();

      if (!startResp.ok || startResult.error) {
        throw new Error(startResult.error || 'Վիդեո ստեղծման սկիզբը ձախողվեց');
      }

      const { operationName } = startResult;
      if (!operationName) {
        throw new Error('Չստացվեց գործողության անունը');
      }

      setAiStatus('generating_video');

      // Step 2: Poll for completion
      pollingRef.current = setInterval(async () => {
        try {
          const statusResp = await fetch(
            `${supabaseUrl}/functions/v1/generate-topic-video?action=status`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${anonKey}`,
                apikey: anonKey,
              },
              body: JSON.stringify({ operationName }),
            }
          );

          const statusResult = await statusResp.json();

          if (statusResult.error) {
            stopPolling();
            setAiStatus('error');
            toast.error(`Վիդեո ստեղծման սխալ: ${statusResult.error}`);
            return;
          }

          if (statusResult.done) {
            stopPolling();

            if (statusResult.videoUrl) {
              setAiStatus('uploading');
              // Small delay for UX
              await new Promise((r) => setTimeout(r, 500));
              setAiStatus('done');
              onFormDataChange({
                video_url: statusResult.videoUrl,
                content_type: 'video',
              });
              toast.success('Վիդեոն հաջողությամբ ստեղծվեց AI-ի միջոցով');
              setTimeout(() => setAiStatus('idle'), 2000);
            } else {
              setAiStatus('error');
              toast.error('Վիդեոյի URL-ը չստացվեց');
            }
          }
          // else: still generating, keep polling
        } catch (pollErr) {
          stopPolling();
          setAiStatus('error');
          toast.error('Վիդեոյի կարգավիճակի ստուգման սխալ');
        }
      }, 12000); // poll every 12 seconds
    } catch (err) {
      stopPolling();
      setAiStatus('error');
      const message = err instanceof Error ? err.message : 'Անհայտ սխալ';
      toast.error(`AI վիդեո ստեղծման սխալ: ${message}`);
      setTimeout(() => setAiStatus('idle'), 3000);
    }
  };

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
    stopPolling();
    setAiStatus('idle');
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

        {/* Content Type Selection + AI Button */}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={contentType === 'video' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setContentType('video')}
            disabled={!!formData.video_url || uploading || isAiGenerating}
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
            disabled={!!formData.video_url || uploading || isAiGenerating}
            className="font-armenian"
          >
            <FileText className="w-4 h-4 mr-2" />
            PDF պրեզենտացիա
          </Button>

          {/* Generate with AI button — only visible for video type when no video is set */}
          {contentType === 'video' && !formData.video_url && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateWithAI}
              disabled={uploading || isAiGenerating}
              className="font-armenian border-primary text-primary hover:bg-primary/10"
            >
              {isAiGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {STATUS_MESSAGES[aiStatus]}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ստեղծել AI-ով
                </>
              )}
            </Button>
          )}
        </div>

        {/* AI generation progress panel */}
        {isAiGenerating && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium font-armenian text-primary">
                {STATUS_MESSAGES[aiStatus]}
              </p>
              {aiStatus === 'generating_video' && (
                <p className="text-xs text-muted-foreground font-armenian mt-0.5">
                  Խնդրում ենք սպասել, վիդեոն ստեղծվում է...
                </p>
              )}
            </div>
          </div>
        )}

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
              disabled={!!selectedFile || uploading || isAiGenerating}
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
              disabled={!!formData.video_url || uploading || isAiGenerating}
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
