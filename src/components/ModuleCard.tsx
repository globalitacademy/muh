
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Module } from '@/types/database';
import { useNavigate } from 'react-router-dom';
import { getModuleIcon } from '@/utils/moduleUtils';

interface ModuleCardProps {
  module: Module;
  orderIndex?: number;
}

const ModuleCard = ({ module }: ModuleCardProps) => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate(`/module/${module.id}`);
  };

  return (
    <Card className="relative overflow-hidden h-full flex flex-col modern-card border border-border rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group">
      <CardContent className="p-8 flex flex-col items-center text-center h-full">
        {/* Module Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-edu-blue/20 to-purple-600/20 border border-edu-blue/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-edu-blue">
          {getModuleIcon(module.category, module.title)}
        </div>

        {/* Module Number */}
        {module.order_index && (
          <div className="text-edu-blue text-2xl font-bold mb-4 font-armenian">
            {module.order_index}.
          </div>
        )}

        {/* Module Title */}
        <h3 className="text-foreground text-xl font-bold mb-6 font-armenian leading-tight flex-grow flex items-center">
          {module.title}
        </h3>

        {/* Start Learning Button */}
        <Button 
          onClick={handleStartLearning}
          className="w-full btn-modern text-white border-0 font-armenian font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Սկսել ուսուցումը
        </Button>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
