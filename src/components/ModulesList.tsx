
import React from 'react';
import { useModules } from '@/hooks/useModules';
import ModuleCard from './ModuleCard';
import { Loader2, BookOpen } from 'lucide-react';
import ScrollReveal from '@/components/ui/scroll-reveal';

const ModulesList = () => {
  const { data: modules, isLoading, error } = useModules();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-edu-blue drop-shadow-lg" />
          <div className="absolute inset-0 h-12 w-12 border-2 border-edu-blue/20 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="relative inline-block p-8 bg-gradient-to-br from-destructive/10 to-destructive/5 backdrop-blur-sm rounded-2xl border border-destructive/20">
          <div className="text-destructive font-armenian text-lg">Սխալ է տեղի ունեցել տվյալները բեռնելիս</div>
        </div>
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="relative inline-block p-12 bg-gradient-to-br from-muted/20 to-muted/10 backdrop-blur-sm rounded-3xl border border-border/20 shadow-lg">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
          <div className="text-muted-foreground font-armenian text-xl mb-2">Դասընթացներ չեն գտնվել</div>
          <p className="text-sm text-muted-foreground/80">Ստեղծեք ձեր առաջին դասընթացը</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Enhanced grid with staggered animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
        {modules.map((module, index) => (
          <ScrollReveal 
            key={module.id}
            direction="up"
            delay={index * 100}
            className="h-full"
          >
            <ModuleCard 
              module={module}
              orderIndex={module.order_index}
            />
          </ScrollReveal>
        ))}
      </div>
      
      {/* Floating background elements */}
      <div className="absolute -z-10 top-10 left-10 w-32 h-32 bg-gradient-to-br from-edu-blue/5 to-edu-purple/5 rounded-full blur-3xl animate-blob" />
      <div className="absolute -z-10 bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-edu-orange/5 to-edu-yellow/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute -z-10 top-40 right-10 w-24 h-24 bg-gradient-to-br from-edu-light-blue/5 to-edu-purple/5 rounded-full blur-3xl animate-blob animation-delay-4000" />
    </div>
  );
};

export default ModulesList;
