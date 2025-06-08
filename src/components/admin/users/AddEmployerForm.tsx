
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSubmitApplication } from '@/hooks/useUserApplications';
import { toast } from 'sonner';

const employerFormSchema = z.object({
  name: z.string().min(2, 'Անունը պէտք է լինի առնվազն 2 նիշ'),
  email: z.string().email('Անվավեր էլ. փոստի հասցե'),
  phone: z.string().optional(),
  organization: z.string().min(1, 'Ընկերության անունը պարտադիր է'),
  department: z.string().optional(),
});

type EmployerFormValues = z.infer<typeof employerFormSchema>;

interface AddEmployerFormProps {
  onSuccess?: () => void;
}

const AddEmployerForm: React.FC<AddEmployerFormProps> = ({ onSuccess }) => {
  const submitApplication = useSubmitApplication();
  
  const form = useForm<EmployerFormValues>({
    resolver: zodResolver(employerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      organization: '',
      department: '',
    },
  });

  const onSubmit = async (data: EmployerFormValues) => {
    try {
      await submitApplication.mutateAsync({
        ...data,
        role: 'employer',
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting employer application:', error);
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
                  <Input type="email" placeholder="email@company.com" {...field} />
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
                <FormLabel className="font-armenian">Ընկերության անուն *</FormLabel>
                <FormControl>
                  <Input placeholder="Ընկերության անունը" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="font-armenian">Բաժին/Պաշտոն</FormLabel>
                <FormControl>
                  <Input placeholder="HR բաժին, Տնօրեն, ևն" {...field} />
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

export default AddEmployerForm;
