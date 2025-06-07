
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up font-armenian">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up font-armenian" style={{ animationDelay: '0.2s' }}>
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" className="bg-white text-edu-blue hover:bg-gray-100 font-semibold px-8 py-3 text-lg">
              {t('hero.cta')}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-edu-blue font-semibold px-8 py-3 text-lg">
              {t('hero.learn-more')}
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-white/20 rounded-full animate-pulse-subtle"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-20 w-20 h-20 bg-white/15 rounded-full animate-pulse-subtle" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-40 right-10 w-12 h-12 bg-white/25 rounded-full animate-pulse-subtle" style={{ animationDelay: '1.5s' }}></div>
    </section>
  );
};

export default Hero;
