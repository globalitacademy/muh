
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

  // Helper function to recursively parse JSON strings
  const recursiveJSONParse = (data: any): any => {
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return recursiveJSONParse(parsed); // Recursively parse in case of double encoding
      } catch {
        return data; // Return as is if parsing fails
      }
    }
    return data;
  };

  // Parse exercises from JSON with improved parsing
  const exercises: Exercise[] = useMemo(() => {
    if (!topic?.exercises) {
      console.log('No exercises data found');
      return [];
    }
    
    try {
      console.log('Raw exercises data:', topic.exercises);
      
      // Use recursive parsing to handle double-encoded JSON
      let exercisesData = recursiveJSONParse(topic.exercises);
      
      console.log('Parsed exercises data:', exercisesData);
      
      // Ensure it's an array
      if (!Array.isArray(exercisesData)) {
        console.log('Exercises data is not an array:', typeof exercisesData);
        return [];
      }
      
      // Validate and filter exercises
      const validExercises = exercisesData.filter((exercise: any) => {
        const isValid = exercise && 
          typeof exercise === 'object' && 
          (exercise.id || exercise.title) && // At least one identifier
          (exercise.title || exercise.question) && // At least some content
          (exercise.description || exercise.question);
        
        if (!isValid) {
          console.log('Invalid exercise found:', exercise);
        }
        
        return isValid;
      }).map((exercise: any) => ({
        // Ensure required fields with fallbacks
        id: exercise.id || `exercise-${Date.now()}-${Math.random()}`,
        title: exercise.title || exercise.question || 'Վարժություն',
        description: exercise.description || exercise.question || '',
        difficulty: exercise.difficulty || 'միջին',
        hint: exercise.hint,
        expectedAnswer: exercise.expectedAnswer || exercise.answer,
        question: exercise.question,
        type: exercise.type,
        options: exercise.options,
        answer: exercise.answer
      })) as Exercise[];
      
      console.log('Valid exercises found:', validExercises.length, validExercises);
      return validExercises;
      
    } catch (error) {
      console.error('Error parsing exercises:', error, 'Raw data:', topic.exercises);
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
