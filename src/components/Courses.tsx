
import React from 'react';
import { Star } from 'lucide-react';
import SpecialtiesList from './SpecialtiesList';
import NetworkAnimation from './NetworkAnimation';
import ScrollReveal from '@/components/ui/scroll-reveal';

const Courses = () => {
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
          {/* Enhanced Header with Glass Effect */}
          <div className="relative mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-card/80 via-background/60 to-card/80 backdrop-blur-xl rounded-3xl border border-border/20 shadow-2xl" />
            <div className="relative z-10 p-8 md:p-12 text-center hover-scale animate-fade-in">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-edu-blue/20 to-edu-purple/20 text-edu-blue mb-6 border border-edu-blue/30 shadow-lg backdrop-blur-sm">
                <Star className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-medium font-armenian">Մասնագիտական ուղղություններ</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 font-armenian text-foreground leading-[1.2] py-2">
                Ընտրեք ձեր մասնագիտությունը
              </h2>
              
              <p className="text-xl md:text-2xl text-muted-foreground font-armenian leading-relaxed max-w-4xl mx-auto">
                Յուրաքանչյուր մասնագիտություն պարունակում է մոդուլային դասեր ըստ պետական հաստատված մասնագիտական չափորոշիչների, որոնք կօգնեն ձեզ կառուցել ամուր գիտելիքների հիմք
              </p>
            </div>
            
            {/* Floating particles */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-edu-blue to-edu-purple rounded-full opacity-60 animate-bounce" />
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-edu-orange to-edu-yellow rounded-full opacity-40 animate-bounce animation-delay-1000" />
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-gradient-to-r from-edu-light-blue to-edu-purple rounded-full opacity-50 animate-pulse" />
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
