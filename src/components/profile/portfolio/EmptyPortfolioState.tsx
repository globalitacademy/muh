
import React from 'react';
import { Button } from '@/components/ui/button';
import { FolderOpen, Plus } from 'lucide-react';

interface EmptyPortfolioStateProps {
  onAddFirst: () => void;
}

const EmptyPortfolioState: React.FC<EmptyPortfolioStateProps> = ({ onAddFirst }) => {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-semibold mb-2 font-armenian">Ծրագրեր չեն ավելացվել</h3>
      <p className="text-sm mb-4">Ավելացրեք ձեր ծրագրերը՝ պորտֆոլիոն ցուցադրելու համար</p>
      <Button onClick={onAddFirst} className="font-armenian">
        <Plus className="w-4 h-4 mr-2" />
        Ավելացնել առաջին ծրագիրը
      </Button>
    </div>
  );
};

export default EmptyPortfolioState;
