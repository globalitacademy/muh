
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface InstructorFormActionsProps {
  isLoading: boolean;
  onCancel?: () => void;
  submitText: string;
  loadingText: string;
}

const InstructorFormActions: React.FC<InstructorFormActionsProps> = ({
  isLoading,
  onCancel,
  submitText,
  loadingText,
}) => {
  return (
    <div className="flex justify-end gap-3 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="font-armenian"
      >
        Չեղարկել
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
        className="font-armenian btn-modern"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {loadingText}
          </>
        ) : (
          submitText
        )}
      </Button>
    </div>
  );
};

export default InstructorFormActions;
