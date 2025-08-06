import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEmployerJobPostings } from '@/hooks/useJobPostings';
import { Calendar, MapPin, Users, Eye, EyeOff, Loader2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
const JobPostingsList = () => {
  const { data: jobPostings, isLoading } = useEmployerJobPostings();

  const [editOpen, setEditOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const [selectedPostingId, setSelectedPostingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    salary_range: '',
    location: '',
    is_remote: false,
    is_active: true,
    expires_at: '' as string | undefined,
  });

  const queryClient = useQueryClient();

  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ['employer-applications-by-posting', selectedPostingId],
    queryFn: async () => {
      if (!selectedPostingId) return [] as any[];
      const { data, error } = await supabase
        .from('job_applications')
        .select(`*,
          profiles:profiles!job_applications_applicant_id_fkey (name, organization)
        `)
        .eq('job_posting_id', selectedPostingId)
        .order('applied_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedPostingId && appsOpen,
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPostingId) throw new Error('No posting selected');
      const { error } = await supabase
        .from('job_postings')
        .update({
          title: form.title,
          description: form.description,
          requirements: form.requirements,
          salary_range: form.salary_range,
          location: form.location,
          is_remote: form.is_remote,
          is_active: form.is_active,
          expires_at: form.expires_at || null,
        })
        .eq('id', selectedPostingId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Առաջարկը թարմացվել է');
      queryClient.invalidateQueries({ queryKey: ['employer-job-postings'] });
      setEditOpen(false);
    },
    onError: () => toast.error('Չհաջողվեց թարմացնել առաջարկը'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('job_postings')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Առաջարկը ջնջվեց');
      queryClient.invalidateQueries({ queryKey: ['employer-job-postings'] });
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
    },
    onError: () => toast.error('Չհաջողվեց ջնջել առաջարկը'),
  });

  const openEdit = (posting: any) => {
    setSelectedPostingId(posting.id);
    setForm({
      title: posting.title || '',
      description: posting.description || '',
      requirements: posting.requirements || '',
      salary_range: posting.salary_range || '',
      location: posting.location || '',
      is_remote: !!posting.is_remote,
      is_active: !!posting.is_active,
      expires_at: posting.expires_at || undefined,
    });
    setEditOpen(true);
  };

  const openApplications = (postingId: string) => {
    setSelectedPostingId(postingId);
    setAppsOpen(true);
  };
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center font-armenian">Բեռնվում է...</div>
        </CardContent>
      </Card>
    );
  }

  if (!jobPostings || jobPostings.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-2">
            <Users className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold font-armenian">Դեռ առաջարկներ չկան</h3>
            <p className="text-muted-foreground font-armenian">
              Ստեղծեք ձեր առաջին առաջարկը ուսանողների հետ կապ հաստատելու համար
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPostingTypeLabel = (type: string) => {
    switch (type) {
      case 'job': return 'Աշխատանք';
      case 'internship': return 'Պրակտիկա';
      case 'project': return 'Նախագիծ';
      default: return type;
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {jobPostings.map((posting) => (
        <Card key={posting.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="font-armenian text-lg">{posting.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-armenian">
                    {getPostingTypeLabel(posting.posting_type)}
                  </Badge>
                  <Badge className={getStatusColor(posting.is_active)}>
                    {posting.is_active ? (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Ակտիվ
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Ապաակտիվ
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {posting.description && (
              <p className="text-muted-foreground line-clamp-2">{posting.description}</p>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {posting.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{posting.location}</span>
                  {posting.is_remote && <span>(Հեռակա)</span>}
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Ստեղծվել է {format(new Date(posting.created_at), 'dd/MM/yyyy')}</span>
              </div>
              
              {posting.expires_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Ծանղավարտ {format(new Date(posting.expires_at), 'dd/MM/yyyy')}</span>
                </div>
              )}
            </div>

            {posting.salary_range && (
              <div className="font-medium text-primary">
                {posting.salary_range}
              </div>
            )}
            
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="font-armenian" onClick={() => openEdit(posting)}>
                Խմբագրել
              </Button>
              <Button variant="outline" size="sm" className="font-armenian" onClick={() => openApplications(posting.id)}>
                Դիմումներ
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="font-armenian">
                    <Trash2 className="w-4 h-4 mr-1" /> Ջնջել
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-armenian">Վստա՞հ եք, որ ցանկանում եք ջնջել</AlertDialogTitle>
                    <AlertDialogDescription className="font-armenian">
                      Այս գործողությունը անդառնալի է։ Առաջարկը և կապված դիմումները չեն ջնջվի, բայց ուսանողները այլևս չեն տեսնի այս առաջարկը:
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="font-armenian">Չեղարկել</AlertDialogCancel>
                    <AlertDialogAction className="font-armenian" onClick={() => deleteMutation.mutate(posting.id)}>
                      {deleteMutation.isPending ? 'Ջնջվում է...' : 'Այո, ջնջել'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-armenian">Առաջարկի խմբագրում</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Վերնագիր</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Նկարագիր</Label>
              <Textarea id="description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="requirements">Պահանջներ</Label>
              <Textarea id="requirements" rows={3} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="salary">Աշխատավարձ</Label>
                <Input id="salary" value={form.salary_range} onChange={(e) => setForm({ ...form, salary_range: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Քաղաք/Տարածք</Label>
                <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="flex items-center gap-2">
                <Switch id="is_remote" checked={form.is_remote} onCheckedChange={(v) => setForm({ ...form, is_remote: v })} />
                <Label htmlFor="is_remote">Հեռակա</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="is_active" checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                <Label htmlFor="is_active">Ակտիվ</Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expires_at">Ժամկետի ավարտ</Label>
                <Input id="expires_at" type="date" value={form.expires_at ? form.expires_at.substring(0,10) : ''} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditOpen(false)} className="font-armenian">Չեղարկել</Button>
              <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending} className="font-armenian">
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Պահպանել
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Applications dialog */}
      <Dialog open={appsOpen} onOpenChange={setAppsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-armenian">Դիմումներ</DialogTitle>
          </DialogHeader>
          {appsLoading ? (
            <div className="py-8 text-center font-armenian">Բեռնվում է...</div>
          ) : !applications || applications.length === 0 ? (
            <div className="py-8 text-center font-armenian">Դիմումներ չկան</div>
          ) : (
            <div className="space-y-4">
              {applications.map((app: any) => (
                <div key={app.id} className="border rounded-lg p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{app.profiles?.name}</div>
                      <div className="text-sm text-muted-foreground">{format(new Date(app.applied_at), 'dd/MM/yyyy')}</div>
                    </div>
                    <Badge variant={
                      app.status === 'pending' ? 'secondary' :
                      app.status === 'accepted' ? 'default' :
                      app.status === 'rejected' ? 'destructive' : 'outline'
                    }>
                      {app.status === 'pending' ? 'Սպասվող' : app.status === 'accepted' ? 'Ընդունված' : app.status === 'rejected' ? 'Մերժված' : 'Դիտված'}
                    </Badge>
                  </div>
                  {app.cover_letter && (
                    <p className="text-sm text-muted-foreground">{app.cover_letter}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobPostingsList;