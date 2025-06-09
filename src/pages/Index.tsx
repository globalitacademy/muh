
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import EnhancedFeatures from '@/components/EnhancedFeatures';
import Stats from '@/components/Stats';
import Courses from '@/components/Courses';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="page-container">
      <Header />
      <main className="w-full">
        <Hero />
        <EnhancedFeatures />
        <Stats />
        <Courses />
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
