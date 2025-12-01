import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useUserProgress, useUpdateProgress } from '@/hooks/useUserProgress';
import { useAccessSession } from '@/hooks/useAccessSession';

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

// Helper functions to check content availability
const hasVideoContent = (topic: any): boolean => {
  return !!(topic?.video_url && topic.video_url.trim() !== '');
};

const hasExercises = (topic: any): boolean => {
  if (!topic?.exercises) return false;
  try {
    const exercises = recursiveJSONParse(topic.exercises);
    
    // Check if it's an object with exercises property
    if (exercises && typeof exercises === 'object' && 'exercises' in exercises) {
      return Array.isArray(exercises.exercises) && exercises.exercises.length > 0;
    }
    
    // Check if it's directly an array
    return Array.isArray(exercises) && exercises.length > 0;
  } catch {
    return false;
  }
};

const hasQuiz = (topic: any): boolean => {
  if (!topic?.quiz_questions) return false;
  try {
    const questions = recursiveJSONParse(topic.quiz_questions);
    
    // Check if it's an object with questions property
    if (questions && typeof questions === 'object' && 'questions' in questions) {
      return Array.isArray(questions.questions) && questions.questions.length > 0;
    }
    
    // Check if it's directly an array
    return Array.isArray(questions) && questions.length > 0;
  } catch {
    return false;
  }
};

export const useTopicDetail = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const { user } = useAuth();
  const { data: enrollments } = useEnrollments();
  const { data: userProgress } = useUserProgress();
  const updateProgress = useUpdateProgress();
  const { hasModuleAccess } = useAccessSession();
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
          id,
          module_id,
          title,
          title_en,
          title_ru,
          description,
          description_en,
          description_ru,
          content,
          video_url,
          duration_minutes,
          order_index,
          is_free,
          exercises,
          quiz_questions,
          resources,
          created_at,
          updated_at,
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

  // Load existing progress from database
  useEffect(() => {
    if (userProgress && topicId && user) {
      const existingProgress = userProgress.find(p => p.topic_id === topicId);
      if (existingProgress) {
        setProgress(existingProgress.progress_percentage);
      }
    }
  }, [userProgress, topicId, user]);

  // Check if user has access to this topic
  const hasAccess = useMemo(() => {
    if (!topic) return false;
    
    // Free topics are accessible to everyone
    if (topic.is_free) {
      console.log('TopicDetail - Topic is free, granting access');
      return true;
    }
    
    // Check for active access code session for this module
    if (topic.module_id && hasModuleAccess(topic.module_id)) {
      console.log('TopicDetail - Access granted via active access code session');
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
  }, [topic, user, enrollments, hasModuleAccess]);

  // Calculate available tabs based on content and access
  const availableTabs = useMemo(() => {
    if (!topic) return ['content'];
    
    const tabs = ['content']; // Always include content tab
    
    // If user has access via active access code session, show all tabs
    const hasActiveSession = topic.module_id && hasModuleAccess(topic.module_id);
    
    if (hasActiveSession) {
      // Show all tabs when access code is active
      tabs.push('video', 'exercises', 'quiz');
    } else {
      // Otherwise, only show tabs for which content exists
      if (hasVideoContent(topic)) {
        tabs.push('video');
      }
      
      if (hasExercises(topic)) {
        tabs.push('exercises');
      }
      
      if (hasQuiz(topic)) {
        tabs.push('quiz');
      }
    }
    
    return tabs;
  }, [topic, hasModuleAccess]);

  // Function to get next available tab
  const getNextTab = (currentTab: string): string | null => {
    const currentIndex = availableTabs.indexOf(currentTab);
    if (currentIndex === -1 || currentIndex === availableTabs.length - 1) {
      return null; // No next tab
    }
    return availableTabs[currentIndex + 1];
  };

  const handleTabChange = (value: string) => {
    if (!hasAccess || !user || !topicId || !topic) return;
    
    setActiveTab(value);
    // Update progress based on completed sections and available tabs
    const tabIndex = availableTabs.indexOf(value);
    const progressIncrement = 100 / availableTabs.length;
    const newProgress = (tabIndex + 1) * progressIncrement;
    
    if (newProgress > progress) {
      const finalProgress = Math.min(newProgress, 100);
      setProgress(finalProgress);
      
      // Save progress to database
      updateProgress.mutate({
        topicId: topicId,
        moduleId: topic.module_id,
        progressPercentage: finalProgress,
        completed: finalProgress === 100
      });
    }
  };

  const handleCompleteLesson = () => {
    if (!hasAccess || !user || !topicId || !topic) return;
    
    setProgress(100);
    
    // Save completed lesson to database
    updateProgress.mutate({
      topicId: topicId,
      moduleId: topic.module_id,
      progressPercentage: 100,
      completed: true
    });
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
