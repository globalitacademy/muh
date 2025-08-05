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
  phone: z.string().optional(),
  birth_date: z.date().optional(),
  organization: z.string().optional(),
  department: z.string().optional(),
  personal_website: z.string().url('Սխալ URL ֆորմատ').optional().or(z.literal('')),
  organization_phone: z.string().optional(),
  organization_email: z.string().email('Սխալ էլ․փոստի ֆորմատ').optional().or(z.literal('')),
  address: z.string().optional(),
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
      phone: user.phone || '',
      birth_date: user.birth_date ? new Date(user.birth_date) : undefined,
      organization: user.organization || '',
      department: user.department || '',
      personal_website: user.personal_website || '',
      organization_phone: '', // This would need to be stored separately or in a JSON field
      organization_email: '', // This would need to be stored separately or in a JSON field
      address: user.address || '',
    },
  });

  const onSubmit = async (data: EditUserFormData) => {
    setIsLoading(true);
    
    try {
      const updateData = {
        name: data.name,
        phone: data.phone || null,
        birth_date: data.birth_date ? data.birth_date.toISOString().split('T')[0] : null,
        organization: data.organization || null,
        department: data.department || null,
        personal_website: data.personal_website || null,
        address: data.address || null,
        // Store organization contact info in bio field temporarily (ideally would be separate fields)
        bio: JSON.stringify({
          organization_phone: data.organization_phone || null,
          organization_email: data.organization_email || null,
        }),
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
          {/* Տնօրենի Անձնական տվյալներ */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-armenian">Տնօրենի Անձնական տվյալներ</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-armenian">
                  Անուն Ազգանուն *
                </Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  className="font-armenian"
                  disabled={isLoading}
                  placeholder="Գևորգ Քոսյան"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 font-armenian">
                    {form.formState.errors.name.message}
                  </p>
                )}
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
                  placeholder="+374 XX XX XX XX"
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
            </div>
          </div>

          {/* Կազմակերպության տվյալներ */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-armenian">Կազմակերպության տվյալներ</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organization" className="font-armenian">
                  Կազմակերպության անունը
                </Label>
                <Input
                  id="organization"
                  {...form.register('organization')}
                  className="font-armenian"
                  disabled={isLoading}
                  placeholder="Ընկերության անուն"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="font-armenian">
                  Օգտատիրոջ պաշտոն
                </Label>
                <Input
                  id="department"
                  {...form.register('department')}
                  className="font-armenian"
                  disabled={isLoading}
                  placeholder="Տնօրեն, Բաժնի ղեկավար, և այլն"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personal_website" className="font-armenian">
                  Կազմակերպության վեբ կայք
                </Label>
                <Input
                  id="personal_website"
                  type="url"
                  {...form.register('personal_website')}
                  disabled={isLoading}
                  placeholder="https://company.com"
                />
                {form.formState.errors.personal_website && (
                  <p className="text-sm text-red-500 font-armenian">
                    {form.formState.errors.personal_website.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization_phone" className="font-armenian">
                  Կազմակերպության հեռախոսահամար
                </Label>
                <Input
                  id="organization_phone"
                  type="tel"
                  {...form.register('organization_phone')}
                  disabled={isLoading}
                  placeholder="+374 XX XX XX XX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization_email" className="font-armenian">
                  Կազմակերպության էլ․փոստ
                </Label>
                <Input
                  id="organization_email"
                  type="email"
                  {...form.register('organization_email')}
                  disabled={isLoading}
                  placeholder="info@company.com"
                />
                {form.formState.errors.organization_email && (
                  <p className="text-sm text-red-500 font-armenian">
                    {form.formState.errors.organization_email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="font-armenian">
                  Կազմակերպության հասցե
                </Label>
                <Input
                  id="address"
                  {...form.register('address')}
                  className="font-armenian"
                  disabled={isLoading}
                  placeholder="Երևան, Բաղրամյան 1"
                />
              </div>
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