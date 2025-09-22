
import React, { lazy, Suspense } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import EnhancedFeatures from '@/components/EnhancedFeatures';
import Courses from '@/components/Courses';
import JobPostingsSection from '@/components/JobPostingsSection';
import PublicProjectsSection from '@/components/PublicProjectsSection';
import PartnerCoursesSection from '@/components/PartnerCoursesSection';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

// Lazy load heavy animation component to improve FID
const SplashCursor = lazy(() => import('@/components/SplashCursor'));

const Index = () => {
  return (
    <div className="page-container">
      <Suspense fallback={null}>
        <SplashCursor />
      </Suspense>
      <Header />
      <main className="w-full">
        <Hero />
        <EnhancedFeatures />
        <Courses />
        <PublicProjectsSection />
        <JobPostingsSection />
        <PartnerCoursesSection />
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
