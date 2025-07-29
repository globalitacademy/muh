import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Module } from '@/types/database';
import { getDifficultyText } from '@/utils/moduleUtils';
import { useLanguage } from '@/contexts/LanguageContext';
interface ModuleDetailHeaderProps {
  module: Module;
  topicsCount: number;
}
const getDifficultyColor = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'bg-success-green/20 text-success-green border-success-green/30';
    case 'intermediate':
      return 'bg-warning-yellow/20 text-warning-yellow border-warning-yellow/30';
    case 'advanced':
      return 'bg-destructive/20 text-destructive border-destructive/30';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};
const ModuleDetailHeader = ({
  module,
  topicsCount
}: ModuleDetailHeaderProps) => {
  const { language } = useLanguage();
  
  // Helper function to get localized text
  const getLocalizedText = (item: any, field: string) => {
    if (language === 'en' && item[`${field}_en`]) {
      return item[`${field}_en`];
    }
    if (language === 'ru' && item[`${field}_ru`]) {
      return item[`${field}_ru`];
    }
    return item[field]; // Default to Armenian
  };
  return <div className="mb-8">
      {module.image_url && <img src={module.image_url} alt={getLocalizedText(module, 'title')} className="w-full h-64 object-cover rounded-xl mb-6" />}
      
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-3xl font-bold font-armenian">{getLocalizedText(module, 'title')}</h1>
        <Badge className="">
          {getDifficultyText(module.difficulty_level)}
        </Badge>
      </div>

      
    </div>;
};
export default ModuleDetailHeader;