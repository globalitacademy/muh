
import React, { lazy, Suspense } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

// CRITICAL: Load immediately for above-the-fold content
import EnhancedFeatures from '@/components/EnhancedFeatures';

// LAZY LOAD: Defer non-critical sections to reduce initial bundle
const SplashCursor = lazy(() => import('@/components/SplashCursor'));
const Courses = lazy(() => import('@/components/Courses'));
const JobPostingsSection = lazy(() => import('@/components/JobPostingsSection'));
const PublicProjectsSection = lazy(() => import('@/components/PublicProjectsSection'));
const PartnerCoursesSection = lazy(() => import('@/components/PartnerCoursesSection'));

// Optimized loading placeholder for Speed Index improvement
const SectionLoader = () => (
  <div className="w-full h-64 flex items-center justify-center">
    <div className="skeleton-pulse rounded-lg w-full h-full"></div>
  </div>
);

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
        <Suspense fallback={<SectionLoader />}>
          <Courses />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <PublicProjectsSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <JobPostingsSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <PartnerCoursesSection />
        </Suspense>
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
