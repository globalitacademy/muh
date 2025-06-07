
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, CheckCircle, Play } from 'lucide-react';

interface LearningProgressCardProps {
  enrollment: {
    id: string;
    enrolled_at: string;
    completed_at?: string;
    progress_percentage?: number;
    modules?: {
      title: string;
      description?: string;
      difficulty_level: string;
      instructor: string;
    };
  };
}

const LearningProgressCard = ({ enrollment }: LearningProgressCardProps) => {
  const isCompleted = !!enrollment.completed_at;
  const progress = enrollment.progress_percentage || 0;

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
      case 'սկսնակ':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
      case 'միջին':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
      case 'բարձր':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`transition-all hover:shadow-md ${isCompleted ? 'border-green-200 bg-green-50/50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-armenian">
              {enrollment.modules?.title || 'Դասընթաց'}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Դասախոս: {enrollment.modules?.instructor}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getDifficultyColor(enrollment.modules?.difficulty_level || '')}>
              {enrollment.modules?.difficulty_level}
            </Badge>
            {isCompleted && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Ավարտված
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {enrollment.modules?.description && (
          <p className="text-sm text-muted-foreground">
            {enrollment.modules.description}
          </p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Առաջընթաց</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Սկսված: {new Date(enrollment.enrolled_at).toLocaleDateString('hy-AM')}
            </div>
            {isCompleted && enrollment.completed_at && (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Ավարտված: {new Date(enrollment.completed_at).toLocaleDateString('hy-AM')}
              </div>
            )}
          </div>
          
          {!isCompleted && (
            <Button variant="outline" size="sm">
              <Play className="w-3 h-3 mr-1" />
              Շարունակել
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningProgressCard;
