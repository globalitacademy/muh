import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { UserProfile } from '@/hooks/useAdminUsers';
import { cn } from '@/lib/utils';

const editUserSchema = z.object({
  name: z.string().min(1, 'Անունը պարտադիր է'),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  organization: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  field_of_study: z.string().optional(),
  personal_website: z.string().url('Սխալ URL ֆորմատ').optional().or(z.literal('')),
  linkedin_url: z.string().url('Սխալ URL ֆորմատ').optional().or(z.literal('')),
  group_number: z.string().optional(),
  language_preference: z.enum(['hy', 'en', 'ru']),
  is_visible_to_employers: z.boolean(),
  birth_date: z.date().optional(),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile;
  onSuccess?: () => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ open, onOpenChange, user, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      organization: user.organization || '',
      department: user.department || '',
      phone: user.phone || '',
      address: user.address || '',
      bio: user.bio || '',
      field_of_study: user.field_of_study || '',
      personal_website: user.personal_website || '',
      linkedin_url: user.linkedin_url || '',
      group_number: user.group_number || '',
      language_preference: (user.language_preference as 'hy' | 'en' | 'ru') || 'hy',
      is_visible_to_employers: user.is_visible_to_employers || false,
      birth_date: user.birth_date ? new Date(user.birth_date) : undefined,
    },
  });

  const onSubmit = async (data: EditUserFormData) => {
    setIsLoading(true);
    
    try {
      const updateData = {
        name: data.name,
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        organization: data.organization || null,
        department: data.department || null,
        phone: data.phone || null,
        address: data.address || null,
        bio: data.bio || null,
        field_of_study: data.field_of_study || null,
        personal_website: data.personal_website || null,
        linkedin_url: data.linkedin_url || null,
        group_number: data.group_number || null,
        language_preference: data.language_preference,
        is_visible_to_employers: data.is_visible_to_employers,
        birth_date: data.birth_date ? data.birth_date.toISOString().split('T')[0] : null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      // Log the action
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        await supabase
          .from('admin_audit_logs')
          .insert({
            admin_id: currentUser.id,
            target_user_id: user.id,
            action: 'profile_updated',
            details: { 
              updated_fields: Object.keys(updateData),
              user_name: data.name,
              user_role: user.role 
            }
          });
      }

      toast.success('Օգտատիրոջ տվյալները հաջողությամբ թարմացվել են');
      
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminInstructors'] });
      queryClient.invalidateQueries({ queryKey: ['adminStudents'] });
      queryClient.invalidateQueries({ queryKey: ['adminEmployers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-partners'] });
      queryClient.invalidateQueries({ queryKey: ['adminInstructorsWithGroups'] });
      
      onSuccess?.();
      onOpenChange(false);
      
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error('Օգտատիրոջ տվյալների թարմացման սխալ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-armenian">Խմբագրել օգտատիրոջ տվյալները</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-armenian">Անձնական տվյալներ</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-armenian">
                  Անուն *
                </Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  className="font-armenian"
                  disabled={isLoading}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 font-armenian">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="first_name" className="font-armenian">
                  Անուն
                </Label>
                <Input
                  id="first_name"
                  {...form.register('first_name')}
                  className="font-armenian"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="font-armenian">
                  Ազգանուն
                </Label>
                <Input
                  id="last_name"
                  {...form.register('last_name')}
                  className="font-armenian"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="font-armenian">
                  Հեռախոս
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...form.register('phone')}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-armenian">Ծննդյան օր</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.watch('birth_date') && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch('birth_date') ? (
                        format(form.watch('birth_date')!, "dd/MM/yyyy")
                      ) : (
                        <span className="font-armenian">Ընտրել ամսաթիվ</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.watch('birth_date')}
                      onSelect={(date) => form.setValue('birth_date', date)}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language_preference" className="font-armenian">
                  Լեզվի նախընտրություն
                </Label>
                <Select
                  value={form.watch('language_preference')}
                  onValueChange={(value: 'hy' | 'en' | 'ru') => form.setValue('language_preference', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hy" className="font-armenian">Հայերեն</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="font-armenian">
                Հասցե
              </Label>
              <Input
                id="address"
                {...form.register('address')}
                className="font-armenian"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-armenian">Մասնագիտական տվյալներ</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organization" className="font-armenian">
                  Կազմակերպություն
                </Label>
                <Input
                  id="organization"
                  {...form.register('organization')}
                  className="font-armenian"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="font-armenian">
                  Բաժին
                </Label>
                <Input
                  id="department"
                  {...form.register('department')}
                  className="font-armenian"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field_of_study" className="font-armenian">
                  Մասնագիտություն
                </Label>
                <Input
                  id="field_of_study"
                  {...form.register('field_of_study')}
                  className="font-armenian"
                  disabled={isLoading}
                />
              </div>

              {(user.role === 'student' || user.role === 'instructor') && (
                <div className="space-y-2">
                  <Label htmlFor="group_number" className="font-armenian">
                    Խումբ
                  </Label>
                  <Input
                    id="group_number"
                    {...form.register('group_number')}
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Online Presence */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-armenian">Օնլայն ներկայություն</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="personal_website" className="font-armenian">
                  Անձնական կայք
                </Label>
                <Input
                  id="personal_website"
                  type="url"
                  {...form.register('personal_website')}
                  placeholder="https://example.com"
                  disabled={isLoading}
                />
                {form.formState.errors.personal_website && (
                  <p className="text-sm text-red-500 font-armenian">
                    {form.formState.errors.personal_website.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url" className="font-armenian">
                  LinkedIn
                </Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  {...form.register('linkedin_url')}
                  placeholder="https://linkedin.com/in/username"
                  disabled={isLoading}
                />
                {form.formState.errors.linkedin_url && (
                  <p className="text-sm text-red-500 font-armenian">
                    {form.formState.errors.linkedin_url.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-armenian">Կարգավորումներ</h3>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_visible_to_employers"
                checked={form.watch('is_visible_to_employers')}
                onCheckedChange={(checked) => form.setValue('is_visible_to_employers', checked)}
                disabled={isLoading}
              />
              <Label htmlFor="is_visible_to_employers" className="font-armenian">
                Գործատուների համար տեսանելի
              </Label>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-armenian">Կենսագրություն</h3>
            
            <div className="space-y-2">
              <Label htmlFor="bio" className="font-armenian">
                Նկարագրություն
              </Label>
              <Textarea
                id="bio"
                {...form.register('bio')}
                className="font-armenian min-h-[100px]"
                placeholder="Գրեք ձեր մասին..."
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading}
              className="font-armenian"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Պահպանել փոփոխությունները
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="font-armenian"
            >
              Չեղարկել
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;