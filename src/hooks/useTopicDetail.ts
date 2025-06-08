import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEnrollments } from '@/hooks/useEnrollments';

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

  const handleTabChange = (value: string) => {
    if (!hasAccess) return;
    
    setActiveTab(value);
    // Update progress based on completed sections
    if (value === 'video' && progress < 25) {
      setProgress(25);
    } else if (value === 'exercises' && progress < 50) {
      setProgress(50);
    } else if (value === 'quiz' && progress < 75) {
      setProgress(75);
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
    handleTabChange,
    handleCompleteLesson
  };
};
