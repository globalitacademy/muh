
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Edit, Trash2, Plus, BookOpen } from 'lucide-react';
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
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                <div>
                  <CardTitle className="text-lg font-armenian">{module.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getDifficultyColor(module.difficulty_level)}>
                      {module.difficulty_level === 'beginner' ? 'Սկսնակ' : 
                       module.difficulty_level === 'intermediate' ? 'Միջին' : 'Բարձրակարգ'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {module.duration_weeks} շաբաթ • {module.total_lessons} դաս
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(module)}
                  className="font-armenian"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Խմբագրել
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="font-armenian"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Ջնջել
                </Button>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {module.description && (
              <p className="text-sm text-muted-foreground mb-4 font-armenian">
                {module.description}
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div>
                <span className="font-medium font-armenian">Գին:</span>
                <span className="ml-2">{module.price}֏</span>
              </div>
              <div>
                <span className="font-medium font-armenian">Ուսանողներ:</span>
                <span className="ml-2">{module.students_count}</span>
              </div>
              <div>
                <span className="font-medium font-armenian">Գնահատական:</span>
                <span className="ml-2">{module.rating || 'Չկա'}</span>
              </div>
              <div>
                <span className="font-medium font-armenian">Կարգավիճակ:</span>
                <Badge variant={module.is_active ? 'default' : 'secondary'} className="ml-2">
                  {module.is_active ? 'Ակտիվ' : 'Ոչ ակտիվ'}
                </Badge>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium flex items-center gap-2 font-armenian">
                  <BookOpen className="w-4 h-4" />
                  Թեմաներ և դասեր
                </h4>
                <Button
                  size="sm"
                  onClick={() => onAddTopic(module.id)}
                  className="font-armenian"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Նոր թեմա
                </Button>
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
