
import React from 'react';
import { useTopicExercises } from '@/hooks/useTopicExercises';
import ExercisesHeader from '@/components/exercises/ExercisesHeader';
import ExerciseCard from '@/components/exercises/ExerciseCard';
import ExercisesCompletion from '@/components/exercises/ExercisesCompletion';
import ExercisesLoading from '@/components/exercises/ExercisesLoading';
import ExercisesError from '@/components/exercises/ExercisesError';
import ExercisesEmpty from '@/components/exercises/ExercisesEmpty';

interface TopicExercisesProps {
  topicId: string;
  onComplete: () => void;
}

const TopicExercises = ({ topicId, onComplete }: TopicExercisesProps) => {
  const {
    exercises,
    answers,
    completedExercises,
    isLoading,
    error,
    handleAnswerChange,
    handleSubmitExercise
  } = useTopicExercises(topicId);

  if (isLoading) {
    return <ExercisesLoading />;
  }

  if (error) {
    return <ExercisesError />;
  }

  if (!exercises.length) {
    return <ExercisesEmpty />;
  }

  return (
    <div className="space-y-6">
      <ExercisesHeader 
        completedCount={completedExercises.length} 
        totalCount={exercises.length} 
      />

      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          answer={answers[exercise.id]}
          isCompleted={completedExercises.includes(exercise.id)}
          onAnswerChange={(value) => handleAnswerChange(exercise.id, value)}
          onSubmit={() => handleSubmitExercise(exercise.id, onComplete)}
        />
      ))}

      {exercises.length > 0 && completedExercises.length === exercises.length && (
        <ExercisesCompletion />
      )}
    </div>
  );
};

export default TopicExercises;
