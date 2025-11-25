
import React from 'react';
import { useTopicExercises } from '@/hooks/useTopicExercises';
import ExercisesHeader from '@/components/exercises/ExercisesHeader';
import ExerciseCard from '@/components/exercises/ExerciseCard';
import ExercisesLoading from '@/components/exercises/ExercisesLoading';
import ExercisesError from '@/components/exercises/ExercisesError';
import ExercisesEmpty from '@/components/exercises/ExercisesEmpty';

interface TopicExercisesProps {
  topicId: string;
  moduleId?: string;
  onComplete: () => void;
}

const TopicExercises = ({ topicId, moduleId, onComplete }: TopicExercisesProps) => {
  const {
    exercises,
    isLoading,
    error
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
        totalCount={exercises.length} 
      />

      {exercises.map((exercise, index) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          index={index + 1}
        />
      ))}
    </div>
  );
};

export default TopicExercises;
