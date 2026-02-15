import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SpecialtiesList from './SpecialtiesList';
import NetworkAnimation from './NetworkAnimation';
import ScrollReveal from '@/components/ui/scroll-reveal';
const Courses = () => {
  const context = useLanguage();
  const {
    t
  } = context || {
    t: (key: string) => key
  };
  return <section className="relative py-24 bg-gradient-to-br from-background via-background/95 to-accent/10 w-full overflow-hidden">
      {/* Network Animation Background */}
      <div className="absolute inset-0 opacity-60">
        <NetworkAnimation />
      </div>
      
      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-edu-blue/3 via-transparent to-edu-purple/5 animate-blob" />
      <div className="absolute inset-0 bg-gradient-to-tl from-edu-orange/2 via-transparent to-edu-light-blue/3 animate-blob animation-delay-2000" />
      
      <div className="content-container relative z-10">
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-armenian text-foreground leading-tight">
              {t('courses.choose-specialty')}
            </h2>
          </div>
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={200}>
          {/* Enhanced SpecialtiesList Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-card/40 via-background/30 to-card/40 backdrop-blur-sm rounded-3xl border border-border/10 shadow-xl" />
            <div className="relative z-10 p-6 md:p-8">
              <SpecialtiesList />
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-edu-blue/10 via-transparent to-edu-purple/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </ScrollReveal>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>;
};
export default Courses;