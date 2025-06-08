
import React from 'react';
import { Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InstructorFormData } from './instructorSchema';

interface InstructorFormFieldsProps {
  control: Control<InstructorFormData>;
  isLoading: boolean;
  showEmail?: boolean;
}

const InstructorFormFields: React.FC<InstructorFormFieldsProps> = ({ 
  control, 
  isLoading, 
  showEmail = false 
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showEmail && (
          <FormField
            control={control}
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
        )}

        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
        control={control}
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
    </>
  );
};

export default InstructorFormFields;
