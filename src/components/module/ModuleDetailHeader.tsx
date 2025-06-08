
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Module } from '@/types/database';
import { getDifficultyText } from '@/utils/moduleUtils';

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

const ModuleDetailHeader = ({ module, topicsCount }: ModuleDetailHeaderProps) => {
  return (
    <div className="mb-8">
      {module.image_url && (
        <img
          src={module.image_url}
          alt={module.title}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      )}
      
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-3xl font-bold font-armenian">{module.title}</h1>
        <Badge className={getDifficultyColor(module.difficulty_level)}>
          {getDifficultyText(module.difficulty_level)}
        </Badge>
      </div>

      <p className="text-lg text-muted-foreground font-armenian mb-6">
        {module.description}
      </p>
    </div>
  );
};

export default ModuleDetailHeader;
