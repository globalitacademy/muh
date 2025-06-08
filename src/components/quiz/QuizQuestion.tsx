
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { QuizQuestion as QuizQuestionType } from './types';

interface QuizQuestionProps {
  question: QuizQuestionType;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: string;
  onAnswerSelect: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
}

const QuizQuestion = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isLastQuestion
}: QuizQuestionProps) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-armenian">
          Ստուգողական թեստ
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="font-armenian">Հարց {currentQuestion + 1} / {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4 font-armenian">
            {question.question}
          </h3>
          
          <RadioGroup
            value={selectedAnswer || ''}
            onValueChange={onAnswerSelect}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="font-armenian cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            variant="outline"
            className="font-armenian"
          >
            Նախորդ
          </Button>
          
          <Button
            onClick={onNext}
            disabled={!canGoNext}
            className="font-armenian"
          >
            {isLastQuestion ? 'Ավարտել' : 'Հաջորդ'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;
