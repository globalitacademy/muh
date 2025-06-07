
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';

interface TopicQuizProps {
  topicId: string;
  onComplete: () => void;
}

const TopicQuiz = ({ topicId, onComplete }: TopicQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: 1,
      question: 'Ինչպիսի՞ն է ալգորիթմի հիմնական բնութագիրը:',
      options: [
        'Պետք է լինի անվերջ',
        'Պետք է լինի վերջավոր և որոշակի',
        'Պետք է գրված լինի ծրագրավորման լեզվով',
        'Պետք է լինի միշտ բարդ'
      ],
      correct: 1,
      explanation: 'Ալգորիթմը պետք է լինի վերջավոր (ունենա ավարտ) և որոշակի (յուրաքանչյուր քայլ հստակ)'
    },
    {
      id: 2,
      question: 'Ո՞ր ներկայացման եղանակը չի հանդիսանում ալգորիթմի ներկայացման ձև:',
      options: [
        'Բնական լեզվով նկարագրություն',
        'Հոսքի սխեմա (Flowchart)',
        'Pseudocode',
        'Երաժշտական նոտագրություն'
      ],
      correct: 3,
      explanation: 'Երաժշտական նոտագրությունը չի օգտագործվում ալգորիթմների ներկայացման համար'
    },
    {
      id: 3,
      question: 'Ալգորիթմի ո՞ր հատկությունն է ապահովում, որ ալգորիթմը կտա ճիշտ արդյունք:',
      options: [
        'Վերջնություն',
        'Մուտք',
        'Որոշակիություն',
        'Ելք'
      ],
      correct: 2,
      explanation: 'Որոշակիությունը ապահովում է, որ յուրաքանչյուր քայլ հստակ է և միանշանակ, ինչը հանգեցնում է ճիշտ արդյունքի'
    },
    {
      id: 4,
      question: 'Pseudocode-ի ո՞ր առավելությունն է ամենակարևորը:',
      options: [
        'Միշտ աշխատում է համակարգչում',
        'Համատեղում է պարզությունն ու ճշգրտությունը',
        'Ամենաարագ գրելու եղանակն է',
        'Միակ ճիշտ ներկայացման եղանակն է'
      ],
      correct: 1,
      explanation: 'Pseudocode-ը համատեղում է բնական լեզվի պարզությունը և ծրագրավորման լեզվի ճշգրտությունը'
    },
    {
      id: 5,
      question: 'Ալգորիթմի մուտքային տվյալները կարող են լինել:',
      options: [
        'Միայն թվեր',
        'Միայն տեքստ',
        'Մեկ կամ մի քանի տարբեր տեսակի տվյալներ',
        'Միշտ պետք է լինեն նույն տեսակի'
      ],
      correct: 2,
      explanation: 'Ալգորիթմը կարող է ունենալ մեկ կամ մի քանի մուտքային տվյալներ, որոնք կարող են լինել տարբեր տեսակի'
    }
  ];

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
                    <p className="text-sm text-muted-foreground font-armenian mt-1">
                      {question.explanation}
                    </p>
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
