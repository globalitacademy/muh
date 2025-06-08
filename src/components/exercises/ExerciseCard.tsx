
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lightbulb } from 'lucide-react';
import { Exercise } from './types';

interface ExerciseCardProps {
  exercise: Exercise;
  answer: string;
  isCompleted: boolean;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
}

const ExerciseCard = ({
  exercise,
  answer,
  isCompleted,
  onAnswerChange,
  onSubmit
}: ExerciseCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'հեշտ':
      case 'easy': 
        return 'bg-green-100 text-green-800';
      case 'միջին':
      case 'medium': 
        return 'bg-yellow-100 text-yellow-800';
      case 'բարդ':
      case 'hard': 
        return 'bg-red-100 text-red-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={isCompleted ? 'border-green-200 bg-green-50/50' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="font-armenian">{exercise.title}</CardTitle>
          {exercise.difficulty && (
            <Badge className={getDifficultyColor(exercise.difficulty)}>
              {exercise.difficulty}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-armenian whitespace-pre-line">{exercise.description}</p>
        
        {/* Hint */}
        {exercise.hint && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 font-armenian">Հուշում</p>
                <p className="text-sm text-blue-700 font-armenian">{exercise.hint}</p>
              </div>
            </div>
          </div>
        )}

        {/* Answer Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium font-armenian">Ձեր պատասխանը՝</label>
          <Textarea
            placeholder="Գրեք ձեր պատասխանը այստեղ..."
            value={answer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            disabled={isCompleted}
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onSubmit}
            disabled={!answer?.trim() || isCompleted}
            className="font-armenian"
          >
            {isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Ստուգված
              </>
            ) : (
              'Ստուգել պատասխանը'
            )}
          </Button>
          
          {isCompleted && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-armenian">Ճիշտ է!</span>
            </div>
          )}
        </div>

        {/* Show expected answer after completion */}
        {isCompleted && exercise.expectedAnswer && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm font-medium text-green-800 font-armenian mb-1">Ակնկալվող պատասխան՝</p>
            <p className="text-sm text-green-700 font-armenian">{exercise.expectedAnswer}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
