
import React from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import QuizQuestion from '@/components/quiz/QuizQuestion';
import QuizResults from '@/components/quiz/QuizResults';
import QuizEmpty from '@/components/quiz/QuizEmpty';
import QuizLoading from '@/components/quiz/QuizLoading';
import QuizError from '@/components/quiz/QuizError';

interface TopicQuizProps {
  topicId: string;
  onComplete: () => void;
}

const TopicQuiz = ({ topicId, onComplete }: TopicQuizProps) => {
  const {
    topic,
    questions,
    quizState,
    isLoading,
    error,
    handleAnswerSelect,
    handleNext,
    handlePrevious,
    handleRetry
  } = useQuiz(topicId);

  const handleComplete = () => {
    onComplete();
  };

  if (isLoading) {
    return <QuizLoading />;
  }

  if (error) {
    return <QuizError />;
  }

  if (!questions.length) {
    return <QuizEmpty onComplete={onComplete} />;
  }

  if (quizState.showResults) {
    return (
      <QuizResults
        score={quizState.score}
        totalQuestions={questions.length}
        questions={questions}
        answers={quizState.answers}
        onRetry={handleRetry}
        onComplete={handleComplete}
      />
    );
  }

  const question = questions[quizState.currentQuestion];

  return (
    <QuizQuestion
      question={question}
      currentQuestion={quizState.currentQuestion}
      totalQuestions={questions.length}
      selectedAnswer={quizState.answers[quizState.currentQuestion]}
      onAnswerSelect={handleAnswerSelect}
      onNext={handleNext}
      onPrevious={handlePrevious}
      canGoNext={!!quizState.answers[quizState.currentQuestion]}
      canGoPrevious={quizState.currentQuestion > 0}
      isLastQuestion={quizState.currentQuestion === questions.length - 1}
    />
  );
};

export default TopicQuiz;
