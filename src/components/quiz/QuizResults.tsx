
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { QuizQuestion } from './types';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  questions: QuizQuestion[];
  answers: Record<number, string>;
  onRetry: () => void;
  onComplete: () => void;
}

const QuizResults = ({
  score,
  totalQuestions,
  questions,
  answers,
  onRetry,
  onComplete
}: QuizResultsProps) => {
  const scorePercentage = (score / totalQuestions) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center font-armenian">
          <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
          Թեստի արդյունքները
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            {score}/{totalQuestions}
          </div>
          <div className="text-xl font-armenian mb-4">
            {scorePercentage >= 80 ? 'Գերազանց!' : scorePercentage >= 60 ? 'Լավ!' : 'Փորձեք նորից'}
          </div>
          <Progress value={scorePercentage} className="h-3 mb-4" />
          <p className="text-muted-foreground font-armenian">
            {scorePercentage >= 80 
              ? 'Դուք հարատևո՜ւնք ցուցաբերեցիք: Կարող եք անցնել հաջորդ դասին:'
              : scorePercentage >= 60 
              ? 'Լավ արդյունք: Խորհուրդ ենք տալիս վերանայել տեսական նյութը:'
              : 'Խորհուրդ ենք տալիս վերանայել տեսական նյութը և կրկին փորձել:'
            }
          </p>
        </div>

        {/* Detailed Results */}
        <div className="space-y-4">
          <h3 className="font-semibold font-armenian">Մանրամասն արդյունքներ՝</h3>
          {questions.map((question, index) => (
            <div key={question.id} className="border rounded-lg p-4">
              <div className="flex items-start gap-2 mb-2">
                {parseInt(answers[index]) === question.correct ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-medium font-armenian">{question.question}</p>
                  {question.explanation && (
                    <p className="text-sm text-muted-foreground font-armenian mt-1">
                      {question.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          {scorePercentage < 80 && (
            <Button onClick={onRetry} variant="outline" className="font-armenian">
              <RotateCcw className="w-4 h-4 mr-2" />
              Կրկին փորձել
            </Button>
          )}
          {scorePercentage >= 60 && (
            <Button onClick={onComplete} className="font-armenian">
              <CheckCircle className="w-4 h-4 mr-2" />
              Ավարտել դասը
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizResults;
