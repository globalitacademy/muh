
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, BookOpen, ArrowRight, Edit, Trash2, Settings } from 'lucide-react';
import { Module } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import { useEnrollments, useEnrollModule } from '@/hooks/useEnrollments';
import { useNavigate } from 'react-router-dom';

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
  const isAdmin = user?.role === 'admin';
  const isInstructor = user?.role === 'instructor' && module.instructor === user?.name;

  const getModuleIcon = (category: string) => {
    switch (category) {
      case 'ծրագրավորում':
        return '< >';
      case 'վեբ':
        return '📝';
      case 'տվյալներ':
        return '🗃️';
      case 'ցանցեր':
      case 'անվտանգություն':
        return '🌐';
      case 'դիզայն':
      case 'UI/UX':
        return '🎨';
      default:
        return '💻';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ծրագրավորում':
        return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
      case 'վեբ':
        return 'from-green-500/20 to-green-600/20 border-green-500/30';
      case 'տվյալներ':
        return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
      case 'ցանցեր':
      case 'անվտանգություն':
        return 'from-orange-500/20 to-orange-600/20 border-orange-500/30';
      case 'դիզայն':
      case 'UI/UX':
        return 'from-pink-500/20 to-pink-600/20 border-pink-500/30';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

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
      {(isAdmin || isInstructor) && (
        <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="outline"
            onClick={handleEdit}
            className="w-8 h-8 p-0 bg-background/80 backdrop-blur-sm"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleManage}
            className="w-8 h-8 p-0 bg-background/80 backdrop-blur-sm"
          >
            <Settings className="w-4 h-4" />
          </Button>
          {isAdmin && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              className="w-8 h-8 p-0 bg-background/80 backdrop-blur-sm text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

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

      <CardFooter className="pt-0 relative z-10">
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
              {enrollModule.isPending ? 'Գրանցվում է...' : 'Նկեցի ուսուցում'}
            </Button>
          )}
          {!isEnrolled && (
            <Button 
              variant="outline" 
              onClick={handleViewModule}
              className="w-full font-armenian border-border text-foreground hover:bg-accent bg-background/80 backdrop-blur-sm"
            >
              Նկեցի ուսուցում
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ModuleCard;
