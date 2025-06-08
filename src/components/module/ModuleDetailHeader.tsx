
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, BookOpen, User } from 'lucide-react';
import { Module } from '@/types/database';
import { Topic } from '@/types/database';
import { getDifficultyColor, getDifficultyText } from '@/utils/moduleUtils';

interface ModuleDetailHeaderProps {
  module: Module;
  topicsCount: number;
}

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="font-semibold">{module.duration_weeks}</div>
            <div className="text-sm text-muted-foreground font-armenian">շաբաթ</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="font-semibold">{topicsCount}</div>
            <div className="text-sm text-muted-foreground font-armenian">դաս</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="font-semibold">{module.students_count}</div>
            <div className="text-sm text-muted-foreground font-armenian">ուսանող</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-warning-yellow fill-current" />
          <div>
            <div className="font-semibold">{module.rating?.toFixed(1) || 'N/A'}</div>
            <div className="text-sm text-muted-foreground font-armenian">գնահատական</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <User className="w-5 h-5 text-muted-foreground" />
        <span className="font-armenian">Մասնագետ: {module.instructor}</span>
      </div>
    </div>
  );
};

export default ModuleDetailHeader;
