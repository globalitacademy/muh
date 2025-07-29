
import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SpecialtiesList from './SpecialtiesList';
import NetworkAnimation from './NetworkAnimation';
import ScrollReveal from '@/components/ui/scroll-reveal';

const Courses = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-24 bg-gradient-to-br from-background via-background/95 to-accent/10 w-full overflow-hidden">
      {/* Network Animation Background */}
      <div className="absolute inset-0 opacity-60">
        <NetworkAnimation />
      </div>
      
      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-edu-blue/3 via-transparent to-edu-purple/5 animate-blob" />
      <div className="absolute inset-0 bg-gradient-to-tl from-edu-orange/2 via-transparent to-edu-light-blue/3 animate-blob animation-delay-2000" />
      
      <div className="content-container relative z-10">
        <ScrollReveal direction="up" delay={0}>
          {/* Modern Glass Morphism Header */}
          <div className="relative mb-20 group">
            {/* Main glass container */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-background/80 via-card/90 to-background/70 backdrop-blur-2xl border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.02]">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-edu-blue/10 via-edu-purple/5 to-edu-orange/10 animate-gradient-xy" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-edu-light-blue/20 via-transparent to-transparent" />
              
              {/* Content container with modern spacing */}
              <div className="relative z-10 px-8 py-12 md:px-16 md:py-16 text-center">
                {/* Premium badge with neon glow */}
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-edu-blue/20 via-edu-purple/15 to-edu-blue/20 text-edu-blue mb-8 border border-edu-blue/30 shadow-lg backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-edu-blue/10 to-edu-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Star className="w-5 h-5 animate-pulse relative z-10" />
                  <span className="text-sm font-semibold font-armenian tracking-wide relative z-10">{t('courses.professional-directions')}</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-edu-blue/20 to-edu-purple/20 blur-xl opacity-50" />
                </div>
                
                {/* Modern typography with enhanced gradient */}
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 font-armenian bg-gradient-to-r from-foreground via-edu-blue to-edu-purple bg-clip-text text-transparent leading-[1.1] py-2 tracking-tight">
                  {t('courses.choose-specialty')}
                </h2>
                
                {/* Enhanced description with better typography */}
                <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground/90 font-armenian leading-relaxed max-w-5xl mx-auto font-light">
                  {t('courses.modular-desc')}
                </p>
              </div>
              
              {/* Modern floating elements */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-edu-blue to-edu-purple rounded-2xl opacity-60 animate-float" />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gradient-to-br from-edu-orange to-edu-yellow rounded-xl opacity-50 animate-float animation-delay-1000" />
              <div className="absolute top-1/3 -right-8 w-6 h-6 bg-gradient-to-br from-edu-light-blue to-edu-purple rounded-lg opacity-40 animate-float animation-delay-2000" />
              <div className="absolute bottom-1/3 -left-4 w-4 h-4 bg-gradient-to-br from-edu-purple to-edu-blue rounded-full opacity-30 animate-float animation-delay-3000" />
            </div>
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
    </section>
  );
};

export default Courses;
