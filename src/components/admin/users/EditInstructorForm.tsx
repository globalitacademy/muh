
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { UserProfile } from '@/hooks/useAdminUsers';
import { instructorSchema, InstructorFormData } from './shared/instructorSchema';
import InstructorFormFields from './shared/InstructorFormFields';
import InstructorFormHeader from './shared/InstructorFormHeader';
import InstructorFormActions from './shared/InstructorFormActions';

interface EditInstructorFormProps {
  instructor: UserProfile;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditInstructorForm: React.FC<EditInstructorFormProps> = ({ instructor, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const queryClient = useQueryClient();

  const form = useForm<InstructorFormData>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      name: instructor.name || '',
      organization: instructor.organization || '',
      department: instructor.department || '',
      phone: instructor.phone || '',
      bio: instructor.bio || '',
      group_number: instructor.group_number || '',
    },
  });

  const onSubmit = async (data: InstructorFormData) => {
    setIsLoading(true);
    
    try {
      // Update the profile with new information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          organization: data.organization || null,
          department: data.department || null,
          phone: data.phone || null,
          bio: data.bio || null,
          group_number: data.group_number || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', instructor.id);

      if (profileError) {
        throw profileError;
      }

      toast.success('Դասախոսի տվյալները հաջողությամբ թարմացվել են');
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      
      onSuccess?.();
      
    } catch (error: any) {
      console.error('Error updating instructor:', error);
      
      let errorMessage = 'Դասախոսի տվյալների թարմացման սխալ';
      
      if (error.message?.includes('duplicate key')) {
        errorMessage = 'Այս տվյալները արդեն գոյություն ունեն';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <InstructorFormHeader
        instructor={instructor}
        title="Դասախոսի տվյալների խմբագրում"
        subtitle="Փոփոխեք անհրաժեշտ դաշտերը"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <InstructorFormFields
            control={form.control}
            isLoading={isLoading}
            showEmail={false}
          />

          <InstructorFormActions
            isLoading={isLoading}
            onCancel={onCancel}
            submitText="Թարմացնել տվյալները"
            loadingText="Թարմացվում է..."
          />
        </form>
      </Form>
    </div>
  );
};

export default EditInstructorForm;
