
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Stats from '@/components/Stats';
import Courses from '@/components/Courses';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <>
      <Header />
      <main className="w-full">
        <Hero />
        <Features />
        <Stats />
        <Courses />
      </main>
      <Footer />
    </>
  );
};

export default Index;
