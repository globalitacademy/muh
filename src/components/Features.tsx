
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Lightbulb, Clock, Users, Star, BookOpen, Trophy } from 'lucide-react';

const Features = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Lightbulb className="w-6 sm:w-8 h-6 sm:h-8" />,
      title: t('features.quality.title'),
      description: t('features.quality.desc'),
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: <Clock className="w-6 sm:w-8 h-6 sm:h-8" />,
      title: t('features.flexible.title'),
      description: t('features.flexible.desc'),
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: <Users className="w-6 sm:w-8 h-6 sm:h-8" />,
      title: t('features.support.title'),
      description: t('features.support.desc'),
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: <Star className="w-6 sm:w-8 h-6 sm:h-8" />,
      title: t('features.expert-evaluation'),
      description: t('features.expert-desc'),
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: <BookOpen className="w-6 sm:w-8 h-6 sm:h-8" />,
      title: t('features.interactive-learning'),
      description: t('features.interactive-desc'),
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: <Trophy className="w-6 sm:w-8 h-6 sm:h-8" />,
      title: t('features.certificates'),
      description: t('features.certificates-desc'),
      color: 'from-indigo-500 to-blue-600'
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background w-full">
      <div className="content-container">
        {/* Header section */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-edu-blue/10 text-edu-blue mb-4 sm:mb-6">
          <Star className="w-3 sm:w-4 h-3 sm:h-4" />
          <span className="font-medium font-armenian text-lg sm:text-xl lg:text-2xl">{t('features.why-choose')}</span>
        </div>
        
        <p className="text-lg sm:text-xl lg:text-xl text-muted-foreground font-armenian leading-relaxed mb-12 sm:mb-16 lg:mb-20 w-full">
          {t('features.main-desc')}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="modern-card course-card-hover border border-border/20 shadow-lg overflow-hidden group hover:border-edu-blue/50 transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-6 sm:p-8">
                <div className={`w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 sm:mb-6 bg-gradient-to-r ${feature.color} text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 font-armenian text-center group-hover:text-edu-blue transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-armenian text-center leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12 sm:mt-16 w-full">
          <div className="glass-card rounded-2xl p-6 sm:p-8 bg-card/80 backdrop-blur-sm border border-border/30 w-full">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 font-armenian">{t('features.ready-to-start')}</h3>
            <p className="text-muted-foreground mb-4 sm:mb-6 font-armenian text-sm sm:text-base">
              {t('features.ready-desc')}
            </p>
            <button className="btn-modern text-white px-6 sm:px-8 py-3 rounded-xl font-armenian font-semibold w-full sm:w-auto min-h-[48px]">
              {t('features.start-now')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
