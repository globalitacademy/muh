
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, PenTool, CheckCircle, PlayCircle, Clock, Target } from 'lucide-react';
import TopicContent from '@/components/TopicContent';
import TopicExercises from '@/components/TopicExercises';
import TopicQuiz from '@/components/TopicQuiz';

const TopicDetail = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');
  const [progress, setProgress] = useState(0);

  // Mock data - in real app this would come from database
  const topic = {
    id: topicId,
    title: 'Ալգորիթմի սահմանումը և նրա ներկայացման եղանակները',
    description: 'Ալգորիթմի հիմնական սահմանումը, նրա նշանակությունը և ներկայացման տարբեր մեթոդները',
    duration: 120,
    order_index: 1,
    objectives: [
      'Հասկանալ ալգորիթմի սահմանումը և նշանակությունը',
      'Ծանոթանալ ալգորիթմների ներկայացման եղանակների հետ',
      'Սովորել ալգորիթմների գրառման կանոնները'
    ]
  };

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
            <span>{topic.duration} րոպե</span>
          </div>
          
          <h1 className="text-3xl font-bold font-armenian mb-4">{topic.title}</h1>
          
          <p className="text-lg text-muted-foreground font-armenian mb-6">
            {topic.description}
          </p>

          {/* Learning Objectives */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-armenian">
                <Target className="w-5 h-5 text-edu-blue" />
                Ուսումնական նպատակներ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {topic.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2 font-armenian">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

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
