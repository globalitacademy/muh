
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, PenTool, CheckCircle, PlayCircle } from 'lucide-react';
import TopicVideoLesson from '@/components/topic/TopicVideoLesson';
import TopicContent from '@/components/TopicContent';
import TopicExercises from '@/components/TopicExercises';
import TopicQuiz from '@/components/TopicQuiz';
import { Topic } from '@/types/database';

interface TopicTabsProps {
  topicId: string;
  topic: Topic;
  activeTab: string;
  onTabChange: (value: string) => void;
  onCompleteLesson: () => void;
  availableTabs: string[];
  getNextTab: (currentTab: string) => string | null;
}

const TopicTabs = ({ 
  topicId, 
  topic,
  activeTab, 
  onTabChange, 
  onCompleteLesson, 
  availableTabs,
  getNextTab 
}: TopicTabsProps) => {
  
  const handleComplete = (currentTab: string) => {
    const nextTab = getNextTab(currentTab);
    if (nextTab) {
      onTabChange(nextTab);
    } else {
      onCompleteLesson();
    }
  };

  // Define grid classes based on number of available tabs
  const getGridClass = () => {
    switch (availableTabs.length) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      default: return 'grid-cols-4';
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className={`grid w-full ${getGridClass()}`}>
        {/* Always show content tab */}
        <TabsTrigger value="content" className="font-armenian">
          <BookOpen className="w-4 h-4 mr-2" />
          Տեսական մաս
        </TabsTrigger>
        
        {/* Show video tab only if video content exists */}
        {availableTabs.includes('video') && (
          <TabsTrigger value="video" className="font-armenian">
            <PlayCircle className="w-4 h-4 mr-2" />
            Տեսադաս
          </TabsTrigger>
        )}
        
        {/* Show exercises tab only if exercises exist */}
        {availableTabs.includes('exercises') && (
          <TabsTrigger value="exercises" className="font-armenian">
            <PenTool className="w-4 h-4 mr-2" />
            Վարժություններ
          </TabsTrigger>
        )}
        
        {/* Show quiz tab only if quiz questions exist */}
        {availableTabs.includes('quiz') && (
          <TabsTrigger value="quiz" className="font-armenian">
            <CheckCircle className="w-4 h-4 mr-2" />
            Ստուգողական թեստ
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="content" className="space-y-6">
        <TopicContent topicId={topicId} onComplete={() => handleComplete('content')} />
      </TabsContent>

      {availableTabs.includes('video') && (
        <TabsContent value="video" className="space-y-6">
          <TopicVideoLesson topicId={topicId} onComplete={() => handleComplete('video')} />
        </TabsContent>
      )}

      {availableTabs.includes('exercises') && (
        <TabsContent value="exercises" className="space-y-6">
          <TopicExercises 
            topicId={topicId} 
            moduleId={topic.module_id}
            onComplete={() => handleComplete('exercises')} 
          />
        </TabsContent>
      )}

      {availableTabs.includes('quiz') && (
        <TabsContent value="quiz" className="space-y-6">
          <TopicQuiz 
            topicId={topicId} 
            moduleId={topic.module_id}
            onComplete={onCompleteLesson} 
          />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default TopicTabs;
