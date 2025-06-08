
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Code, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';

interface TopicContentProps {
  topicId: string;
  onComplete: () => void;
}

const TopicContent = ({ topicId, onComplete }: TopicContentProps) => {
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  // Fetch topic content from database
  const { data: topic, isLoading, error } = useQuery({
    queryKey: ['topic-content', topicId],
    queryFn: async () => {
      console.log('Fetching topic content for:', topicId);
      const { data, error } = await supabase
        .from('topics')
        .select('title, content, resources')
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
      
      // Complete the theoretical content after marking as finished
      if (sectionId === 'theory') {
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

  return (
    <div className="space-y-6">
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
