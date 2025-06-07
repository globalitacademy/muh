
import React from 'react';
import { useModules } from '@/hooks/useModules';
import ModuleCard from './ModuleCard';
import { Loader2, BookOpen } from 'lucide-react';

const ModulesList = () => {
  const { data: modules, isLoading, error } = useModules();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-edu-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 font-armenian">Սխալ է տեղի ունեցել տվյալները բեռնելիս</div>
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <div className="text-muted-foreground font-armenian">Դասընթացներ չեն գտնվել</div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {modules.map((module, index) => (
        <ModuleCard 
          key={module.id} 
          module={module} 
          orderIndex={index + 1}
        />
      ))}
    </div>
  );
};

export default ModulesList;
