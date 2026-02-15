
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicNavigation from '@/components/TopicNavigation';
import TopicHeader from '@/components/topic/TopicHeader';
import TopicTabs from '@/components/topic/TopicTabs';
import TopicError from '@/components/topic/TopicError';
import TopicAccessDenied from '@/components/topic/TopicAccessDenied';
import TopicLoading from '@/components/topic/TopicLoading';
import { useTopicDetail } from '@/hooks/useTopicDetail';
import { useTopicNavigation } from '@/hooks/useTopicNavigation';

const TopicDetail = () => {
  const navigate = useNavigate();
  const {
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
  } = useTopicDetail();

  // Get navigation data
  const { data: navigationData } = useTopicNavigation(
    topicId || '', 
    topic?.module_id || ''
  );

  const handleBackToModule = () => {
    if (topic?.modules) {
      navigate(`/module/${topic.module_id}`);
    } else {
      navigate(-1);
    }
  };

  const handleCompleteLessonAndNavigate = () => {
    handleCompleteLesson();
    // Navigate back to module
    if (topic?.modules) {
      navigate(`/module/${topic.module_id}`);
    } else {
      navigate(-1);
    }
  };

  if (isLoading) {
    return <TopicLoading />;
  }

  if (error) {
    console.error('TopicDetail - Error state:', error);
    return <TopicError error={error} />;
  }

  if (!topic) {
    console.log('TopicDetail - No topic found for ID:', topicId);
    return <TopicError notFound />;
  }

  // Access denied for paid topics
  if (!hasAccess) {
    return <TopicAccessDenied moduleId={topic.module_id} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/')} className="font-armenian cursor-pointer">
                Գլխավոր
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={handleBackToModule} className="font-armenian cursor-pointer">
                {topic.modules?.title || 'Մոդուլ'}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-armenian">{topic.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Topic Header */}
        <TopicHeader topic={topic} progress={progress} />

        {/* Main Content */}
        <TopicTabs
          topicId={topicId!}
          topic={topic}
          activeTab={activeTab}
          availableTabs={availableTabs}
          getNextTab={getNextTab}
          onTabChange={handleTabChange}
          onCompleteLesson={handleCompleteLessonAndNavigate}
        />

        {/* Topic Navigation */}
        {navigationData && (
          <TopicNavigation
            currentTopic={navigationData.currentTopic}
            previousTopic={navigationData.previousTopic}
            nextTopic={navigationData.nextTopic}
            moduleId={topic.module_id}
            hasAccess={hasAccess}
          />
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default TopicDetail;
