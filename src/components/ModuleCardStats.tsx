
import React from 'react';
import { Clock, Users, Star, BookOpen } from 'lucide-react';

interface ModuleCardStatsProps {
  durationWeeks: number;
  totalLessons: number;
  studentsCount: number;
  rating: number | null;
}

const ModuleCardStats = ({ durationWeeks, totalLessons, studentsCount, rating }: ModuleCardStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="font-armenian text-card-foreground">{durationWeeks} շաբաթ</span>
      </div>
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-muted-foreground" />
        <span className="font-armenian text-card-foreground">{totalLessons} դաս</span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span className="font-armenian text-card-foreground">{studentsCount} ուսանող</span>
      </div>
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-warning-yellow fill-current" />
        <span className="text-card-foreground">{rating?.toFixed(1) || 'N/A'}</span>
      </div>
    </div>
  );
};

export default ModuleCardStats;
