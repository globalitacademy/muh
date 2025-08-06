import React, { useState } from 'react';
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
import { useImageUpload } from '@/hooks/useImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

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
  const { user } = useAuth();
  const uploader = useImageUpload({ bucket: 'project-files', maxSizeMB: 5 });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");
  const [maxApplicants, setMaxApplicants] = useState<number | "">("");
  const [resourcesText, setResourcesText] = useState("");
  
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<JobPostingFormData>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      is_remote: false,
      posting_type: 'job',
    },
  });

  const onSubmit = async (data: JobPostingFormData) => {
    try {
      const jp = await createJobPosting.mutateAsync({
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        salary_range: data.salary_range,
        location: data.location,
        is_remote: data.is_remote ?? false,
        posting_type: data.posting_type ?? 'job',
        expires_at: data.expires_at,
      });

      // If it's a project, create a linked Project as well
      if (data.posting_type === 'project') {
        if (!user) throw new Error('Not authenticated');
        const { error: perr } = await supabase
          .from('projects')
          .insert({
            title: data.title,
            description: data.description || null,
            start_date: null,
            end_date: null,
            is_public: false,
            creator_id: user.id,
            creator_role: 'employer',
            image_url: imageUrl,
            category: category || null,
            required_skills: skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : null,
            application_deadline: projectDeadline ? new Date(projectDeadline).toISOString() : null,
            max_applicants: maxApplicants === '' ? null : Number(maxApplicants),
            resources: resourcesText ? resourcesText.split('\n').map(r => r.trim()).filter(Boolean) : [],
          });
        if (perr) throw perr;
      }

      toast({ description: 'Հրապարակումը ստեղծվեց' });
      reset();
      setImageUrl(null); setCategory(''); setSkills(''); setProjectDeadline(''); setMaxApplicants(''); setResourcesText('');
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating job posting/project:', error);
      toast({ variant: 'destructive', description: error.message || 'Սխալ է տեղի ունեցել' });
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

          {watchedPostingType === 'project' && (
            <div className="space-y-4 border rounded-lg p-4">
              <p className="font-medium font-armenian">Նախագծի պարամետրեր</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label className="font-armenian">Նախագծի նկար</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-40 h-24 rounded-md overflow-hidden bg-muted">
                      {imageUrl ? (
                        <img src={imageUrl} alt="Project cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Չկա նկար</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input type="file" accept="image/*" onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        try {
                          const url = await uploader.uploadImage(f, `project-cover-${Date.now()}`);
                          if (url) setImageUrl(url);
                        } catch (err: any) {
                          toast({ variant: 'destructive', description: err.message || 'Նկարի վերբեռնումը ձախողվեց' });
                        }
                      }} />
                      {imageUrl && (
                        <Button type="button" variant="outline" onClick={async () => {
                          try { await uploader.deleteImage(imageUrl); setImageUrl(null); } catch {}
                        }}>Հեռացնել</Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-armenian">Կատեգորիա</Label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Օր․ Web, AI, Marketing" />
                </div>
                <div className="space-y-2">
                  <Label className="font-armenian">Հմտություններ (ստորակետերով)</Label>
                  <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js, SQL" />
                </div>
                <div className="space-y-2">
                  <Label className="font-armenian">Դիմումների վերջնաժամկետ</Label>
                  <Input type="date" value={projectDeadline} onChange={(e) => setProjectDeadline(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="font-armenian">Դիմումների սահմանափակում</Label>
                  <Input type="number" min={1} value={maxApplicants} onChange={(e) => setMaxApplicants(e.target.value ? Number(e.target.value) : '')} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="font-armenian">Օգտակար ռեսուրսներ (մեկ URL յուրաքանչյուր տողում)</Label>
                  <Textarea rows={3} value={resourcesText} onChange={(e) => setResourcesText(e.target.value)} placeholder="https://example.com\nhttps://docs.example.com" />
                </div>
              </div>
            </div>
          )}


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