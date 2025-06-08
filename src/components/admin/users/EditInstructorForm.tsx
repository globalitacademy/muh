
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { UserProfile } from '@/hooks/useAdminUsers';

const instructorSchema = z.object({
  name: z.string().min(2, 'Անունը պետք է բաղկացած լինի առնվազն 2 նիշից'),
  organization: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  group_number: z.string().optional(),
});

type InstructorFormData = z.infer<typeof instructorSchema>;

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
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-edu-blue to-edu-orange rounded-full flex items-center justify-center mx-auto mb-4">
          {instructor.avatar_url ? (
            <img 
              src={instructor.avatar_url} 
              alt={instructor.name || 'Instructor'} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-white" />
          )}
        </div>
        <h3 className="text-xl font-bold font-armenian mb-2">Դասախոսի տվյալների խմբագրում</h3>
        <p className="text-muted-foreground font-armenian">Փոփոխեք անհրաժեշտ դաշտերը</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-armenian">Անուն Ազգանուն *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Անուն Ազգանուն"
                      {...field}
                      disabled={isLoading}
                    />
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
                    <Input
                      placeholder="+374 XX XXX XXX"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-armenian">Կազմակերպություն</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Կազմակերպության անվանումը"
                      {...field}
                      disabled={isLoading}
                    />
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
                  <FormLabel className="font-armenian">Բաժին</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Բաժնի անվանումը"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="group_number"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="font-armenian">Խումբ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Խմբի համարը"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-armenian">Կենսագրություն</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Դասախոսի մասին կարճ տեղեկություն..."
                    className="min-h-[100px]"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  Թարմացվում է...
                </>
              ) : (
                'Թարմացնել տվյալները'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditInstructorForm;
