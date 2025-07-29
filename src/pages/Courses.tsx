
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ModulesList from '@/components/ModulesList';
import NetworkAnimation from '@/components/NetworkAnimation';
import ScrollReveal from '@/components/ui/scroll-reveal';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Courses = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/10 w-full relative overflow-hidden">
      {/* Network Animation Background */}
      <div className="absolute inset-0 opacity-40">
        <NetworkAnimation />
      </div>
      
      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-edu-blue/3 via-transparent to-edu-purple/5 animate-blob" />
      <div className="absolute inset-0 bg-gradient-to-tl from-edu-orange/2 via-transparent to-edu-light-blue/3 animate-blob animation-delay-2000" />
      
      <Header />
      
      <main className="py-24 w-full relative z-10">
        <div className="content-container">
          <ScrollReveal direction="up" delay={0}>
            {/* Enhanced Header Section */}
            <div className="text-center mb-20 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-card/60 via-background/40 to-card/60 backdrop-blur-xl rounded-3xl border border-border/20 shadow-2xl -m-8" />
              
              <div className="relative z-10 p-8">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-edu-blue/20 to-edu-purple/20 text-edu-blue mb-6 border border-edu-blue/30 shadow-lg backdrop-blur-sm">
                  <Star className="w-5 h-5 animate-pulse" />
                  <span className="text-sm font-medium font-armenian">{t('courses.learning-modules')}</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-armenian bg-gradient-to-r from-foreground via-edu-blue to-edu-purple bg-clip-text text-transparent leading-tight">
                  {t('courses.all-courses')}
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto font-armenian leading-relaxed">
                  {t('courses.modules-description')}
                </p>
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-edu-blue to-edu-purple rounded-full opacity-60 animate-bounce" />
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-edu-orange to-edu-yellow rounded-full opacity-40 animate-bounce animation-delay-1000" />
              <div className="absolute top-1/2 -right-8 w-4 h-4 bg-gradient-to-r from-edu-light-blue to-edu-purple rounded-full opacity-50 animate-pulse" />
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={200}>
            {/* Enhanced ModulesList Container */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-card/40 via-background/30 to-card/40 backdrop-blur-sm rounded-3xl border border-border/10 shadow-xl -m-4" />
              <div className="relative z-10 p-4">
                <ModulesList />
              </div>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-edu-blue/5 via-transparent to-edu-purple/5 rounded-3xl opacity-60" />
            </div>
          </ScrollReveal>
        </div>
      </main>
      
      <Footer />
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
};

export default Courses;
