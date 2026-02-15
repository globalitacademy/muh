
import React, { lazy, Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import Hero from '@/components/Hero';
import EnhancedFeatures from '@/components/EnhancedFeatures';
import Courses from '@/components/Courses';
import JobPostingsSection from '@/components/JobPostingsSection';
import PublicProjectsSection from '@/components/PublicProjectsSection';
import PartnerCoursesSection from '@/components/PartnerCoursesSection';
import Newsletter from '@/components/Newsletter';

// Lazy load heavy animation component to improve FID
const SplashCursor = lazy(() => import('@/components/SplashCursor'));

const Index = () => {
  return (
    <AppLayout>
      <Suspense fallback={null}>
        <SplashCursor />
      </Suspense>
      <Hero />
      <EnhancedFeatures />
      <Courses />
      <PublicProjectsSection />
      <JobPostingsSection />
      <PartnerCoursesSection />
      <Newsletter />
    </AppLayout>
  );
};

export default Index;
