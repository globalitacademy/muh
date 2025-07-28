import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Users, BookOpen, GraduationCap, Award } from 'lucide-react';
import { useContactStats } from '@/hooks/useContactStats';
const Stats = () => {
  const {
    t
  } = useLanguage();
  const {
    data: stats,
    isLoading: statsLoading
  } = useContactStats();
  const statsData = [{
    value: statsLoading ? '...' : `${stats?.studentsCount || 0}+`,
    label: t('stats.students'),
    icon: <Users className="w-8 h-8" />
  }, {
    value: statsLoading ? '...' : `${stats?.modulesCount || 0}+`,
    label: t('stats.courses'),
    icon: <BookOpen className="w-8 h-8" />
  }, {
    value: statsLoading ? '...' : `${stats?.instructorsCount || 0}+`,
    label: t('stats.instructors'),
    icon: <GraduationCap className="w-8 h-8" />
  }, {
    value: '95%',
    label: t('stats.completion'),
    icon: <Award className="w-8 h-8" />
  }];

  return (
    <section className="py-16 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4 text-primary">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Stats;