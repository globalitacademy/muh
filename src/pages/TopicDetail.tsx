
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, PenTool, CheckCircle, Clock, Target } from 'lucide-react';
import TopicContent from '@/components/TopicContent';
import TopicExercises from '@/components/TopicExercises';
import TopicQuiz from '@/components/TopicQuiz';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const TopicDetail = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');
  const [progress, setProgress] = useState(0);

  // Fetch topic data from database
  const { data: topic, isLoading, error } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: async () => {
      if (!topicId) throw new Error('Topic ID is required');
      
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('id', topicId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!topicId
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update progress based on completed sections
    if (value === 'exercises' && progress < 33) {
      setProgress(33);
    } else if (value === 'quiz' && progress < 66) {
      setProgress(66);
    }
  };

  const handleCompleteLesson = () => {
    setProgress(100);
    // Navigate to next topic or back to module
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse font-armenian">Բեռնվում է...</div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Վերադառնալ մոդուլ
          </Button>
          
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-destructive mb-2 font-armenian">Սխալ</h2>
            <p className="text-muted-foreground font-armenian">
              Թեման չի գտնվել կամ սխալ է առաջացել բեռնելիս
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Վերադառնալ մոդուլ
        </Button>

        {/* Topic Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="font-armenian">Դաս {topic.order_index}</span>
            <span>•</span>
            <Clock className="w-4 h-4" />
            <span>{topic.duration_minutes} րոպե</span>
          </div>
          
          <h1 className="text-3xl font-bold font-armenian mb-4">{topic.title}</h1>
          
          {topic.description && (
            <p className="text-lg text-muted-foreground font-armenian mb-6">
              {topic.description}
            </p>
          )}

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-armenian">Ուսումնական առաջընթաց</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content" className="font-armenian">
              <BookOpen className="w-4 h-4 mr-2" />
              Տեսական մաս
            </TabsTrigger>
            <TabsTrigger value="exercises" className="font-armenian">
              <PenTool className="w-4 h-4 mr-2" />
              Վարժություններ
            </TabsTrigger>
            <TabsTrigger value="quiz" className="font-armenian">
              <CheckCircle className="w-4 h-4 mr-2" />
              Ստուգողական թեստ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <TopicContent topicId={topicId!} onComplete={() => handleTabChange('exercises')} />
          </TabsContent>

          <TabsContent value="exercises" className="space-y-6">
            <TopicExercises topicId={topicId!} onComplete={() => handleTabChange('quiz')} />
          </TabsContent>

          <TabsContent value="quiz" className="space-y-6">
            <TopicQuiz topicId={topicId!} onComplete={handleCompleteLesson} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TopicDetail;
