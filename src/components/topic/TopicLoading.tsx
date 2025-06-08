
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TopicLoading = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse font-armenian">Բեռնվում է...</div>
      </div>
      <Footer />
    </div>
  );
};

export default TopicLoading;
