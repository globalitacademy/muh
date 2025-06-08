
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserProfile } from '@/hooks/useAdminUsers';
import EditInstructorForm from './EditInstructorForm';

interface EditInstructorDialogProps {
  instructor: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditInstructorDialog: React.FC<EditInstructorDialogProps> = ({
  instructor,
  open,
  onOpenChange,
  onSuccess,
}) => {
  if (!instructor) return null;

  const handleSuccess = () => {
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-armenian">Դասախոսի տվյալների խմբագրում</DialogTitle>
        </DialogHeader>
        <EditInstructorForm 
          instructor={instructor}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditInstructorDialog;
