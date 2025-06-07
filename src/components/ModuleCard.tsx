
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Module } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import { useEnrollments, useEnrollModule } from '@/hooks/useEnrollments';
import { useNavigate } from 'react-router-dom';
import { getModuleIcon } from '@/utils/moduleUtils';

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
    <Card className="relative overflow-hidden h-full flex flex-col bg-slate-900 border-2 border-blue-500/50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-400">
      <CardContent className="p-8 flex flex-col items-center text-center h-full">
        {/* Module Icon */}
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-6">
          <span className="text-2xl text-blue-400">
            {getModuleIcon(module.category)}
          </span>
        </div>

        {/* Module Number */}
        {orderIndex && (
          <div className="text-white text-xl font-bold mb-4 font-armenian">
            {orderIndex}.
          </div>
        )}

        {/* Module Title */}
        <h3 className="text-white text-xl font-bold mb-4 font-armenian leading-tight">
          {module.title}
        </h3>

        {/* Module Description */}
        <p className="text-slate-400 text-sm mb-8 font-armenian leading-relaxed flex-1">
          Ամենը թեականակերը ունակակերը հանդարց
        </p>

        {/* Start Learning Button */}
        <Button 
          onClick={handleStartLearning}
          disabled={enrollModule.isPending}
          variant="outline"
          className="w-auto px-8 py-2 bg-transparent border-slate-600 text-white hover:bg-slate-800 hover:border-slate-500 font-armenian transition-all duration-200"
        >
          {enrollModule.isPending ? 'Գրանցվում է...' : 'Սկսել ուսուցումը'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
