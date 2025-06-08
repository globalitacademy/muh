
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { UserProfile } from '@/hooks/useAdminUsers';
import EditInstructorForm from './EditInstructorForm';

interface EditInstructorDialogProps {
  instructor: UserProfile;
  onSuccess?: () => void;
}

const EditInstructorDialog: React.FC<EditInstructorDialogProps> = ({
  instructor,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-armenian">Դասախոսի տվյալների խմբագրում</DialogTitle>
        </DialogHeader>
        <EditInstructorForm 
          instructor={instructor}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditInstructorDialog;
