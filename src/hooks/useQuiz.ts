
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { QuizQuestion, QuizState } from '@/components/quiz/types';

export const useQuiz = (topicId: string) => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: {},
    showResults: false,
    score: 0
  });

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
  const questions: QuizQuestion[] = useMemo(() => {
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
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [prev.currentQuestion]: value
      }
    }));
  };

  const handleNext = () => {
    if (quizState.currentQuestion < questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
    } else {
      // Calculate score and show results
      let correctAnswers = 0;
      questions.forEach((question, index) => {
        if (parseInt(quizState.answers[index]) === question.correct) {
          correctAnswers++;
        }
      });
      setQuizState(prev => ({
        ...prev,
        score: correctAnswers,
        showResults: true
      }));
    }
  };

  const handlePrevious = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1
      }));
    }
  };

  const handleRetry = () => {
    setQuizState({
      currentQuestion: 0,
      answers: {},
      showResults: false,
      score: 0
    });
  };

  return {
    topic,
    questions,
    quizState,
    isLoading,
    error,
    handleAnswerSelect,
    handleNext,
    handlePrevious,
    handleRetry
  };
};
