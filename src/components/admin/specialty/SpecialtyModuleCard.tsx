
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Edit, Trash2, BookOpen, Users, Star, Clock } from 'lucide-react';
import { Module } from '@/types/database';
import { useDeleteModule, useUpdateModule } from '@/hooks/useAdminModules';
import { cn } from '@/lib/utils';
import SpecialtyTopicsList from './SpecialtyTopicsList';

interface SpecialtyModuleCardProps {
  module: Module;
  onEdit: (module: Module) => void;
  onAddTopic: (moduleId: string) => void;
}

const SpecialtyModuleCard = ({ module, onEdit, onAddTopic }: SpecialtyModuleCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const deleteModule = useDeleteModule();
  const updateModule = useUpdateModule();

  const handleDelete = async () => {
    if (confirm('Վստա՞հ եք, որ ուզում եք ջնջել այս մոդուլը:')) {
      await deleteModule.mutateAsync(module.id);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateModule.mutateAsync({
      id: module.id,
      updates: { status: newStatus as 'draft' | 'active' | 'archived' | 'coming_soon' }
    });
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

  const getModuleStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Սևագիր';
      case 'active':
        return 'Ակտիվ';
      case 'archived':
        return 'Արխիվ';
      case 'coming_soon':
        return 'Շուտով';
      default:
        return 'Սևագիր';
    }
  };

  const getModuleStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'archived':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
      case 'coming_soon':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      default:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300';
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
                <Select value={module.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full h-8 text-xs font-armenian">
                    <SelectValue>
                      <span className={`px-2 py-1 rounded-full text-xs ${getModuleStatusColor(module.status)}`}>
                        {getModuleStatusText(module.status)}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft" className="font-armenian">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        Սևագիր
                      </span>
                    </SelectItem>
                    <SelectItem value="active" className="font-armenian">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Ակտիվ
                      </span>
                    </SelectItem>
                    <SelectItem value="coming_soon" className="font-armenian">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Շուտով
                      </span>
                    </SelectItem>
                    <SelectItem value="archived" className="font-armenian">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                        Արխիվ
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
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
