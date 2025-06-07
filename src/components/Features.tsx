import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Lightbulb, Clock, Users, Star, BookOpen, Trophy } from 'lucide-react';
const Features = () => {
  const {
    t
  } = useLanguage();
  const features = [{
    icon: <Lightbulb className="w-8 h-8" />,
    title: t('features.quality.title'),
    description: t('features.quality.desc'),
    color: 'from-blue-500 to-purple-600'
  }, {
    icon: <Clock className="w-8 h-8" />,
    title: t('features.flexible.title'),
    description: t('features.flexible.desc'),
    color: 'from-green-500 to-teal-600'
  }, {
    icon: <Users className="w-8 h-8" />,
    title: t('features.support.title'),
    description: t('features.support.desc'),
    color: 'from-orange-500 to-red-600'
  }, {
    icon: <Star className="w-8 h-8" />,
    title: 'Փորձագիտական գնահատում',
    description: 'Ստացիր հետադարձ կապ մասնագետներից և բարելավի՛ր քո հմտությունները',
    color: 'from-yellow-500 to-orange-600'
  }, {
    icon: <BookOpen className="w-8 h-8" />,
    title: 'Ինտերակտիվ ուսուցում',
    description: 'Գործնական առաջադրանքներ և իրական նախագծեր ուսումնառության համար',
    color: 'from-purple-500 to-pink-600'
  }, {
    icon: <Trophy className="w-8 h-8" />,
    title: 'Վկայագրեր',
    description: 'Ստացիր ճանաչված վկայագրեր դասընթացների ավարտին',
    color: 'from-indigo-500 to-blue-600'
  }];
  return <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-edu-blue/10 text-edu-blue mb-6">
            <Star className="w-4 h-4" />
            <span className="font-medium font-armenian text-4xl">Ինչու՞ ընտրել մեզ</span>
          </div>
          <h2 className="text-4xl font-bold mb-6 font-armenian text-gradient md:text-4xl">
            {t('features.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-armenian leading-relaxed">
            Մենք առաջարկում ենք ամենաարդիական և արդյունավետ ուսումնական հարթակը
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => <Card key={index} className="modern-card course-card-hover border-0 shadow-lg overflow-hidden group">
              <CardContent className="p-8">
                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${feature.color} text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 font-armenian text-center group-hover:text-edu-blue transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-armenian text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>)}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 font-armenian">Պատրա՞ստ եք սկսելու</h3>
            <p className="text-muted-foreground mb-6 font-armenian">
              Միացիր մեր համայնքին և սկսիր քո ուսումնական ճանապարհորդությունը
            </p>
            <button className="btn-modern text-white px-8 py-3 rounded-xl font-armenian font-semibold">
              Սկսել հիմա
            </button>
          </div>
        </div>
      </div>
    </section>;
};
export default Features;