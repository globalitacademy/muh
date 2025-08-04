
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Edit, Trash2, BookOpen } from 'lucide-react';
import { Specialty } from '@/types/specialty';
import { Module } from '@/types/database';
import { useSpecialtyModules } from '@/hooks/useSpecialtyModules';
import { useUpdateSpecialty } from '@/hooks/useSpecialties';
import { iconOptions } from './SpecialtyConstants';
import SpecialtyModuleCard from './SpecialtyModuleCard';

interface SpecialtyCardProps {
  specialty: Specialty;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (specialty: Specialty) => void;
  onDelete: (specialtyId: string) => void;
  onAddModule: (specialtyId: string) => void;
  onEditModule: (module: Module) => void;
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Ակտիվ';
    case 'inactive':
      return 'Ոչ ակտիվ';
    case 'coming_soon':
      return 'Շուտով';
    default:
      return 'Ակտիվ';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
    case 'inactive':
      return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
    case 'coming_soon':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
    default:
      return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
  }
};

const SpecialtyCard = ({
  specialty,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddModule,
  onEditModule
}: SpecialtyCardProps) => {
  const updateSpecialty = useUpdateSpecialty();

  const handleStatusChange = async (newStatus: string) => {
    await updateSpecialty.mutateAsync({
      id: specialty.id,
      updates: { status: newStatus as 'active' | 'inactive' | 'coming_soon' }
    });
  };
  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : iconOptions[0].icon;
  };

  const SpecialtyModulesSection = ({ 
    specialtyId, 
    onAddModule, 
    onEditModule
  }: {
    specialtyId: string;
    onAddModule: () => void;
    onEditModule: (module: Module) => void;
  }) => {
    const { data: modules, isLoading } = useSpecialtyModules(specialtyId);

    if (isLoading) {
      return <div className="text-center py-4 font-armenian">Բեռնում...</div>;
    }

    return (
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 font-armenian">
            <BookOpen className="w-5 h-5" />
            Մոդուլներ ({modules?.length || 0})
          </h3>
          <Button onClick={onAddModule} className="font-armenian">
            <BookOpen className="w-4 h-4 mr-2" />
            Նոր մոդուլ ավելացնել
          </Button>
        </div>
        
        {!modules || modules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground font-armenian">
            Այս մասնագիտությունում դեռ մոդուլներ չկան
          </div>
        ) : (
          <div className="space-y-3">
            {modules.map((module) => (
              <SpecialtyModuleCard
                key={module.id}
                module={module}
                onEdit={onEditModule}
                onAddTopic={() => {}} // Not used anymore, topics are managed internally
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const IconComponent = getIconComponent(specialty.icon);

  return (
    <Card className="group">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover-interactive transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${specialty.color} flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="font-armenian text-xl">{specialty.name}</CardTitle>
                  <p className="text-sm text-muted-foreground font-armenian mt-1">{specialty.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <div className="text-xs text-muted-foreground font-armenian">
                  Հերթ՝ {specialty.order_index}
                </div>
                <Select value={specialty.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-32 h-8 text-xs font-armenian">
                    <SelectValue>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(specialty.status)}`}>
                        {getStatusText(specialty.status)}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active" className="font-armenian">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Ակտիվ
                      </span>
                    </SelectItem>
                    <SelectItem value="inactive" className="font-armenian">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Ոչ ակտիվ
                      </span>
                    </SelectItem>
                    <SelectItem value="coming_soon" className="font-armenian">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                        Շուտով
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(specialty)}
                  className="font-armenian"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Խմբագրել
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onDelete(specialty.id)}
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
            <SpecialtyModulesSection 
              specialtyId={specialty.id}
              onAddModule={() => onAddModule(specialty.id)}
              onEditModule={onEditModule}
            />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default SpecialtyCard;
