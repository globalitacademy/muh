
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ModuleCardActionsProps {
  isEnrolled: boolean;
  isPending: boolean;
  onEnroll: () => void;
  onViewModule: () => void;
}

const ModuleCardActions = ({ isEnrolled, isPending, onEnroll, onViewModule }: ModuleCardActionsProps) => {
  return (
    <div className="w-full space-y-2">
      {isEnrolled ? (
        <Button 
          onClick={onViewModule}
          className="w-full btn-modern font-armenian"
        >
          Շարունակել դասընթացը
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <Button 
          onClick={onEnroll}
          disabled={isPending}
          className="w-full btn-modern font-armenian"
        >
          {isPending ? 'Գրանցվում է...' : 'Նկեցի ուսուցում'}
        </Button>
      )}
      {!isEnrolled && (
        <Button 
          variant="outline" 
          onClick={onViewModule}
          className="w-full font-armenian border-border text-foreground hover:bg-accent bg-background/80 backdrop-blur-sm"
        >
          Նկեցի ուսուցում
        </Button>
      )}
    </div>
  );
};

export default ModuleCardActions;
