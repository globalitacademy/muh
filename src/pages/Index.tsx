
import React, { lazy, Suspense } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

// CRITICAL: Load immediately for above-the-fold content
import EnhancedFeatures from '@/components/EnhancedFeatures';

// AGGRESSIVE TBT OPTIMIZATION: Use MessageChannel for immediate yielding
const createDeferredLoader = (importFn: () => Promise<any>, delay: number = 0) => {
  return lazy(() => 
    new Promise<{ default: React.ComponentType<any> }>(resolve => {
      const loadComponent = () => {
        // Use MessageChannel for non-blocking task scheduling
        if ('MessageChannel' in window) {
          const channel = new MessageChannel();
          channel.port2.onmessage = () => {
            importFn().then(module => resolve(module));
          };
          channel.port1.postMessage(null);
        } else if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            importFn().then(module => resolve(module));
          }, { timeout: 2000 });
        } else {
          setTimeout(() => {
            importFn().then(module => resolve(module));
          }, delay);
        }
      };

      // Further delay heavy components to prevent main thread blocking
      setTimeout(loadComponent, delay);
    })
  );
};

const SplashCursor = createDeferredLoader(
  () => import('@/components/SplashCursor'), 
  4000 // Delay until page is definitely interactive
);

// Use deferred loading for all heavy sections to prevent blocking
const Courses = createDeferredLoader(() => import('@/components/Courses'), 100);
const JobPostingsSection = createDeferredLoader(() => import('@/components/JobPostingsSection'), 200);
const PublicProjectsSection = createDeferredLoader(() => import('@/components/PublicProjectsSection'), 300);
const PartnerCoursesSection = createDeferredLoader(() => import('@/components/PartnerCoursesSection'), 400);

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
