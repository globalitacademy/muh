
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, PenTool, CheckCircle, Clock, Target, Lock } from 'lucide-react';
import TopicContent from '@/components/TopicContent';
import TopicExercises from '@/components/TopicExercises';
import TopicQuiz from '@/components/TopicQuiz';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEnrollments } from '@/hooks/useEnrollments';

const TopicDetail = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: enrollments } = useEnrollments();
  const [activeTab, setActiveTab] = useState('content');
  const [progress, setProgress] = useState(0);

  console.log('TopicDetail - Topic ID from params:', topicId);
  console.log('TopicDetail - Current user:', user?.id);

  // Fetch topic data from database
  const { data: topic, isLoading, error } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: async () => {
      if (!topicId) throw new Error('Topic ID is required');
      
      console.log('TopicDetail - Fetching topic data for ID:', topicId);
      
      const { data, error } = await supabase
        .from('topics')
        .select(`
          *,
          modules (
            id,
            title,
            specialty_id
          )
        `)
        .eq('id', topicId)
        .maybeSingle();
      
      if (error) {
        console.error('TopicDetail - Error fetching topic:', error);
        throw error;
      }
      
      console.log('TopicDetail - Topic data fetched:', data);
      return data;
    },
    enabled: !!topicId
  });

  // Check if user has access to this topic
  const hasAccess = React.useMemo(() => {
    if (!topic) return false;
    
    // Free topics are accessible to everyone
    if (topic.is_free) {
      console.log('TopicDetail - Topic is free, granting access');
      return true;
    }
    
    // For paid topics, check if user is enrolled in the module
    if (user && enrollments && topic.modules) {
      const isEnrolled = enrollments.some(e => e.module_id === topic.module_id);
      console.log('TopicDetail - User enrollment check:', { isEnrolled, moduleId: topic.module_id });
      return isEnrolled;
    }
    
    console.log('TopicDetail - No access granted');
    return false;
  }, [topic, user, enrollments]);

  const handleTabChange = (value: string) => {
    if (!hasAccess) return;
    
    setActiveTab(value);
    // Update progress based on completed sections
    if (value === 'exercises' && progress < 33) {
      setProgress(33);
    } else if (value === 'quiz' && progress < 66) {
      setProgress(66);
    }
  };

  const handleCompleteLesson = () => {
    if (!hasAccess) return;
    
    setProgress(100);
    // Navigate back to module
    if (topic?.modules) {
      navigate(`/module/${topic.module_id}`);
    } else {
      navigate(-1);
    }
  };

  const handleBackToModule = () => {
    if (topic?.modules) {
      navigate(`/module/${topic.module_id}`);
    } else {
      navigate(-1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse font-armenian">Բեռնվում է...</div>
      </div>
    );
  }

  if (error) {
    console.error('TopicDetail - Error state:', error);
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Վերադառնալ
          </Button>
          
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-destructive mb-2 font-armenian">Սխալ</h2>
            <p className="text-muted-foreground font-armenian">
              Սխալ է տեղի ունեցել տվյալները բեռնելիս: {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    console.log('TopicDetail - No topic found for ID:', topicId);
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Վերադառնալ
          </Button>
          
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-destructive mb-2 font-armenian">Թեման չի գտնվել</h2>
            <p className="text-muted-foreground font-armenian">
              Խնդրված թեման գոյություն չունի կամ հեռացվել է
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Access denied for paid topics
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={handleBackToModule}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Վերադառնալ մոդուլ
          </Button>
          
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold mb-2 font-armenian">Մուտքը սահմանափակ է</h2>
            <p className="text-muted-foreground font-armenian mb-6">
              Այս դասը հասանելի է միայն գրանցված ուսանողների համար
            </p>
            <Button 
              onClick={handleBackToModule}
              className="btn-modern font-armenian"
            >
              Վերադառնալ մոդուլ
            </Button>
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
          onClick={handleBackToModule}
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
            {topic.is_free && (
              <>
                <span>•</span>
                <span className="text-green-600 font-armenian">Անվճար</span>
              </>
            )}
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
