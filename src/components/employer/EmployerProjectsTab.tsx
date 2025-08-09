import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useMyProjects } from '@/hooks/useProjects';
import { useImageUpload } from '@/hooks/useImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Eye, Edit, Settings, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const EmployerProjectsTab = () => {
  console.log('EmployerProjectsTab loaded successfully');
  const { data: projects = [], isLoading } = useMyProjects();
  const uploader = useImageUpload({ bucket: 'project-files', maxSizeMB: 5 });
  const { user } = useAuth();
  const navigate = useNavigate();


  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [skills, setSkills] = useState('');
  const [deadline, setDeadline] = useState('');
  const [maxApplicants, setMaxApplicants] = useState<number | ''>('');
  const [resources, setResources] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImageUrl(null);
    setCategory('');
    setSkills('');
    setDeadline('');
    setMaxApplicants('');
    setResources('');
    setIsPublic(false);
    setEditingProject(null);
    setIsEditing(false);
  };

  const handleEdit = (project: any) => {
    setTitle(project.title || '');
    setDescription(project.description || '');
    setImageUrl(project.image_url || null);
    setCategory(project.category || '');
    setSkills(project.required_skills ? project.required_skills.join(', ') : '');
    setDeadline(project.application_deadline ? new Date(project.application_deadline).toISOString().split('T')[0] : '');
    setMaxApplicants(project.max_applicants || '');
    setResources(Array.isArray(project.resources) ? project.resources.join('\n') : '');
    setIsPublic(project.is_public || false);
    setEditingProject(project);
    setIsEditing(true);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    const t = title.trim();
    if (!t) return toast({ variant: 'destructive', description: 'Անվանումը պարտադիր է' });
    if (!user) return toast({ variant: 'destructive', description: 'Պետք է մուտք գործել' });

    try {
      setSubmitting(true);
      
      if (isEditing && editingProject) {
        // Update existing project
        const payload = {
          title: t,
          description: description || null,
          is_public: isPublic,
          image_url: imageUrl,
          category: category || null,
          required_skills: skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : null,
          resources: resources ? resources.split('\n').map(r => r.trim()).filter(Boolean) : [],
          application_deadline: deadline ? new Date(deadline).toISOString() : null,
          max_applicants: maxApplicants === '' ? null : Number(maxApplicants),
        };

        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingProject.id);
        
        if (error) throw error;

        toast({ description: 'Նախագիծը թարմացվեց' });
        resetForm();
        window.location.reload();
      } else {
        // Create new project
        const payload = {
          title: t,
          description: description || null,
          start_date: null,
          end_date: null,
          is_public: isPublic,
          image_url: imageUrl,
          category: category || null,
          required_skills: skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : null,
          resources: resources ? resources.split('\n').map(r => r.trim()).filter(Boolean) : [],
          application_deadline: deadline ? new Date(deadline).toISOString() : null,
          max_applicants: maxApplicants === '' ? null : Number(maxApplicants),
          creator_id: user.id,
          creator_role: 'employer',
        } as any;

        const { data, error } = await supabase
          .from('projects')
          .insert(payload)
          .select('*')
          .single();
        if (error) throw error;

        toast({ description: 'Նախագիծը ստեղծվեց' });
        resetForm();
        navigate(`/projects/${data.id}`);
      }
    } catch (e: any) {
      toast({ variant: 'destructive', description: e.message || 'Սխալ է տեղի ունեցել' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      handleEdit(project);
    }
  };

  const handleDeleteProject = async (projectId: string, projectTitle: string) => {
    if (window.confirm(`Վստա՞հ եք, որ ուզում եք ջնել "${projectTitle}" նախագիծը։`)) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectId);
        
        if (error) throw error;
        
        toast({
          title: 'Հաջողություն',
          description: 'Նախագիծը հաջողությամբ ջնվել է',
        });
        
        // Refresh projects list
        window.location.reload();
      } catch (error) {
        toast({
          title: 'Սխալ',
          description: 'Նախագիծը ջնելը չհաջողվեց',
          variant: 'destructive',
        });
      }
    }
  };

  // Debug useEffect to check function availability
  React.useEffect(() => {
    console.log('Component mounted, checking functions:');
    console.log('handleSave exists:', typeof handleSave);
    console.log('resetForm exists:', typeof resetForm);
    console.log('handleEditProject exists:', typeof handleEditProject);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-armenian">
              {isEditing ? `Խմբագրել՝ ${editingProject?.title}` : 'Ստեղծել նոր նախագիծ'}
            </CardTitle>
            {isEditing && (
              <Button variant="outline" onClick={resetForm} className="font-armenian">
                Չեղարկել
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-armenian">Անվանում*</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Օրինակ՝ Վեբ կայքի զարգացում" />
            </div>
            <div className="space-y-2">
              <Label className="font-armenian">Կատեգորիա</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Օր․ Web, AI" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="font-armenian">Նկարագրություն</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Նկարագրեք նախագիծը..." />
            </div>
            <div className="space-y-2">
              <Label className="font-armenian">Հմտություններ (ստորակետերով)</Label>
              <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js" />
            </div>
            <div className="space-y-2">
              <Label className="font-armenian">Դիմումների վերջնաժամկետ</Label>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="font-armenian">Դիմումների սահմանափակում</Label>
              <Input type="number" min={1} value={maxApplicants} onChange={(e) => setMaxApplicants(e.target.value ? Number(e.target.value) : '')} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="font-armenian">Օգտակար ռեսուրսներ (մեկ URL յուրաքանչյուր տողում)</Label>
              <Textarea rows={3} value={resources} onChange={(e) => setResources(e.target.value)} placeholder="https://example.com\nhttps://docs.example.com" />
            </div>
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
                    <Button type="button" variant="outline" onClick={async () => { try { await uploader.deleteImage(imageUrl); setImageUrl(null); } catch {} }}>
                      Հեռացնել
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Public Project Switch */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Switch id="is-public" checked={isPublic} onCheckedChange={setIsPublic} />
                  <Label htmlFor="is-public" className="font-armenian font-medium">Հանրային նախագիծ</Label>
                </div>
                <p className="text-sm text-muted-foreground font-armenian">
                  Նախագիծը կցուցադրվի հիմնական էջում և կլինի մատչելի բոլորին
                </p>
              </div>
            </div>
          </div>

          <Button onClick={handleSave} disabled={submitting} className="font-armenian w-full">
            {submitting ? (isEditing ? 'Պահպանվում է…' : 'Ստեղծվում է…') : (isEditing ? 'Պահպանել փոփոխությունները' : 'Ստեղծել նախագիծ')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Իմ նախագծերը</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground font-armenian">Բեռնվում է...</div>
          ) : projects.length === 0 ? (
            <div className="text-sm text-muted-foreground font-armenian">Դեռևս նախագծեր չկան</div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg hover-interactive">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-semibold font-armenian">{p.title}</h4>
                        <p className="text-sm text-muted-foreground">{p.category || 'Կատեգորիա չկա'} • {new Date(p.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={p.is_public || false} 
                          onCheckedChange={async (checked) => {
                            try {
                              const { error } = await supabase
                                .from('projects')
                                .update({ is_public: checked })
                                .eq('id', p.id);
                              if (error) throw error;
                              toast({ description: checked ? 'Նախագիծը դարձել է հանրային' : 'Նախագիծը դարձել է մասնավոր' });
                              window.location.reload();
                            } catch (error) {
                              toast({ variant: 'destructive', description: 'Փոփոխությունը չհաջողվեց' });
                            }
                          }} 
                        />
                        <Label className="text-sm font-armenian">Հանրային</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="font-armenian" onClick={() => navigate(`/projects/${p.id}`)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Դիտել
                    </Button>
                    <Button size="sm" variant="outline" className="font-armenian" onClick={() => handleEditProject(p.id)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Խմբագրել
                    </Button>
                    <Button size="sm" variant="destructive" className="font-armenian" onClick={() => handleDeleteProject(p.id, p.title)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Ջնել
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerProjectsTab;
