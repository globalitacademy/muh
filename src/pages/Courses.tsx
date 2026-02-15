import React from 'react';
import AppLayout from '@/components/AppLayout';
import ModulesList from '@/components/ModulesList';
import NetworkAnimation from '@/components/NetworkAnimation';
import ScrollReveal from '@/components/ui/scroll-reveal';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Courses = () => {
  const { t } = useLanguage();
  return (
    <AppLayout>
      <div className="relative overflow-hidden">
        {/* Network Animation Background */}
        <div className="absolute inset-0 opacity-40">
          <NetworkAnimation />
        </div>
        
        <div className="py-16 md:py-24 w-full relative z-10">
          <div className="content-container">
            <ScrollReveal direction="up" delay={0}>
              <div className="text-center mb-12 md:mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-edu-blue/10 text-edu-blue mb-6">
                  <Star className="w-5 h-5" />
                  <span className="text-sm font-medium font-armenian">{t('courses.learning-modules')}</span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 font-armenian text-foreground leading-tight">
                  {'\u0532\u0578\u056C\u0578\u0580 \u0544\u0578\u0564\u0578\u0582\u056C\u0576\u0565\u0580\u0568'}
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto font-armenian leading-relaxed px-4">
                  {t('courses.modules-description')}
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={200}>
              <ModulesList />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Courses;