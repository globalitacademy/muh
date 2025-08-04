
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubmitApplication } from '@/hooks/useUserApplications';
import { toast } from 'sonner';

const studentFormSchema = z.object({
  name: z.string().min(2, 'Անունը պէտք է լինի առնվազն 2 նիշ'),
  email: z.string().email('Անվավեր էլ. փոստի հասցե'),
  phone: z.string().optional(),
  organization: z.string().optional(),
  department: z.string().optional(),
  group_number: z.string().min(1, 'Խմբի համարը պարտադիր է'),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface AddStudentFormProps {
  onSuccess?: () => void;
}

const AddStudentForm: React.FC<AddStudentFormProps> = ({ onSuccess }) => {
  const submitApplication = useSubmitApplication();
  
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      organization: '',
      department: '',
      group_number: '',
    },
  });

  const onSubmit = async (data: StudentFormValues) => {
    try {
      await submitApplication.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        organization: data.organization || null,
        department: data.department || null,
        group_number: data.group_number || null,
        role: 'student',
        status: 'pending',
        application_type: 'manual',
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting student application:', error);
      toast.error('Դիմումի ուղարկման սխալ');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-armenian">Լրիվ անուն *</FormLabel>
                <FormControl>
                  <Input placeholder="Անուն Ազգանուն" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-armenian">Էլ. փոստ *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
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
                  <Input placeholder="+374 XX XXX XXX" {...field} />
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
                  <Input placeholder="Ուսումնական հաստատություն" {...field} />
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
                  <Input placeholder="Ծրագրային ինժեներություն" {...field} />
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
                <FormLabel className="font-armenian">Խմբի համար *</FormLabel>
                <FormControl>
                  <Input placeholder="Օր. ՏՏ-301" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={submitApplication.isPending}
            className="font-armenian"
          >
            {submitApplication.isPending ? 'Ուղարկվում է...' : 'Ուղարկել դիմումը'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddStudentForm;
