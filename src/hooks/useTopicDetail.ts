import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEnrollments } from '@/hooks/useEnrollments';

// Helper functions to check content availability
const hasVideoContent = (topic: any): boolean => {
  return !!(topic?.video_url && topic.video_url.trim() !== '');
};

const hasExercises = (topic: any): boolean => {
  if (!topic?.exercises) return false;
  try {
    const exercises = typeof topic.exercises === 'string' 
      ? JSON.parse(topic.exercises) 
      : topic.exercises;
    return Array.isArray(exercises) && exercises.length > 0;
  } catch {
    return false;
  }
};

const hasQuiz = (topic: any): boolean => {
  if (!topic?.quiz_questions) return false;
  try {
    const questions = typeof topic.quiz_questions === 'string' 
      ? JSON.parse(topic.quiz_questions) 
      : topic.quiz_questions;
    return Array.isArray(questions) && questions.length > 0;
  } catch {
    return false;
  }
};

export const useTopicDetail = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const { user } = useAuth();
  const { data: enrollments } = useEnrollments();
  const [activeTab, setActiveTab] = useState('content'); // Start with theoretical content
  const [progress, setProgress] = useState(0);

  console.log('TopicDetail - Topic ID from params:', topicId);
  console.log('TopicDetail - Current user:', user?.id);

  // Fetch topic data from database
  const { data: topic, isLoading, error } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: async () => {
      if (!topicId) throw new Error('Topic ID is required');
      
      console.log('TopicDetail - Fetching topic data for ID:', topicId);
      
      const { data, error } = await supabase
        .from('topics')
        .select(`
          *,
          modules (
            id,
            title,
            specialty_id
          )
        `)
        .eq('id', topicId)
        .maybeSingle();
      
      if (error) {
        console.error('TopicDetail - Error fetching topic:', error);
        throw error;
      }
      
      console.log('TopicDetail - Topic data fetched:', data);
      return data;
    },
    enabled: !!topicId
  });

  // Check if user has access to this topic
  const hasAccess = useMemo(() => {
    if (!topic) return false;
    
    // Free topics are accessible to everyone
    if (topic.is_free) {
      console.log('TopicDetail - Topic is free, granting access');
      return true;
    }
    
    // For paid topics, check if user is enrolled in the module
    if (user && enrollments && topic.modules) {
      const isEnrolled = enrollments.some(e => e.module_id === topic.module_id);
      console.log('TopicDetail - User enrollment check:', { isEnrolled, moduleId: topic.module_id });
      return isEnrolled;
    }
    
    console.log('TopicDetail - No access granted');
    return false;
  }, [topic, user, enrollments]);

  // Calculate available tabs based on content
  const availableTabs = useMemo(() => {
    if (!topic) return ['content'];
    
    const tabs = ['content']; // Always include content tab
    
    if (hasVideoContent(topic)) {
      tabs.push('video');
    }
    
    if (hasExercises(topic)) {
      tabs.push('exercises');
    }
    
    if (hasQuiz(topic)) {
      tabs.push('quiz');
    }
    
    return tabs;
  }, [topic]);

  // Function to get next available tab
  const getNextTab = (currentTab: string): string | null => {
    const currentIndex = availableTabs.indexOf(currentTab);
    if (currentIndex === -1 || currentIndex === availableTabs.length - 1) {
      return null; // No next tab
    }
    return availableTabs[currentIndex + 1];
  };

  const handleTabChange = (value: string) => {
    if (!hasAccess) return;
    
    setActiveTab(value);
    // Update progress based on completed sections and available tabs
    const tabIndex = availableTabs.indexOf(value);
    const progressIncrement = 100 / availableTabs.length;
    const newProgress = (tabIndex + 1) * progressIncrement;
    
    if (newProgress > progress) {
      setProgress(Math.min(newProgress, 100));
    }
  };

  const handleCompleteLesson = () => {
    if (!hasAccess) return;
    setProgress(100);
  };

  return {
    topicId,
    topic,
    isLoading,
    error,
    hasAccess,
    activeTab,
    progress,
    availableTabs,
    getNextTab,
    handleTabChange,
    handleCompleteLesson
  };
};
