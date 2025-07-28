
import React from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import { useUpdateProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/hooks/useAuth';
import QuizQuestion from '@/components/quiz/QuizQuestion';
import QuizResults from '@/components/quiz/QuizResults';
import QuizEmpty from '@/components/quiz/QuizEmpty';
import QuizLoading from '@/components/quiz/QuizLoading';
import QuizError from '@/components/quiz/QuizError';

interface TopicQuizProps {
  topicId: string;
  moduleId?: string;
  onComplete: () => void;
}

const TopicQuiz = ({ topicId, moduleId, onComplete }: TopicQuizProps) => {
  const { user } = useAuth();
  const updateProgress = useUpdateProgress();
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
    // Save progress when quiz is completed
    if (user && moduleId) {
      const passedQuiz = quizState.score >= (questions.length * 0.7); // 70% passing grade
      updateProgress.mutate({
        topicId: topicId,
        moduleId: moduleId,
        progressPercentage: 100,
        completed: passedQuiz
      });
    }
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
