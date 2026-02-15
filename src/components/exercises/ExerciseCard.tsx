
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';
import { Exercise } from './types';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

const ExerciseCard = ({
  exercise,
  index
}: ExerciseCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'հեշտ':
      case 'easy':
        return 'bg-primary text-white';
      case 'միջին':
      case 'medium':
        return 'bg-edu-orange text-white';
      case 'բարդ':
      case 'hard':
        return 'bg-destructive text-white';
      default:
        return 'bg-muted-foreground text-white';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="font-armenian flex items-center gap-2">
            <span className="text-muted-foreground">{index}.</span>
            {exercise.title}
          </CardTitle>
          {exercise.difficulty &&
          <Badge className={getDifficultyColor(exercise.difficulty)}>
              {exercise.difficulty}
            </Badge>
          }
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-armenian whitespace-pre-line text-foreground leading-relaxed text-left">
          {exercise.description}
        </p>
        
        {exercise.hint &&
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 font-armenian">Հուշում</p>
                <p className="text-sm text-blue-700 dark:text-blue-400 font-armenian text-left">{exercise.hint}</p>
              </div>
            </div>
          </div>
        }
      </CardContent>
    </Card>);

};

export default ExerciseCard;