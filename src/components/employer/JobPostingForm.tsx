import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateJobPosting } from '@/hooks/useJobPostings';
import { Loader2 } from 'lucide-react';

const jobPostingSchema = z.object({
  title: z.string().min(1, 'Անվանումը պարտադիր է'),
  description: z.string().optional(),
  requirements: z.string().optional(),
  salary_range: z.string().optional(),
  location: z.string().optional(),
  is_remote: z.boolean().default(false),
  posting_type: z.enum(['job', 'internship', 'project']).default('job'),
  expires_at: z.string().optional(),
});

type JobPostingFormData = z.infer<typeof jobPostingSchema>;

interface JobPostingFormProps {
  onSuccess?: () => void;
}

const JobPostingForm = ({ onSuccess }: JobPostingFormProps) => {
  const createJobPosting = useCreateJobPosting();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<JobPostingFormData>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      is_remote: false,
      posting_type: 'job',
    },
  });

  const onSubmit = async (data: JobPostingFormData) => {
    try {
      await createJobPosting.mutateAsync({
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        salary_range: data.salary_range,
        location: data.location,
        is_remote: data.is_remote ?? false,
        posting_type: data.posting_type ?? 'job',
        expires_at: data.expires_at,
      });
      onSuccess?.();
    } catch (error) {
      console.error('Error creating job posting:', error);
    }
  };

  const watchedPostingType = watch('posting_type');

  const getPostingTypeLabel = (type: string) => {
    switch (type) {
      case 'job': return 'Աշխատանք';
      case 'internship': return 'Պրակտիկա';
      case 'project': return 'Նախագիծ';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-armenian">Նոր {getPostingTypeLabel(watchedPostingType)} ստեղծել</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="posting_type" className="font-armenian">Տեսակ</Label>
              <Select onValueChange={(value) => setValue('posting_type', value as 'job' | 'internship' | 'project')}>
                <SelectTrigger>
                  <SelectValue placeholder="Ընտրեք տեսակը" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job">Աշխատանք</SelectItem>
                  <SelectItem value="internship">Պրակտիկա</SelectItem>
                  <SelectItem value="project">Նախագիծ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="font-armenian">Անվանում*</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Օրինակ՝ Frontend Developer"
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive font-armenian">{errors.title.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-armenian">Նկարագրություն</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Նկարագրեք առաջարկը մանրամասն..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements" className="font-armenian">Պահանջներ</Label>
            <Textarea
              id="requirements"
              {...register('requirements')}
              placeholder="Նշեք անհրաժեշտ հմտություններն ու պահանջները..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary_range" className="font-armenian">Աշխատավարձ</Label>
              <Input
                id="salary_range"
                {...register('salary_range')}
                placeholder="Օրինակ՝ 500,000 - 800,000 դրամ"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="font-armenian">Գտնվելու վայր</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="Օրինակ՝ Երևան, Կենտրոն"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_remote"
              onCheckedChange={(checked) => setValue('is_remote', checked)}
            />
            <Label htmlFor="is_remote" className="font-armenian">Հեռակա աշխատանք</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires_at" className="font-armenian">Ավարտ ժամկետ</Label>
            <Input
              id="expires_at"
              type="datetime-local"
              {...register('expires_at')}
            />
          </div>

          <Button 
            type="submit" 
            disabled={createJobPosting.isPending}
            className="w-full font-armenian"
          >
            {createJobPosting.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Հրապարակել
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobPostingForm;