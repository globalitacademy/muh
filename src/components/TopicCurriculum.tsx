
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Play, Lock, CheckCircle, BookOpen } from 'lucide-react';
import { Topic } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';

interface TopicCurriculumProps {
  topics: Topic[];
  hasFullAccess: boolean;
  onTopicClick: (topicId: string) => void;
}

const TopicCurriculum = ({ topics, hasFullAccess, onTopicClick }: TopicCurriculumProps) => {
  const { user } = useAuth();

  console.log('TopicCurriculum DEBUG:', {
    topicsCount: topics.length,
    hasFullAccess,
    userLoggedIn: !!user,
    userId: user?.id,
    topics: topics.map((t) => ({ id: t.id, title: t.title, is_free: t.is_free }))
  });

  const freeTopics = topics.filter((t) => t.is_free);
  const paidTopics = topics.filter((t) => !t.is_free);

  console.log('Filtered topics:', {
    freeTopicsCount: freeTopics.length,
    paidTopicsCount: paidTopics.length
  });

  const handleTopicClick = (topicId: string, canAccess: boolean) => {
    console.log('Topic click attempt:', { topicId, canAccess, hasFullAccess });
    if (canAccess) {
      onTopicClick(topicId);
    }
  };

  const TopicItem = ({ topic, canAccess }: {topic: Topic;canAccess: boolean;}) =>
  <Card className={`mb-4 transition-all duration-300 ${canAccess ? 'hover:shadow-md cursor-pointer border-l-4 border-l-edu-blue' : 'opacity-60'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-armenian mb-2 flex items-center gap-2 text-left">
              <span className="w-8 h-8 rounded-full bg-edu-blue/10 text-edu-blue flex items-center justify-center text-sm font-bold">
                {topic.order_index}
              </span>
              {topic.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-armenian">
              {topic.description}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {topic.is_free &&
          <Badge variant="secondary" className="text-xs font-armenian">
                Անվճար
              </Badge>
          }
            {!canAccess && <Lock className="w-4 h-4 text-muted-foreground" />}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{topic.duration_minutes} րոպե</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span className="font-armenian">Դաս {topic.order_index}</span>
            </div>
          </div>
          
          {canAccess &&
        <Button
          size="sm"
          onClick={() => handleTopicClick(topic.id, canAccess)}
          className="font-armenian">

              <Play className="w-4 h-4 mr-1" />
              Սկսել
            </Button>
        }
        </div>
      </CardContent>
    </Card>;


  return (
    <div className="space-y-8">
      {freeTopics.length > 0 &&
      <div>
          <h2 className="text-2xl font-bold font-armenian mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <Play className="w-4 h-4" />
            </div>
            Անվճար դասեր
          </h2>
          <div>
            {freeTopics.map((topic) =>
          <TopicItem
            key={topic.id}
            topic={topic}
            canAccess={true} />

          )}
          </div>
        </div>
      }

      {paidTopics.length > 0 &&
      <div>
          <h2 className="text-2xl font-bold font-armenian mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-edu-blue/10 text-edu-blue flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            Վճարովի դասեր
          </h2>
          <div>
            {paidTopics.map((topic) =>
          <TopicItem
            key={topic.id}
            topic={topic}
            canAccess={hasFullAccess} />

          )}
          </div>
        </div>
      }
    </div>);

};

export default TopicCurriculum;