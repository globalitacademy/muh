
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Module } from '@/types/database';
import { useNavigate } from 'react-router-dom';
import { getModuleIcon } from '@/utils/moduleUtils';
import ScrollReveal from '@/components/ui/scroll-reveal';

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
    <ScrollReveal>
      <Card className="relative overflow-hidden h-full flex flex-col modern-card border border-border rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-edu-blue/10 group">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-edu-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="p-8 flex flex-col items-center text-center h-full relative z-10">
          {/* Enhanced Module Icon */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-edu-blue/20 to-purple-600/20 border border-edu-blue/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 text-edu-blue">
            {getModuleIcon(module.category, module.title)}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-edu-blue/0 to-edu-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Enhanced Module Number */}
          {module.order_index && (
            <div className="text-edu-blue text-2xl font-bold mb-4 font-armenian animate-bounce-subtle">
              {module.order_index}.
            </div>
          )}

          {/* Enhanced Module Title */}
          <h3 className="text-foreground text-xl font-bold mb-6 font-armenian leading-tight flex-grow flex items-center group-hover:text-edu-blue transition-colors duration-300">
            {module.title}
          </h3>

          {/* Enhanced Start Learning Button */}
          <Button 
            onClick={handleStartLearning}
            className="w-full btn-modern text-white border-0 font-armenian font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-glow"
          >
            Սկսել ուսուցումը
          </Button>
        </CardContent>
      </Card>
    </ScrollReveal>
  );
};

export default ModuleCard;
