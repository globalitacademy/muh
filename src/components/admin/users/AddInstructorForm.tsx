
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const instructorSchema = z.object({
  email: z.string().email('Վավերացված էլ-փոստ լոտկ է պահանջվում'),
  name: z.string().min(2, 'Անունը պետք է բաղկացած լինի առնվազն 2 նիշից'),
  organization: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  group_number: z.string().optional(),
});

type InstructorFormData = z.infer<typeof instructorSchema>;

interface AddInstructorFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddInstructorForm: React.FC<AddInstructorFormProps> = ({ onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const queryClient = useQueryClient();

  const form = useForm<InstructorFormData>({
    resolver: zodResolver(instructorSchema),
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

  const onSubmit = async (data: InstructorFormData) => {
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
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-edu-blue to-edu-orange rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold font-armenian mb-2">Նոր դասախոս ավելացնել</h3>
        <p className="text-muted-foreground font-armenian">Լրացրեք բոլոր պահանջվող դաշտերը</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-armenian">Էլ-փոստ *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="instructor@example.com"
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
              name="group_number"
              render={({ field }) => (
                <FormItem>
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
                  Ավելացվում է...
                </>
              ) : (
                'Ավելացնել դասախոս'
              )}
            </Button>
          </div>
        </form>
      </Form>

      <div className="text-xs text-muted-foreground text-center font-armenian bg-muted/50 p-3 rounded-lg">
        <strong>Նշում:</strong> Դասախոսը կկստանա ժամանակավոր գաղտնաբառ և պետք է փոխի իր մուտքից հետո
      </div>
    </div>
  );
};

export default AddInstructorForm;
