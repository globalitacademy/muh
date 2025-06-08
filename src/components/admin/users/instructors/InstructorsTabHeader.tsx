
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import AddInstructorForm from '../AddInstructorForm';

interface InstructorsTabHeaderProps {
  instructorsCount: number;
  showAddDialog: boolean;
  setShowAddDialog: (show: boolean) => void;
  onRefetch: () => void;
}

const InstructorsTabHeader: React.FC<InstructorsTabHeaderProps> = ({
  instructorsCount,
  showAddDialog,
  setShowAddDialog,
  onRefetch,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold font-armenian">Դասախոսներ</h3>
        <p className="text-sm text-muted-foreground font-armenian">
          Ընդհանուր {instructorsCount} դասախոս
        </p>
      </div>
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogTrigger asChild>
          <Button className="font-armenian">
            <Plus className="w-4 h-4 mr-2" />
            Ավելացնել դասախոս
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-armenian">Նոր դասախոս ավելացնել</DialogTitle>
          </DialogHeader>
          <AddInstructorForm 
            onSuccess={() => {
              setShowAddDialog(false);
              onRefetch();
            }}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructorsTabHeader;
