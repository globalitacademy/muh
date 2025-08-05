import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useCreateAccessCode, useUpdateAccessCode, useAccessCode } from '@/hooks/usePartnerAccessCodes';
import { useModules } from '@/hooks/useModules';

const accessCodeSchema = z.object({
  partner_id: z.string().min(1, 'Գործընկերը պարտադիր է'),
  module_id: z.string().optional(),
  name: z.string().min(1, 'Անվանումը պարտադիր է'),
  description: z.string().optional(),
  expires_at: z.date({
    required_error: 'Ավարտի ամսաթիվը պարտադիր է',
  }),
  activity_duration_minutes: z.number().min(1, 'Տևողությունը պետք է լինի առնվազն 1 րոպե'),
  max_uses: z.number().min(1, 'Օգտագործման քանակը պետք է լինի առնվազն 1'),
});

type AccessCodeFormData = z.infer<typeof accessCodeSchema>;

interface AccessCodeDialogProps {
  mode: 'create' | 'edit' | 'view' | null;
  codeId?: string | null;
  open: boolean;
  onClose: () => void;
}

export const AccessCodeDialog: React.FC<AccessCodeDialogProps> = ({
  mode,
  codeId,
  open,
  onClose,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: accessCode } = useAccessCode(codeId || '');
  const { data: modules = [] } = useModules();
  const createAccessCode = useCreateAccessCode();
  const updateAccessCode = useUpdateAccessCode();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<AccessCodeFormData>({
    resolver: zodResolver(accessCodeSchema),
    defaultValues: {
      activity_duration_minutes: 60,
      max_uses: 1,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  const expiresAt = watch('expires_at');

  useEffect(() => {
    if (mode === 'edit' && accessCode) {
      setValue('partner_id', accessCode.partner_id);
      setValue('module_id', accessCode.module_id || undefined);
      setValue('name', accessCode.name);
      setValue('description', accessCode.description || '');
      setValue('expires_at', new Date(accessCode.expires_at));
      setValue('activity_duration_minutes', accessCode.activity_duration_minutes);
      setValue('max_uses', accessCode.max_uses);
    } else if (mode === 'create') {
      reset({
        activity_duration_minutes: 60,
        max_uses: 1,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    }
  }, [mode, accessCode, setValue, reset]);

  const onSubmit = async (data: AccessCodeFormData) => {
    setIsLoading(true);
    try {
      if (mode === 'create') {
        // Get current user as partner_id - for now we'll use a placeholder
        // In real app, this should come from auth context or be selected
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error('User not authenticated');
        
        await createAccessCode.mutateAsync({
          partner_id: user.user.id, // Use current user as partner
          module_id: data.module_id,
          name: data.name,
          description: data.description,
          expires_at: data.expires_at.toISOString(),
          activity_duration_minutes: data.activity_duration_minutes,
          max_uses: data.max_uses,
        });
        toast({
          title: 'Կոդը ստեղծվել է',
          description: 'Նոր հասանելիության կոդը հաջողությամբ ստեղծվել է։',
        });
      } else if (mode === 'edit' && codeId) {
        await updateAccessCode.mutateAsync({
          id: codeId,
          name: data.name,
          description: data.description,
          expires_at: data.expires_at.toISOString(),
          activity_duration_minutes: data.activity_duration_minutes,
          max_uses: data.max_uses,
        });
        toast({
          title: 'Կոդը թարմացվել է',
          description: 'Հասանելիության կոդը հաջողությամբ թարմացվել է։',
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Սխալ',
        description: 'Գործողությունը չհաջողվեց կատարել։',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Նոր հասանելիության կոդ';
      case 'edit': return 'Խմբագրել կոդը';
      case 'view': return 'Դիտել կոդը';
      default: return '';
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-armenian">{getTitle()}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Partner ID - Hidden for now, will be set based on current user */}
          <input type="hidden" {...register('partner_id')} />

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-armenian">Անվանում *</Label>
              <Input
                id="name"
                {...register('name')}
                disabled={isReadOnly}
                placeholder="Կոդի անվանումը"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="module_id" className="font-armenian">Մոդուլ (ոչ պարտադիր)</Label>
              <Select
                value={watch('module_id') || ''}
                onValueChange={(value) => setValue('module_id', value || undefined)}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ընտրել մոդուլը" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Բոլոր մոդուլները</SelectItem>
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-armenian">Նկարագրություն</Label>
            <Textarea
              id="description"
              {...register('description')}
              disabled={isReadOnly}
              placeholder="Կոդի նկարագրությունը"
              rows={3}
            />
          </div>

          {/* Time Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-armenian">Ավարտի ամսաթիվ *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={isReadOnly}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expiresAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiresAt ? format(expiresAt, "dd MMM yyyy, HH:mm") : "Ընտրել ամսաթիվը"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expiresAt}
                    onSelect={(date) => date && setValue('expires_at', date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              {errors.expires_at && (
                <p className="text-sm text-destructive">{errors.expires_at.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity_duration_minutes" className="font-armenian">
                Գործունեության տևողություն (րոպե) *
              </Label>
              <Input
                id="activity_duration_minutes"
                type="number"
                min="1"
                {...register('activity_duration_minutes', { valueAsNumber: true })}
                disabled={isReadOnly}
                placeholder="60"
              />
              {errors.activity_duration_minutes && (
                <p className="text-sm text-destructive">{errors.activity_duration_minutes.message}</p>
              )}
            </div>
          </div>

          {/* Usage Settings */}
          <div className="space-y-2">
            <Label htmlFor="max_uses" className="font-armenian">
              Առավելագույն օգտագործումներ *
            </Label>
            <Input
              id="max_uses"
              type="number"
              min="1"
              {...register('max_uses', { valueAsNumber: true })}
              disabled={isReadOnly}
              placeholder="1"
            />
            {errors.max_uses && (
              <p className="text-sm text-destructive">{errors.max_uses.message}</p>
            )}
          </div>

          {/* Display current code if editing */}
          {mode === 'edit' && accessCode && (
            <div className="p-4 bg-muted rounded-lg">
              <Label className="font-armenian">Ընթացիկ կոդ</Label>
              <div className="mt-2">
                <code className="bg-background px-3 py-2 rounded border text-lg font-mono">
                  {accessCode.code}
                </code>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Չեղարկել
            </Button>
            {!isReadOnly && (
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'create' ? 'Ստեղծել' : 'Պահպանել'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};