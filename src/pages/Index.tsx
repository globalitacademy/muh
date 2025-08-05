
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import EnhancedFeatures from '@/components/EnhancedFeatures';
import SplashCursor from '@/components/SplashCursor';
import Courses from '@/components/Courses';
import JobPostingsSection from '@/components/JobPostingsSection';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="page-container">
      <SplashCursor />
      <Header />
      <main className="w-full">
        <Hero />
        <EnhancedFeatures />
        <JobPostingsSection />
        <Courses />
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
