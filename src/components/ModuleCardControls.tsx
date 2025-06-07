
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Settings } from 'lucide-react';

interface ModuleCardControlsProps {
  isAdmin: boolean;
  isInstructor: boolean;
  onEdit: () => void;
  onManage: () => void;
  onDelete: () => void;
}

const ModuleCardControls = ({ isAdmin, isInstructor, onEdit, onManage, onDelete }: ModuleCardControlsProps) => {
  if (!isAdmin && !isInstructor) return null;

  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        size="sm"
        variant="outline"
        onClick={onEdit}
        className="w-8 h-8 p-0 bg-background/80 backdrop-blur-sm"
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onManage}
        className="w-8 h-8 p-0 bg-background/80 backdrop-blur-sm"
      >
        <Settings className="w-4 h-4" />
      </Button>
      {isAdmin && (
        <Button
          size="sm"
          variant="outline"
          onClick={onDelete}
          className="w-8 h-8 p-0 bg-background/80 backdrop-blur-sm text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default ModuleCardControls;
