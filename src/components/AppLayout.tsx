
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  className?: string;
}

const AppLayout = ({ children, showFooter = true, className = '' }: AppLayoutProps) => {
  return (
    <div className={`min-h-screen bg-background w-full ${className}`}>
      <Header />
      <main className="w-full pb-20 md:pb-0">
        {children}
      </main>
      {showFooter && <Footer />}
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;
