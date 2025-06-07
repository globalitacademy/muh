
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Module } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import { useEnrollments, useEnrollModule } from '@/hooks/useEnrollments';
import { useNavigate } from 'react-router-dom';
import { getModuleIcon, getCategoryColor, getDifficultyColor, getDifficultyText } from '@/utils/moduleUtils';
import ModuleCardControls from './ModuleCardControls';
import ModuleCardStats from './ModuleCardStats';
import ModuleCardActions from './ModuleCardActions';

interface ModuleCardProps {
  module: Module;
  orderIndex?: number;
}

const ModuleCard = ({ module, orderIndex }: ModuleCardProps) => {
  const { user } = useAuth();
  const { data: enrollments } = useEnrollments();
  const enrollModule = useEnrollModule();
  const navigate = useNavigate();

  const isEnrolled = enrollments?.some(e => e.module_id === module.id);
  const isAdmin = user?.user_metadata?.role === 'admin';
  const isInstructor = user?.user_metadata?.role === 'instructor' && module.instructor === user?.user_metadata?.name;

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

  const handleEdit = () => {
    // TODO: Navigate to edit module page
    console.log('Edit module:', module.id);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality with confirmation
    console.log('Delete module:', module.id);
  };

  const handleManage = () => {
    // TODO: Navigate to module management page
    console.log('Manage module:', module.id);
  };

  return (
    <Card className={`relative overflow-hidden group h-full flex flex-col bg-gradient-to-br ${getCategoryColor(module.category)} backdrop-blur-sm border transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
      {/* Order number */}
      {orderIndex && (
        <div className="absolute top-4 left-4 z-10">
          <div className="w-8 h-8 rounded-full bg-edu-blue text-white flex items-center justify-center text-sm font-bold">
            {orderIndex}
          </div>
        </div>
      )}

      {/* Admin/Instructor controls */}
      <ModuleCardControls
        isAdmin={isAdmin}
        isInstructor={isInstructor}
        onEdit={handleEdit}
        onManage={handleManage}
        onDelete={handleDelete}
      />

      {/* Module icon */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-10 font-mono">
        {getModuleIcon(module.category)}
      </div>

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <Badge className={`${getDifficultyColor(module.difficulty_level)} border`}>
            {getDifficultyText(module.difficulty_level)}
          </Badge>
          <div className="bg-card/90 backdrop-blur-sm rounded-lg px-2 py-1 border border-border">
            <span className="text-sm font-semibold text-edu-blue">
              {module.price.toLocaleString()} ֏
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold font-armenian group-hover:text-edu-blue transition-colors line-clamp-2 text-card-foreground mb-2">
          {module.title}
        </h3>
        <p className="text-sm text-muted-foreground font-armenian">
          {module.instructor}
        </p>
      </CardHeader>

      <CardContent className="flex-1 relative z-10">
        <p className="text-muted-foreground font-armenian mb-4 line-clamp-3">
          {module.description}
        </p>
        
        <ModuleCardStats
          durationWeeks={module.duration_weeks}
          totalLessons={module.total_lessons}
          studentsCount={module.students_count}
          rating={module.rating}
        />
      </CardContent>

      <CardFooter className="pt-0 relative z-10">
        <ModuleCardActions
          isEnrolled={isEnrolled}
          isPending={enrollModule.isPending}
          onEnroll={handleEnroll}
          onViewModule={handleViewModule}
        />
      </CardFooter>
    </Card>
  );
};

export default ModuleCard;
