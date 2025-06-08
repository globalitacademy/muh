
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayCircle, FileText, Image, Code, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';

interface TopicContentProps {
  topicId: string;
  onComplete: () => void;
}

const TopicContent = ({ topicId, onComplete }: TopicContentProps) => {
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
    queryKey: ['topic-content', topicId],
    queryFn: async () => {
      console.log('Fetching topic content for:', topicId);
      const { data, error } = await supabase
        .from('topics')
        .select('title, content, video_url, exercises, resources')
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
      
      // Calculate total sections needed for completion
      const totalSections = 2; // video + theory content
      if (newCompleted.length >= totalSections) {
        setTimeout(onComplete, 1000);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-pulse font-armenian">Բեռնվում է բովանդակությունը...</div>
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
              Սխալ է տեղի ունեցել բովանդակությունը բեռնելիս
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get the proper embed URL for the video
  const embedUrl = getYouTubeEmbedUrl(topic.video_url);

  return (
    <div className="space-y-6">
      {/* Video Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-armenian">
            <PlayCircle className="w-5 h-5 text-edu-blue" />
            Տեսանյութ դաս
          </CardTitle>
        </CardHeader>
        <CardContent>
          {embedUrl ? (
            <div className="aspect-video mb-4">
              <iframe
                src={embedUrl}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title={`${topic.title} - Տեսանյութ դաս`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
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
                <p className="text-muted-foreground font-armenian">Տեսանյութը շուտով կլինի հասանելի</p>
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
                Տեսանյութը դիտված է
              </>
            ) : (
              'Նշել որպես դիտված'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Theory Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-armenian">
            <FileText className="w-5 h-5 text-edu-blue" />
            Տեսական նյութ
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topic.content ? (
            <div className="prose prose-sm max-w-none font-armenian mb-4">
              <ReactMarkdown>{topic.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-muted-foreground font-armenian mb-4">
              Տեսական նյութը շուտով կլինի հասանելի
            </p>
          )}
          
          <Button 
            onClick={() => markSectionComplete('theory')}
            disabled={completedSections.includes('theory')}
            className="font-armenian"
            variant={completedSections.includes('theory') ? "default" : "outline"}
          >
            {completedSections.includes('theory') ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Ավարտված
              </>
            ) : (
              'Նշել որպես ավարտված'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resources Section (if available) */}
      {topic.resources && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-armenian">
              <Code className="w-5 h-5 text-edu-blue" />
              Լրացուցիչ ռեսուրսներ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none font-armenian">
              <ReactMarkdown>{JSON.stringify(topic.resources)}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TopicContent;
