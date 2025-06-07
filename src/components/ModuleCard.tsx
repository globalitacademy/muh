
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, BookOpen, ArrowRight } from 'lucide-react';
import { Module } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import { useEnrollments, useEnrollModule } from '@/hooks/useEnrollments';
import { useNavigate } from 'react-router-dom';

interface ModuleCardProps {
  module: Module;
}

const ModuleCard = ({ module }: ModuleCardProps) => {
  const { user } = useAuth();
  const { data: enrollments } = useEnrollments();
  const enrollModule = useEnrollModule();
  const navigate = useNavigate();

  const isEnrolled = enrollments?.some(e => e.module_id === module.id);

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

  const getDifficultyText = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Սկսնակ';
      case 'intermediate':
        return 'Միջին';
      case 'advanced':
        return 'Բարձր';
      default:
        return level;
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    await enrollModule.mutateAsync(module.id);
  };

  const handleViewModule = () => {
    navigate(`/course/${module.id}`);
  };

  return (
    <Card className="bg-card border-border course-card-hover overflow-hidden group h-full flex flex-col">
      <div className="relative">
        {module.image_url && (
          <img
            src={module.image_url}
            alt={module.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute top-4 left-4">
          <Badge className={`${getDifficultyColor(module.difficulty_level)} border`}>
            {getDifficultyText(module.difficulty_level)}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg px-2 py-1 border border-border">
          <span className="text-sm font-semibold text-edu-blue">
            {module.price.toLocaleString()} ֏
          </span>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="text-xl font-bold font-armenian group-hover:text-edu-blue transition-colors line-clamp-2 text-card-foreground">
          {module.title}
        </h3>
        <p className="text-sm text-muted-foreground font-armenian">
          {module.instructor}
        </p>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-muted-foreground font-armenian mb-4 line-clamp-3">
          {module.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-armenian text-card-foreground">{module.duration_weeks} շաբաթ</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="font-armenian text-card-foreground">{module.total_lessons} դաս</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="font-armenian text-card-foreground">{module.students_count} ուսանող</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-warning-yellow fill-current" />
            <span className="text-card-foreground">{module.rating?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="w-full space-y-2">
          {isEnrolled ? (
            <Button 
              onClick={handleViewModule}
              className="w-full btn-modern font-armenian"
            >
              Շարունակել դասընթացը
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleEnroll}
              disabled={enrollModule.isPending}
              className="w-full btn-modern font-armenian"
            >
              {enrollModule.isPending ? 'Գրանցվում է...' : 'Գրանցվել դասընթացին'}
            </Button>
          )}
          {!isEnrolled && (
            <Button 
              variant="outline" 
              onClick={handleViewModule}
              className="w-full font-armenian border-border text-foreground hover:bg-accent"
            >
              Տեսնել մանրամասները
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ModuleCard;
