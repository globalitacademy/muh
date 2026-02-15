
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useModule } from '@/hooks/useModules';
import { useTopics } from '@/hooks/useTopics';
import { useEnrollments, useEnrollModule } from '@/hooks/useEnrollments';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ModuleDetailHeader from '@/components/module/ModuleDetailHeader';
import ModuleDetailTabs from '@/components/module/ModuleDetailTabs';
import ModuleDetailSidebar from '@/components/module/ModuleDetailSidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAccessSession } from '@/hooks/useAccessSession';

const ModuleDetail = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: module, isLoading: moduleLoading } = useModule(id!);
  const { data: topics, isLoading: topicsLoading } = useTopics(id!);
  const { data: enrollments } = useEnrollments();
  const enrollModule = useEnrollModule();
  const [hasValidCompanyCode, setHasValidCompanyCode] = useState(false);
  const { hasModuleAccess, isActive } = useAccessSession();

  const isEnrolled = enrollments?.some(e => e.module_id === id);
  // Check both enrollment and IP-based access session
  const hasIpAccess = isActive && hasModuleAccess(id);
  const hasFullAccess = isEnrolled || hasValidCompanyCode || hasIpAccess;
  
  console.log('ModuleDetail Access Debug:', {
    userId: user?.id,
    moduleId: id,
    enrollments: enrollments?.map(e => ({ id: e.id, module_id: e.module_id })),
    isEnrolled,
    hasValidCompanyCode,
    hasFullAccess
  });

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    await enrollModule.mutateAsync(id!);
  };

  const handleTopicClick = (topicId: string) => {
    console.log('Navigating to topic:', topicId);
    navigate(`/topic/${topicId}`);
  };

  const handleCompanyCodeVerified = (isValid: boolean) => {
    setHasValidCompanyCode(isValid);
  };

  const handleStartLearning = () => {
    // Find the first topic by order_index
    const sortedTopics = topics?.sort((a, b) => a.order_index - b.order_index);
    const firstTopic = sortedTopics?.[0];
    
    if (firstTopic) {
      console.log('Starting learning - navigating to first topic:', firstTopic.id);
      handleTopicClick(firstTopic.id);
    } else {
      console.log('No topics available for this module');
    }
  };

  if (moduleLoading || topicsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-armenian text-foreground">{t('module.not-found')}</h2>
            <Button onClick={() => navigate('/')} className="mt-4 font-armenian">
              {t('module.back-home')}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-muted-foreground hover:text-foreground hover:bg-hover-bg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('module.back-home')}
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ModuleDetailHeader 
              module={module} 
              topicsCount={topics?.length || 0} 
            />

            <ModuleDetailTabs
              module={module}
              topics={topics}
              hasFullAccess={hasFullAccess}
              onTopicClick={handleTopicClick}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ModuleDetailSidebar
              module={module}
              user={user}
              hasFullAccess={hasFullAccess}
              enrollModule={enrollModule}
              onEnroll={handleEnroll}
              onStartLearning={handleStartLearning}
              onNavigateToAuth={() => navigate('/auth')}
              onCompanyCodeVerified={handleCompanyCodeVerified}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ModuleDetail;
