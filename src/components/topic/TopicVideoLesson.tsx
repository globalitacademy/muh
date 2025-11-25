
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, CheckCircle, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface TopicVideoLessonProps {
  topicId: string;
  onComplete: () => void;
}

const TopicVideoLesson = ({ topicId, onComplete }: TopicVideoLessonProps) => {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // Helper function to convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    
    try {
      // Handle different YouTube URL formats
      const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(youtubeRegex);
      
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
      
      // If it's already an embed URL, return as is
      if (url.includes('youtube.com/embed/')) {
        return url;
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
      return null;
    }
  };

  // Fetch topic content from database
  const { data: topic, isLoading, error } = useQuery({
    queryKey: ['topic-video', topicId],
    queryFn: async () => {
      console.log('Fetching topic content for:', topicId);
      const { data, error } = await supabase
        .from('topics')
        .select('title, video_url, content_type')
        .eq('id', topicId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching topic content:', error);
        throw error;
      }
      
      console.log('Topic content fetched:', data);
      return data;
    },
    enabled: !!topicId
  });

  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      const newCompleted = [...completedSections, sectionId];
      setCompletedSections(newCompleted);
      
      // Complete the lesson after marking as viewed
      if (sectionId === 'content') {
        setTimeout(onComplete, 1000);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-pulse font-armenian">Բեռնվում է տեսադասը...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground font-armenian">
              Սխալ է տեղի ունեցել տեսադասը բեռնելիս
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine content type and get proper URLs
  const isPdf = topic.content_type === 'pdf' || topic.video_url?.endsWith('.pdf');
  const embedUrl = !isPdf ? getYouTubeEmbedUrl(topic.video_url) : null;
  const isUploadedContent = topic.video_url && topic.video_url.includes('topic-videos');

  return (
    <div className="space-y-6">
      {/* Content Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-armenian">
            {isPdf ? (
              <>
                <FileText className="w-5 h-5 text-edu-blue" />
                Պրեզենտացիա
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5 text-edu-blue" />
                Տեսադաս
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPdf ? (
            /* PDF Viewer */
            isUploadedContent ? (
              <div className="mb-4">
                <div className="bg-muted rounded-lg overflow-hidden">
                  <Document
                    file={topic.video_url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                      <div className="w-full h-[600px] flex items-center justify-center">
                        <div className="text-center">
                          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2 animate-pulse" />
                          <p className="text-muted-foreground font-armenian">Բեռնվում է...</p>
                        </div>
                      </div>
                    }
                    error={
                      <div className="w-full h-[600px] flex items-center justify-center">
                        <div className="text-center">
                          <FileText className="w-12 h-12 text-destructive mx-auto mb-2" />
                          <p className="text-destructive font-armenian">PDF-ը բեռնելու սխալ</p>
                        </div>
                      </div>
                    }
                  >
                    <div className="flex items-center justify-center bg-background p-4">
                      <Page 
                        pageNumber={pageNumber} 
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        className="shadow-lg"
                        width={Math.min(window.innerWidth - 100, 800)}
                      />
                    </div>
                  </Document>
                  
                  {/* PDF Navigation Controls */}
                  {numPages > 0 && (
                    <div className="flex items-center justify-between p-4 bg-background border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                        disabled={pageNumber <= 1}
                        className="font-armenian"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Նախորդ
                      </Button>
                      
                      <span className="text-sm font-armenian">
                        Էջ {pageNumber} / {numPages}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                        disabled={pageNumber >= numPages}
                        className="font-armenian"
                      >
                        Հաջորդ
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground font-armenian">PDF պրեզենտացիան շուտով կլինի հասանելի</p>
                </div>
              </div>
            )
          ) : (
            /* Video Player */
            embedUrl ? (
              <div className="aspect-video mb-4">
                <iframe
                  src={embedUrl}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  title={`${topic.title} - Տեսադաս`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            ) : isUploadedContent ? (
              <div className="aspect-video mb-4">
                <video
                  src={topic.video_url}
                  controls
                  className="w-full h-full rounded-lg"
                  title={`${topic.title} - Տեսադաս`}
                >
                  Ձեր բրաուզերը չի աջակցում վիդեո նվագարկմանը
                </video>
              </div>
            ) : topic.video_url ? (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <PlayCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground font-armenian mb-2">Անվավեր տեսանյութի հղում</p>
                  <p className="text-xs text-muted-foreground font-armenian">
                    Խնդրում ենք ստուգել YouTube հղումը
                  </p>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <PlayCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground font-armenian">Տեսադասը շուտով կլինի հասանելի</p>
                </div>
              </div>
            )
          )}
          <Button 
            onClick={() => markSectionComplete('content')}
            disabled={completedSections.includes('content')}
            className="w-full font-armenian"
          >
            {completedSections.includes('content') ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                {isPdf ? 'Պրեզենտացիան դիտված է' : 'Տեսադասը դիտված է'}
              </>
            ) : (
              'Նշել որպես դիտված'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopicVideoLesson;
