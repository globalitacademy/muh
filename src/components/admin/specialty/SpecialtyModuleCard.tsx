
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Edit, Trash2, BookOpen, Users, Star, Clock } from 'lucide-react';
import { Module } from '@/types/database';
import { useDeleteModule } from '@/hooks/useAdminModules';
import SpecialtyTopicsList from './SpecialtyTopicsList';

interface SpecialtyModuleCardProps {
  module: Module;
  onEdit: (module: Module) => void;
  onAddTopic: (moduleId: string) => void;
}

const SpecialtyModuleCard = ({ module, onEdit, onAddTopic }: SpecialtyModuleCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const deleteModule = useDeleteModule();

  const handleDelete = async () => {
    if (confirm('Վստա՞հ եք, որ ուզում եք ջնջել այս մոդուլը:')) {
      await deleteModule.mutateAsync(module.id);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-gradient-to-r from-success-green/20 to-success-green/10 text-success-green border-success-green/30';
      case 'intermediate':
        return 'bg-gradient-to-r from-warning-yellow/20 to-warning-yellow/10 text-warning-yellow border-warning-yellow/30';
      case 'advanced':
        return 'bg-gradient-to-r from-destructive/20 to-destructive/10 text-destructive border-destructive/30';
      default:
        return 'bg-gradient-to-r from-muted/50 to-muted/30 text-muted-foreground border-muted/50';
    }
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Սկսնակ';
      case 'intermediate':
        return 'Միջին';
      case 'advanced':
        return 'Բարձրակարգ';
      default:
        return level;
    }
  };

  return (
    <Card className="mb-6 modern-card hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover-interactive transition-all duration-200 bg-gradient-to-r from-card to-muted/20 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-edu-blue/20 to-edu-orange/20 border border-border/50">
                  <ChevronDown className={cn(
                    "w-5 h-5 transition-all duration-300 text-edu-blue",
                    isOpen ? 'rotate-180' : ''
                  )} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl font-armenian text-foreground mb-2">
                    {module.title}
                  </CardTitle>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className={cn("border", getDifficultyColor(module.difficulty_level))}>
                      {getDifficultyLabel(module.difficulty_level)}
                    </Badge>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{module.duration_weeks} շաբաթ</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{module.total_lessons} դաս</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{module.students_count} ուսանող</span>
                      </div>
                      {module.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-warning-yellow text-warning-yellow" />
                          <span>{module.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(module)}
                  className="font-armenian hover:bg-edu-blue/10 hover:border-edu-blue/30 transition-all duration-200"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Խմբագրել
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="font-armenian hover:shadow-md transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Ջնջել
                </Button>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-6">
            {module.description && (
              <div className="mb-6 p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border border-border/30">
                <p className="text-sm text-muted-foreground font-armenian leading-relaxed">
                  {module.description}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-card to-muted/20 rounded-lg border border-border/30">
                <div className="text-xs font-medium font-armenian text-muted-foreground mb-1">Գին</div>
                <div className="text-lg font-bold text-edu-blue">{module.price}֏</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-card to-muted/20 rounded-lg border border-border/30">
                <div className="text-xs font-medium font-armenian text-muted-foreground mb-1">Ուսանողներ</div>
                <div className="text-lg font-bold text-foreground">{module.students_count}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-card to-muted/20 rounded-lg border border-border/30">
                <div className="text-xs font-medium font-armenian text-muted-foreground mb-1">Գնահատական</div>
                <div className="text-lg font-bold text-warning-yellow">{module.rating || 'Չկա'}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-card to-muted/20 rounded-lg border border-border/30">
                <div className="text-xs font-medium font-armenian text-muted-foreground mb-1">Կարգավիճակ</div>
                <Badge 
                  variant={module.is_active ? 'default' : 'secondary'} 
                  className={cn(
                    "text-xs",
                    module.is_active 
                      ? "bg-gradient-to-r from-success-green/20 to-success-green/10 text-success-green border-success-green/30" 
                      : "bg-gradient-to-r from-muted/50 to-muted/30 text-muted-foreground border-muted/50"
                  )}
                >
                  {module.is_active ? 'Ակտիվ' : 'Ոչ ակտիվ'}
                </Badge>
              </div>
            </div>
            
            <div className="border-t border-border/30 pt-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-semibold text-lg flex items-center gap-3 font-armenian">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-edu-blue/20 to-edu-orange/20 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-edu-blue" />
                  </div>
                  Թեմաներ և դասեր
                </h4>
              </div>
              <SpecialtyTopicsList moduleId={module.id} />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default SpecialtyModuleCard;
