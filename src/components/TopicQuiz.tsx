import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TopicQuizProps {
  topicId: string;
  onComplete: () => void;
}

interface QuizQuestion {
  id: string | number;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

const TopicQuiz = ({ topicId, onComplete }: TopicQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch quiz questions from database
  const { data: topic, isLoading, error } = useQuery({
    queryKey: ['topic-quiz', topicId],
    queryFn: async () => {
      console.log('Fetching topic quiz for:', topicId);
      const { data, error } = await supabase
        .from('topics')
        .select('title, quiz_questions')
        .eq('id', topicId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching topic quiz:', error);
        throw error;
      }
      
      console.log('Topic quiz fetched:', data);
      return data;
    },
    enabled: !!topicId
  });

  // Parse quiz questions from JSON with proper type casting
  const questions: QuizQuestion[] = React.useMemo(() => {
    if (!topic?.quiz_questions) return [];
    
    try {
      // Handle the case where quiz_questions might be a JSON string or already parsed
      let questionsData = topic.quiz_questions;
      
      if (typeof questionsData === 'string') {
        questionsData = JSON.parse(questionsData);
      }
      
      // Ensure it's an array and validate the structure
      if (Array.isArray(questionsData)) {
        return questionsData.filter((question: any) => 
          question && 
          typeof question === 'object' && 
          question.question && 
          Array.isArray(question.options) && 
          typeof question.correct === 'number'
        ) as unknown as QuizQuestion[];
      }
      
      return [];
    } catch (error) {
      console.error('Error parsing quiz questions:', error);
      return [];
    }
  }, [topic?.quiz_questions]);

  const handleAnswerSelect = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate score and show results
      let correctAnswers = 0;
      questions.forEach((question, index) => {
        if (parseInt(answers[index]) === question.correct) {
          correctAnswers++;
        }
      });
      setScore(correctAnswers);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const handleComplete = () => {
    onComplete();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse font-armenian">Բեռնվում է թեստը...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground font-armenian">
            Սխալ է տեղի ունեցել թեստը բեռնելիս
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!questions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">
            Ստուգողական թեստ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground font-armenian text-center">
            Թեստի հարցերը շուտով կլինեն հասանելի
          </p>
          <Button onClick={onComplete} className="w-full mt-4 font-armenian">
            Ավարտել դասը
          </Button>
        </CardContent>
      </Card>
    );
  }

  const progress = showResults ? 100 : ((currentQuestion + 1) / questions.length) * 100;
  const scorePercentage = (score / questions.length) * 100;

  if (showResults) {
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
              {score}/{questions.length}
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
              <Button onClick={handleRetry} variant="outline" className="font-armenian">
                <RotateCcw className="w-4 h-4 mr-2" />
                Կրկին փորձել
              </Button>
            )}
            {scorePercentage >= 60 && (
              <Button onClick={handleComplete} className="font-armenian">
                <CheckCircle className="w-4 h-4 mr-2" />
                Ավարտել դասը
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-armenian">
          Ստուգողական թեստ
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="font-armenian">Հարց {currentQuestion + 1} / {questions.length}</span>
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
            value={answers[currentQuestion] || ''}
            onValueChange={handleAnswerSelect}
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
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="font-armenian"
          >
            Նախորդ
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion]}
            className="font-armenian"
          >
            {currentQuestion === questions.length - 1 ? 'Ավարտել' : 'Հաջորդ'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicQuiz;
