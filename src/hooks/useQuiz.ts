
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

  // Helper function to find correct option index from string answer
  const findCorrectOptionIndex = (options: string[], correctAnswer: string): number => {
    if (!correctAnswer) return 0;
    
    // Try to find exact match
    const exactMatch = options.findIndex(option => 
      option.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
    );
    
    if (exactMatch !== -1) return exactMatch;
    
    // Try to find partial match
    const partialMatch = options.findIndex(option => 
      option.toLowerCase().includes(correctAnswer.toLowerCase()) ||
      correctAnswer.toLowerCase().includes(option.toLowerCase())
    );
    
    return partialMatch !== -1 ? partialMatch : 0;
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
      
      // Check if it's an object with questions property
      if (questionsData && typeof questionsData === 'object' && 'questions' in questionsData) {
        questionsData = questionsData.questions;
        console.log('Extracted questions array from object:', questionsData);
      }
      
      // Ensure it's an array
      if (!Array.isArray(questionsData)) {
        console.log('Quiz questions data is not an array:', typeof questionsData);
        return [];
      }
      
      // Validate and filter questions
      const validQuestions = questionsData.filter((question: any) => {
        const hasQuestion = question && typeof question === 'object' && question.question;
        const hasOptions = Array.isArray(question.options) && question.options.length > 0;
        const hasCorrectAnswer = question.correct_answer || typeof question.correct === 'number';
        
        const isValid = hasQuestion && hasOptions && hasCorrectAnswer;
        
        if (!isValid) {
          console.log('Invalid question found:', {
            question: question?.question,
            options: question?.options,
            correct_answer: question?.correct_answer,
            correct: question?.correct,
            fullQuestion: question
          });
        }
        
        return isValid;
      }).map((question: any, index: number) => {
        // Determine correct answer index
        let correctIndex = 0;
        
        if (typeof question.correct === 'number') {
          correctIndex = question.correct;
        } else if (question.correct_answer && Array.isArray(question.options)) {
          correctIndex = findCorrectOptionIndex(question.options, question.correct_answer);
        }
        
        console.log('Processing question:', {
          question: question.question,
          options: question.options,
          original_correct: question.correct,
          original_correct_answer: question.correct_answer,
          calculated_correct_index: correctIndex
        });
        
        return {
          id: question.id || `question-${index}`,
          question: question.question,
          options: question.options,
          correct: correctIndex,
          correct_answer: question.correct_answer,
          explanation: question.explanation
        };
      }) as QuizQuestion[];
      
      console.log('Valid questions found:', validQuestions.length);
      console.log('Processed questions:', validQuestions);
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
        const userAnswer = parseInt(quizState.answers[index]);
        console.log('Checking answer for question', index, {
          userAnswer,
          correctAnswer: question.correct,
          isCorrect: userAnswer === question.correct
        });
        
        if (userAnswer === question.correct) {
          correctAnswers++;
        }
      });
      
      console.log('Final score calculation:', {
        correctAnswers,
        totalQuestions: questions.length,
        answers: quizState.answers
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
