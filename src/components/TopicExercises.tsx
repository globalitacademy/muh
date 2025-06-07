
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PenTool, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

interface TopicExercisesProps {
  topicId: string;
  onComplete: () => void;
}

const TopicExercises = ({ topicId, onComplete }: TopicExercisesProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const exercises = [
    {
      id: 'ex1',
      title: 'Վարժություն 1: Ալգորիթմի նկարագրություն',
      description: 'Նկարագրեք բնական լեզվով "Թեյ պատրաստելու" ալգորիթմը:',
      difficulty: 'Հեշտ',
      hint: 'Մտածեք քայլ առ քայլ՝ ինչ գործողություններ եք կատարում թեյ պատրաստելիս:',
      expectedAnswer: 'Պետք է ներառել՝ ջուր տաքացնել, թեյի տերև ավելացնել, թաղել, ծառայել:'
    },
    {
      id: 'ex2', 
      title: 'Վարժություն 2: Pseudocode գրում',
      description: 'Գրեք pseudocode երեք թվերից մեծագույնը գտնելու համար:',
      difficulty: 'Միջին',
      hint: 'Օգտագործեք IF-THEN-ELSE կառուցվածքները համեմատություններ կատարելու համար:',
      expectedAnswer: 'READ a, b, c; IF a>b AND a>c THEN max=a; ELSE IF b>c THEN max=b; ELSE max=c'
    },
    {
      id: 'ex3',
      title: 'Վարժություն 3: Ալգորիթմի վերլուծություն',
      description: 'Վերլուծեք հետևյալ ալգորիթմը և բացատրեք, թե ինչ է անում:\n\n1. READ number\n2. sum = 0\n3. WHILE number > 0\n4.   digit = number MOD 10\n5.   sum = sum + digit\n6.   number = number DIV 10\n7. PRINT sum',
      difficulty: 'Բարդ',
      hint: 'Ուշադրություն դարձրեք MOD և DIV գործողություններին:',
      expectedAnswer: 'Այս ալգորիթմը հաշվում է թվի թվանշանների գումարը:'
    }
  ];

  const handleAnswerChange = (exerciseId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [exerciseId]: value
    }));
  };

  const handleSubmitExercise = (exerciseId: string) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises(prev => [...prev, exerciseId]);
      
      // If all exercises completed, enable next step
      if (completedExercises.length + 1 === exercises.length) {
        setTimeout(onComplete, 1000);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Հեշտ': return 'bg-green-100 text-green-800';
      case 'Միջին': return 'bg-yellow-100 text-yellow-800';
      case 'Բարդ': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-armenian">
            <PenTool className="w-5 h-5 text-edu-blue" />
            Գործնական վարժություններ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground font-armenian mb-4">
            Լուծեք հետևյալ վարժությունները՝ ամրապնդելու համար ստացած գիտելիքները:
          </p>
          <div className="text-sm text-muted-foreground font-armenian">
            Ավարտված՝ {completedExercises.length}/{exercises.length}
          </div>
        </CardContent>
      </Card>

      {exercises.map((exercise) => (
        <Card key={exercise.id} className={completedExercises.includes(exercise.id) ? 'border-green-200 bg-green-50/50' : ''}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="font-armenian">{exercise.title}</CardTitle>
              <Badge className={getDifficultyColor(exercise.difficulty)}>
                {exercise.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-armenian whitespace-pre-line">{exercise.description}</p>
            
            {/* Hint */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 font-armenian">Հուշում</p>
                  <p className="text-sm text-blue-700 font-armenian">{exercise.hint}</p>
                </div>
              </div>
            </div>

            {/* Answer Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium font-armenian">Ձեր պատասխանը՝</label>
              <Textarea
                placeholder="Գրեք ձեր պատասխանը այստեղ..."
                value={answers[exercise.id] || ''}
                onChange={(e) => handleAnswerChange(exercise.id, e.target.value)}
                disabled={completedExercises.includes(exercise.id)}
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleSubmitExercise(exercise.id)}
                disabled={!answers[exercise.id]?.trim() || completedExercises.includes(exercise.id)}
                className="font-armenian"
              >
                {completedExercises.includes(exercise.id) ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Ստուգված
                  </>
                ) : (
                  'Ստուգել պատասխանը'
                )}
              </Button>
              
              {completedExercises.includes(exercise.id) && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-armenian">Ճիշտ է!</span>
                </div>
              )}
            </div>

            {/* Show expected answer after completion */}
            {completedExercises.includes(exercise.id) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm font-medium text-green-800 font-armenian mb-1">Ակնկալվող պատասխան՝</p>
                <p className="text-sm text-green-700 font-armenian">{exercise.expectedAnswer}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {completedExercises.length === exercises.length && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-800 font-armenian mb-2">
                Գեղեցիկ! Բոլոր վարժությունները ավարտված են
              </h3>
              <p className="text-green-700 font-armenian">
                Կարող եք անցնել ստուգողական թեստին:
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TopicExercises;
