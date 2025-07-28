import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Lightbulb, Clock, Users, Star, BookOpen, Trophy, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/ui/scroll-reveal';
const EnhancedFeatures = () => {
  const {
    t
  } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const features = [{
    icon: <Lightbulb className="w-7 h-7" />,
    title: t('features.quality.title'),
    description: t('features.quality.desc'),
    color: 'from-blue-500 to-purple-600',
    priority: 1
  }, {
    icon: <Clock className="w-6 h-6" />,
    title: t('features.flexible.title'),
    description: t('features.flexible.desc'),
    color: 'from-green-500 to-teal-600',
    priority: 2
  }, {
    icon: <Users className="w-6 h-6" />,
    title: t('features.support.title'),
    description: t('features.support.desc'),
    color: 'from-orange-500 to-red-600',
    priority: 3
  }, {
    icon: <Star className="w-6 h-6" />,
    title: 'Փորձագիտական գնահատում',
    description: 'Ստացիր հետադարձ կապ մասնագետներից և բարելավի՛ր քո հմտությունները',
    color: 'from-yellow-500 to-orange-600',
    priority: 4
  }, {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Ինտերակտիվ ուսուցում',
    description: 'Գործնական առաջադրանքներ և իրական նախագծեր ուսումնառության համար',
    color: 'from-purple-500 to-pink-600',
    priority: 5
  }, {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Վկայագրեր',
    description: 'Ստացիր ճանաչված վկայագրեր դասընթացների ավարտին',
    color: 'from-indigo-500 to-blue-600',
    priority: 6
  }];
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cards = container.querySelectorAll('.feature-card');
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2 - rect.left;
        const cardCenterY = cardRect.top + cardRect.height / 2 - rect.top;
        const distance = Math.sqrt(Math.pow(x - cardCenterX, 2) + Math.pow(y - cardCenterY, 2));
        const maxDistance = 300;
        const influence = Math.max(0, 1 - distance / maxDistance);
        const rotateX = (y - cardCenterY) * influence * 0.1;
        const rotateY = (x - cardCenterX) * influence * -0.1;
        (card as HTMLElement).style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${influence * 20}px)`;
      });
    };
    const handleMouseLeave = () => {
      cards.forEach(card => {
        (card as HTMLElement).style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });
    };
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  return <section className="py-16 sm:py-20 lg:py-24 bg-background w-full relative overflow-hidden">
      {/* Background Network Lines */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="network-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="currentColor" opacity="0.3" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network-grid)" />
        </svg>
      </div>

      <div className="content-container relative z-10">
        {/* Header section */}
        <ScrollReveal delay={100}>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-edu-blue/10 text-edu-blue mb-6 backdrop-blur-sm border border-edu-blue/20">
              <Sparkles className="w-4 h-4 animate-pulse-slow" />
              <span className="font-medium font-armenian text-sm sm:text-base">Ինչու՞ ընտրել մեզ</span>
            </div>
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={200}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 font-armenian text-gradient text-center leading-tight">
            Մեր առավելություններն
          </h2>
        </ScrollReveal>
        
        <ScrollReveal delay={300}>
          <p className="text-lg sm:text-xl text-muted-foreground font-armenian leading-relaxed mb-16 max-w-3xl mx-auto text-center">
            Մենք առաջարկում ենք ամենաարդիական և արդյունավետ ուսումնական հարթակը՝ հնարավորություններով, որոնք կփոխեն ձեր ուսումնառության փորձը
          </p>
        </ScrollReveal>
        
        {/* Enhanced Features Grid */}
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
          {features.map((feature, index) => <ScrollReveal key={index} delay={400 + index * 100}>
              <Card className="
                  feature-card group relative overflow-hidden border-0 shadow-xl
                  transition-all duration-500 ease-out
                  hover:shadow-2xl hover:shadow-edu-blue/25
                  glass-card backdrop-blur-xl bg-card/60
                  cursor-pointer h-full
                " style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out'
          }}>
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Network connection indicator */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-edu-blue to-purple-600 rounded-full animate-pulse opacity-60 group-hover:opacity-100 transition-opacity" />
                
                <CardContent className="p-6 sm:p-8 h-full flex flex-col">
                  {/* Icon with enhanced styling */}
                  <div className="w-12 h-12 mx-auto bg-gradient-to-r from-edu-blue to-purple-600 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ease-out shadow-lg group-hover:shadow-xl mb-4">
                    {feature.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-semibold font-armenian text-center group-hover:text-gradient transition-all duration-300 mb-3 leading-tight">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-muted-foreground font-armenian text-center leading-relaxed text-sm sm:text-base group-hover:text-foreground/80 transition-colors duration-300 flex-1">
                    {feature.description}
                  </p>

                  {/* Hover effect indicator */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-edu-blue to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </CardContent>

                {/* Floating particles effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(3)].map((_, i) => <div key={i} className={`
                        absolute w-1 h-1 bg-gradient-to-r ${feature.color} rounded-full
                        opacity-0 group-hover:opacity-60
                        animate-bounce
                      `} style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }} />)}
                </div>
              </Card>
            </ScrollReveal>)}
        </div>

      </div>
    </section>;
};
export default EnhancedFeatures;