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
  return;
};
export default Stats;