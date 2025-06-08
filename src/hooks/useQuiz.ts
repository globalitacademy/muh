
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

  // Parse quiz questions from JSON with improved parsing
  const questions: QuizQuestion[] = useMemo(() => {
    if (!topic?.quiz_questions) {
      console.log('No quiz questions data found');
      return [];
    }
    
    try {
      console.log('Raw quiz questions data:', topic.quiz_questions);
      
      // Use recursive parsing to handle double-encoded JSON
      let questionsData = recursiveJSONParse(topic.quiz_questions);
      
      console.log('Parsed quiz questions data:', questionsData);
      
      // Ensure it's an array
      if (!Array.isArray(questionsData)) {
        console.log('Quiz questions data is not an array:', typeof questionsData);
        return [];
      }
      
      // Validate and filter questions
      const validQuestions = questionsData.filter((question: any) => {
        const isValid = question && 
          typeof question === 'object' && 
          question.question && 
          Array.isArray(question.options) && 
          question.options.length > 0 &&
          (typeof question.correct === 'number' || typeof question.correct_answer === 'number');
        
        if (!isValid) {
          console.log('Invalid question found:', question);
        }
        
        return isValid;
      }).map((question: any, index: number) => ({
        // Ensure required fields with fallbacks
        id: question.id || `question-${index}`,
        question: question.question,
        options: question.options,
        correct: typeof question.correct === 'number' ? question.correct : question.correct_answer,
        explanation: question.explanation
      })) as QuizQuestion[];
      
      console.log('Valid questions found:', validQuestions.length, validQuestions);
      return validQuestions;
      
    } catch (error) {
      console.error('Error parsing quiz questions:', error, 'Raw data:', topic.quiz_questions);
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
