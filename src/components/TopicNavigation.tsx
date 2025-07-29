
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface Topic {
  id: string;
  title: string;
  order_index: number;
  is_free: boolean;
}

interface TopicNavigationProps {
  currentTopic: Topic;
  previousTopic?: Topic;
  nextTopic?: Topic;
  moduleId: string;
  hasAccess: boolean;
}

const TopicNavigation = ({ 
  currentTopic, 
  previousTopic, 
  nextTopic, 
  moduleId, 
  hasAccess 
}: TopicNavigationProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handlePreviousTopic = () => {
    if (previousTopic && hasAccess) {
      navigate(`/topic/${previousTopic.id}`);
    }
  };

  const handleNextTopic = () => {
    if (nextTopic && hasAccess) {
      navigate(`/topic/${nextTopic.id}`);
    }
  };

  const handleBackToModule = () => {
    navigate(`/module/${moduleId}`);
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousTopic}
            disabled={!previousTopic || !hasAccess}
            className="font-armenian"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {previousTopic ? `${t('topic.previous')}՝ ${previousTopic.title}` : t('topic.previous-lesson')}
          </Button>

          <Button
            variant="ghost"
            onClick={handleBackToModule}
            className="font-armenian"
          >
            <List className="w-4 h-4 mr-2" />
            {t('topic.all-lessons')}
          </Button>

          <Button
            variant="outline"
            onClick={handleNextTopic}
            disabled={!nextTopic || !hasAccess}
            className="font-armenian"
          >
            {nextTopic ? `${t('topic.next')}՝ ${nextTopic.title}` : t('topic.next-lesson')}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicNavigation;
