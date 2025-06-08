
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { addInstructorSchema, AddInstructorFormData } from './shared/instructorSchema';
import InstructorFormFields from './shared/InstructorFormFields';
import InstructorFormHeader from './shared/InstructorFormHeader';
import InstructorFormActions from './shared/InstructorFormActions';

interface AddInstructorFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddInstructorForm: React.FC<AddInstructorFormProps> = ({ onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const queryClient = useQueryClient();

  const form = useForm<AddInstructorFormData>({
    resolver: zodResolver(addInstructorSchema),
    defaultValues: {
      email: '',
      name: '',
      organization: '',
      department: '',
      phone: '',
      bio: '',
      group_number: '',
    },
  });

  const onSubmit = async (data: AddInstructorFormData) => {
    setIsLoading(true);
    
    try {
      // First, create the user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: 'TempPassword123!', // Temporary password, user will reset
        email_confirm: true,
        user_metadata: {
          name: data.name,
          role: 'instructor',
        },
      });

      if (authError) {
        throw authError;
      }

      // Update the profile with additional information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          role: 'instructor',
          organization: data.organization || null,
          department: data.department || null,
          phone: data.phone || null,
          bio: data.bio || null,
          group_number: data.group_number || null,
        })
        .eq('id', authData.user.id);

      if (profileError) {
        throw profileError;
      }

      // Add instructor role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'instructor',
        });

      if (roleError) {
        throw roleError;
      }

      toast.success('Դասախոսը հաջողությամբ ավելացվել է');
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      
      form.reset();
      onSuccess?.();
      
    } catch (error: any) {
      console.error('Error creating instructor:', error);
      
      let errorMessage = 'Դասախոս ավելացնելիս սխալ տեղի ունեցավ';
      
      if (error.message?.includes('duplicate key')) {
        errorMessage = 'Այս էլ-փոստով օգտատեր արդեն գոյություն ունի';
      } else if (error.message?.includes('invalid email')) {
        errorMessage = 'Էլ-փոստի հասցեն վավեր չէ';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <InstructorFormHeader
        title="Նոր դասախոս ավելացնել"
        subtitle="Լրացրեք բոլոր պահանջվող դաշտերը"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <InstructorFormFields
            control={form.control}
            isLoading={isLoading}
            showEmail={true}
          />

          <InstructorFormActions
            isLoading={isLoading}
            onCancel={onCancel}
            submitText="Ավելացնել դասախոս"
            loadingText="Ավելացվում է..."
          />
        </form>
      </Form>

      <div className="text-xs text-muted-foreground text-center font-armenian bg-muted/50 p-3 rounded-lg">
        <strong>Նշում:</strong> Դասախոսը կկստանա ժամանակավոր գաղտնաբառ և պետք է փոխի իր մուտքից հետո
      </div>
    </div>
  );
};

export default AddInstructorForm;
