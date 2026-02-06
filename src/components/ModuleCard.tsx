
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Module } from '@/types/database';
import { useNavigate } from 'react-router-dom';
import { getModuleIconFromDb } from '@/utils/moduleUtils';
import { useLanguage } from '@/contexts/LanguageContext';

interface ModuleCardProps {
  module: Module;
  orderIndex?: number;
}

const ModuleCard = ({ module }: ModuleCardProps) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  // Helper function to get localized text
  const getLocalizedText = (item: any, field: string) => {
    if (language === 'en' && item[`${field}_en`]) {
      return item[`${field}_en`];
    }
    if (language === 'ru' && item[`${field}_ru`]) {
      return item[`${field}_ru`];
    }
    return item[field]; // Default to Armenian
  };

  const handleStartLearning = () => {
    navigate(`/module/${module.id}`);
  };

  return (
    <Card className="relative overflow-hidden h-full flex flex-col group cursor-pointer transition-all duration-500 hover:scale-[1.02] border-0 shadow-none">
      {/* Enhanced glass background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-card/60 via-background/40 to-card/60 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 border border-border/20 group-hover:border-edu-blue/30 rounded-2xl transition-colors duration-500" />
      
      {/* Interactive gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-edu-blue/0 via-transparent to-edu-purple/0 group-hover:from-edu-blue/10 group-hover:to-edu-purple/10 transition-all duration-500 rounded-2xl" />
      
      {/* Enhanced glow effect */}
      <div className="absolute inset-0 shadow-2xl shadow-edu-blue/0 group-hover:shadow-edu-blue/20 transition-all duration-500 rounded-2xl" />
      
      <CardContent className="p-8 flex flex-col items-center text-center h-full relative z-10">
        {/* Enhanced Module Icon with floating effect */}
        <div className="relative mb-8 group-hover:scale-110 transition-all duration-500">
          <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-edu-blue/20 via-edu-blue/30 to-purple-600/20 border border-edu-blue/40 flex items-center justify-center text-edu-blue shadow-xl group-hover:shadow-2xl group-hover:shadow-edu-blue/30 transition-all duration-500">
            {getModuleIconFromDb((module as any).icon)}
            
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-edu-blue/0 to-edu-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          {/* Floating ring effect */}
          <div className="absolute inset-0 w-24 h-24 rounded-2xl border-2 border-edu-blue/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Orbital particles */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-edu-orange to-edu-yellow rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-500" />
          <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-gradient-to-r from-edu-light-blue to-edu-purple rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500" />
        </div>

        {/* Enhanced Module Number with gradient */}
        {module.order_index && (
          <div className="text-3xl font-bold mb-6 font-armenian text-edu-blue group-hover:scale-110 transition-transform duration-300">
            {module.order_index}.
          </div>
        )}

        {/* Enhanced Module Title with better typography */}
        <h3 className="text-foreground text-xl font-bold mb-8 font-armenian leading-tight flex-grow flex items-center group-hover:text-edu-blue transition-colors duration-300 text-center">
          {getLocalizedText(module, 'title')}
        </h3>

        {/* Enhanced Start Learning Button with modern styling */}
        <Button 
          onClick={handleStartLearning}
          className="w-full relative overflow-hidden bg-gradient-to-r from-edu-blue via-edu-blue to-edu-purple text-white border-0 font-armenian font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-edu-blue/30 group/btn"
        >
          {/* Button shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-out" />
          
          <span className="relative z-10">{t('courses.start-learning')}</span>
          
          {/* Button glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-edu-blue to-edu-purple opacity-0 group-hover/btn:opacity-20 rounded-xl transition-opacity duration-300" />
        </Button>
      </CardContent>
      
      {/* Corner decorative elements */}
      <div className="absolute top-4 right-4 w-1 h-8 bg-gradient-to-b from-edu-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-4 right-4 w-8 h-1 bg-gradient-to-r from-edu-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="absolute bottom-4 left-4 w-1 h-8 bg-gradient-to-t from-edu-purple/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-4 left-4 w-8 h-1 bg-gradient-to-l from-edu-purple/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Card>
  );
};

export default ModuleCard;
