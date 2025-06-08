
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Exercise } from '@/components/exercises/types';

export const useTopicExercises = (topicId: string) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  // Fetch exercises from database
  const { data: topic, isLoading, error } = useQuery({
    queryKey: ['topic-exercises', topicId],
    queryFn: async () => {
      console.log('Fetching topic exercises for:', topicId);
      const { data, error } = await supabase
        .from('topics')
        .select('title, exercises')
        .eq('id', topicId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching topic exercises:', error);
        throw error;
      }
      
      console.log('Topic exercises fetched:', data);
      return data;
    },
    enabled: !!topicId
  });

  // Parse exercises from JSON with proper type casting
  const exercises: Exercise[] = useMemo(() => {
    if (!topic?.exercises) return [];
    
    try {
      // Handle the case where exercises might be a JSON string or already parsed
      let exercisesData = topic.exercises;
      
      if (typeof exercisesData === 'string') {
        exercisesData = JSON.parse(exercisesData);
      }
      
      // Ensure it's an array and validate the structure
      if (Array.isArray(exercisesData)) {
        return exercisesData.filter((exercise: any) => 
          exercise && 
          typeof exercise === 'object' && 
          exercise.id && 
          exercise.title && 
          exercise.description
        ) as unknown as Exercise[];
      }
      
      return [];
    } catch (error) {
      console.error('Error parsing exercises:', error);
      return [];
    }
  }, [topic?.exercises]);

  const handleAnswerChange = (exerciseId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [exerciseId]: value
    }));
  };

  const handleSubmitExercise = (exerciseId: string, onComplete: () => void) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises(prev => [...prev, exerciseId]);
      
      // If all exercises completed, enable next step
      if (completedExercises.length + 1 === exercises.length) {
        setTimeout(onComplete, 1000);
      }
    }
  };

  return {
    exercises,
    answers,
    completedExercises,
    isLoading,
    error,
    handleAnswerChange,
    handleSubmitExercise
  };
};
