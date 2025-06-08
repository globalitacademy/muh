
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock } from 'lucide-react';

interface TopicHeaderProps {
  topic: {
    title: string;
    description?: string;
    order_index: number;
    duration_minutes: number;
    is_free: boolean;
  };
  progress: number;
}

const TopicHeader = ({ topic, progress }: TopicHeaderProps) => {
  return (
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
  );
};

export default TopicHeader;
