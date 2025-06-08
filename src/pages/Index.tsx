
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Stats from '@/components/Stats';
import Courses from '@/components/Courses';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background w-full page-container">
      <Header />
      <main className="w-full overflow-x-hidden">
        <Hero />
        <Features />
        <Stats />
        <Courses />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
