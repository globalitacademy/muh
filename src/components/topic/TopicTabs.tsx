
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, PenTool, CheckCircle, PlayCircle } from 'lucide-react';
import TopicVideoLesson from '@/components/topic/TopicVideoLesson';
import TopicContent from '@/components/TopicContent';
import TopicExercises from '@/components/TopicExercises';
import TopicQuiz from '@/components/TopicQuiz';

interface TopicTabsProps {
  topicId: string;
  activeTab: string;
  onTabChange: (value: string) => void;
  onCompleteLesson: () => void;
}

const TopicTabs = ({ topicId, activeTab, onTabChange, onCompleteLesson }: TopicTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="video" className="font-armenian">
          <PlayCircle className="w-4 h-4 mr-2" />
          Տեսադաս
        </TabsTrigger>
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

      <TabsContent value="video" className="space-y-6">
        <TopicVideoLesson topicId={topicId} onComplete={() => onTabChange('content')} />
      </TabsContent>

      <TabsContent value="content" className="space-y-6">
        <TopicContent topicId={topicId} onComplete={() => onTabChange('exercises')} />
      </TabsContent>

      <TabsContent value="exercises" className="space-y-6">
        <TopicExercises topicId={topicId} onComplete={() => onTabChange('quiz')} />
      </TabsContent>

      <TabsContent value="quiz" className="space-y-6">
        <TopicQuiz topicId={topicId} onComplete={onCompleteLesson} />
      </TabsContent>
    </Tabs>
  );
};

export default TopicTabs;
