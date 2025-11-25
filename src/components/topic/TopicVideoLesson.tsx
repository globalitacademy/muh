
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TopicVideoLessonProps {
  topicId: string;
  onComplete: () => void;
}

const TopicVideoLesson = ({ topicId, onComplete }: TopicVideoLessonProps) => {
  const [completedSections, setCompletedSections] = useState<string[]>([]);

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
      console.log('Fetching topic video for:', topicId);
      const { data, error } = await supabase
        .from('topics')
        .select('title, video_url')
        .eq('id', topicId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching topic video:', error);
        throw error;
      }
      
      console.log('Topic video fetched:', data);
      return data;
    },
    enabled: !!topicId
  });

  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      const newCompleted = [...completedSections, sectionId];
      setCompletedSections(newCompleted);
      
      // Complete the video lesson after marking as watched
      if (sectionId === 'video') {
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

  // Get the proper embed URL for the video
  const embedUrl = getYouTubeEmbedUrl(topic.video_url);
  const isUploadedVideo = topic.video_url && topic.video_url.includes('topic-videos');

  return (
    <div className="space-y-6">
      {/* Video Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-armenian">
            <PlayCircle className="w-5 h-5 text-edu-blue" />
            Տեսադաս
          </CardTitle>
        </CardHeader>
        <CardContent>
          {embedUrl ? (
            <div className="aspect-video mb-4">
              <iframe
                src={embedUrl}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title={`${topic.title} - Տեսադաս`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ) : isUploadedVideo ? (
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
          )}
          <Button 
            onClick={() => markSectionComplete('video')}
            disabled={completedSections.includes('video')}
            className="w-full font-armenian"
          >
            {completedSections.includes('video') ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Տեսադասը դիտված է
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
