
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Play, Lock, CheckCircle } from 'lucide-react';
import { Topic } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';

interface TopicCardProps {
  topic: Topic;
  isEnrolled: boolean;
  isCompleted?: boolean;
  onStart?: () => void;
}

const TopicCard = ({ topic, isEnrolled, isCompleted, onStart }: TopicCardProps) => {
  const { user } = useAuth();
  const canAccess = topic.is_free || isEnrolled;

  return (
    <Card className={`modern-card transition-all duration-300 ${
      canAccess ? 'hover:shadow-lg border-l-4 border-l-edu-blue cursor-pointer' : 'opacity-60'
    } ${isCompleted ? 'bg-green-50 border-l-green-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold font-armenian mb-1 flex items-center gap-2">
              {topic.title}
              {isCompleted && <CheckCircle className="w-4 h-4 text-green-600" />}
            </h3>
            <p className="text-sm text-muted-foreground font-armenian line-clamp-2">
              {topic.description}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {topic.is_free && (
              <Badge variant="secondary" className="text-xs">
                Անվճար
              </Badge>
            )}
            {!canAccess && <Lock className="w-4 h-4 text-muted-foreground" />}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{topic.duration_minutes} րոպե</span>
          </div>
          
          {canAccess && (
            <Button 
              size="sm" 
              onClick={onStart}
              variant={isCompleted ? "outline" : "default"}
              className="font-armenian"
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Ավարտված
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Սկսել
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicCard;
