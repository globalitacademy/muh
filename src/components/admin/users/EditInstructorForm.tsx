
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { UserProfile } from '@/hooks/useAdminUsers';
import { instructorSchema, InstructorFormData } from './shared/instructorSchema';
import InstructorFormFields from './shared/InstructorFormFields';
import InstructorFormHeader from './shared/InstructorFormHeader';
import EnhancedRichTextEditor from '@/components/ui/enhanced-rich-text-editor';

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-armenian">Անուն Ազգանուն</FormLabel>
                  <FormControl>
                    <Input placeholder="Մուտքագրեք անունը և ազգանունը" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-armenian">Հեռախոս</FormLabel>
                  <FormControl>
                    <Input placeholder="+374 XX XXX XXX" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-armenian">Կազմակերպություն</FormLabel>
                  <FormControl>
                    <Input placeholder="Մուտքագրեք կազմակերպությունը" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-armenian">Ամբիոն/Բաժին</FormLabel>
                  <FormControl>
                    <Input placeholder="Մուտքագրեք ամբիոնը կամ բաժինը" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="group_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-armenian">Խմբի համար</FormLabel>
                <FormControl>
                  <Input placeholder="Մուտքագրեք խմբի համարը" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-armenian">Կենսագրություն</FormLabel>
                <FormControl>
                  <EnhancedRichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Մուտքագրեք դասախոսի կենսագրությունը..."
                    height={200}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="font-armenian">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Թարմացնել տվյալները
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="font-armenian">
                Չեղարկել
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditInstructorForm;
