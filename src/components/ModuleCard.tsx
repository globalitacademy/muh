
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Module } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import { useEnrollments, useEnrollModule } from '@/hooks/useEnrollments';
import { useNavigate } from 'react-router-dom';
import { getModuleIcon, getCategoryColor } from '@/utils/moduleUtils';
import { ArrowRight } from 'lucide-react';

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

  const handleStartLearning = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!isEnrolled) {
      await enrollModule.mutateAsync(module.id);
    }
    
    navigate(`/course/${module.id}`);
  };

  return (
    <Card className={`relative overflow-hidden group h-full flex flex-col bg-gradient-to-br ${getCategoryColor(module.category)} backdrop-blur-sm border transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer`}>
      {/* Module number */}
      {orderIndex && (
        <div className="absolute top-4 left-4 z-10">
          <div className="w-10 h-10 rounded-full bg-edu-blue text-white flex items-center justify-center text-lg font-bold">
            {orderIndex}
          </div>
        </div>
      )}

      {/* Module icon - centered */}
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="text-8xl opacity-80 font-mono">
          {getModuleIcon(module.category)}
        </div>
      </div>

      <CardContent className="p-6 relative z-10">
        <h3 className="text-xl font-bold font-armenian text-center mb-6 text-card-foreground line-clamp-2">
          {module.title}
        </h3>
        
        <Button 
          onClick={handleStartLearning}
          disabled={enrollModule.isPending}
          className="w-full btn-modern font-armenian"
        >
          {enrollModule.isPending ? 'Գրանցվում է...' : 'Սկսել ուսուցումը'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
