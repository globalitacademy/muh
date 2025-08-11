import React, { useMemo, useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams } from "react-router-dom";
import { useProject, useUpdateProject } from "@/hooks/useProjects";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useProjectSteps } from "@/hooks/useProjectSteps";
import { useProjectDiscussions } from "@/hooks/useProjectDiscussions";
import { useProjectFiles } from "@/hooks/useProjectFiles";
import { useProjectEvaluations } from "@/hooks/useProjectEvaluations";
import { useProjectTimeline } from "@/hooks/useProjectTimeline";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Image, Clock, CheckCircle } from "lucide-react";
import { useProjectApplications } from "@/hooks/useProjectApplications";
import { Textarea } from "@/components/ui/textarea";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";

const ExpandableText: React.FC<{ text: string }> = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > 250; // approximately 5 lines

  return (
    <div className="text-left">
      <p className="mt-1">
        {shouldTruncate && !isExpanded ? `${text.slice(0, 250)}...` : text}
      </p>
      {shouldTruncate && (
        <Button
          variant="link"
          className="h-auto p-0 text-primary"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Ցույց տալ ավելի քիչ' : 'Ցույց տալ ավելին'}
        </Button>
      )}
    </div>
  );
};

const Section: React.FC<{
  title: string;
  children?: React.ReactNode;
}> = ({
  title,
  children
}) => <Card className="mb-6">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {children || <p className="text-muted-foreground">Coming soon…</p>}
    </CardContent>
  </Card>;

// Project Application Button Component
const ProjectApplicationButton: React.FC<{
  user: any;
  project: any;
  applications: any[] | undefined;
  apply: any;
}> = ({ user, project, applications, apply }) => {
  // Check if user has already applied
  const userApplication = applications?.find(app => app.applicant_id === user?.id);
  
  // Determine button state
  const isApplied = !!userApplication;
  const isExpired = project.application_deadline && new Date(project.application_deadline) < new Date();
  const isMaxReached = typeof project.max_applicants === 'number' && (applications?.length || 0) >= project.max_applicants;
  
  // Determine button text and style based on application status
  const getButtonState = () => {
    if (!isApplied) {
      return {
        text: 'Դիմել նախագծին',
        variant: 'default' as const,
        disabled: apply.isPending || isMaxReached || isExpired,
        icon: null
      };
    }
    
    switch (userApplication?.status) {
      case 'pending':
        return {
          text: 'Սպասում է հաստատման',
          variant: 'secondary' as const,
          disabled: true,
          icon: <Clock className="w-4 h-4 mr-2" />
        };
      case 'approved':
        return {
          text: 'Հաստատված',
          variant: 'outline' as const,
          disabled: true,
          icon: <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
        };
      case 'rejected':
        return {
          text: 'Մերժված',
          variant: 'destructive' as const,
          disabled: true,
          icon: null
        };
      default:
        return {
          text: 'Դիմել նախագծին',
          variant: 'default' as const,
          disabled: apply.isPending || isMaxReached || isExpired,
          icon: null
        };
    }
  };
  
  const buttonState = getButtonState();
  
  const handleApply = async () => {
    if (isApplied) return;
    
    try {
      await apply.mutateAsync(undefined);
      toast({
        description: 'Դիմումն ուղարկված է և սպասում է հաստատման'
      });
    } catch (e: any) {
      toast({
        variant: 'destructive',
        description: e.message || 'Չհաջողվեց ուղարկել'
      });
    }
  };
  
  return (
    <Button
      onClick={handleApply}
      disabled={buttonState.disabled}
      variant={buttonState.variant}
      className="w-full min-h-[40px] flex items-center justify-center"
    >
      {buttonState.icon}
      {buttonState.text}
    </Button>
  );
};

const statusOptions = [{
  value: "todo",
  label: "To do"
}, {
  value: "in_progress",
  label: "In progress"
}, {
  value: "done",
  label: "Done"
}, {
  value: "blocked",
  label: "Blocked"
}] as const;

const StepsTab: React.FC<{
  projectId: string;
  canEdit: boolean;
}> = ({
  projectId,
  canEdit
}) => {
  const {
    data: steps,
    create,
    update,
    remove,
    isLoading
  } = useProjectSteps(projectId);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<typeof statusOptions[number]["value"]>("todo");
  const onAdd = async () => {
    const t = title.trim();
    if (!t) return toast({
      variant: 'destructive',
      description: 'Title is required'
    });
    try {
      await create.mutateAsync({
        title: t,
        status
      });
      setTitle("");
      setStatus("todo");
    } catch (e: any) {
      toast({
        variant: 'destructive',
        description: e.message || "Failed to add step"
      });
    }
  };
  return <Section title="Քայլեր">
      {canEdit && (
        <div className="grid gap-3 md:grid-cols-4 items-end mb-4">
          <div className="md:col-span-2">
            <Label htmlFor="new-step">Նոր քայլ</Label>
            <Input 
              id="new-step"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Մուտքագրեք քայլի վերնագիրը"
            />
          </div>
          <div>
            <Label>Կարգավիճակ</Label>
            <Select value={status} onValueChange={v => setStatus(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Ընտրեք կարգավիճակը" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Կատարելի</SelectItem>
                <SelectItem value="in_progress">Ընթացքի մեջ</SelectItem>
                <SelectItem value="done">Կատարված</SelectItem>
                <SelectItem value="blocked">Արգելափակված</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button onClick={onAdd} disabled={create.isPending}>Ավելացնել</Button>
          </div>
        </div>
      )}

      {isLoading ? <p>Loading…</p> : !steps?.length ? <p className="text-muted-foreground">No steps yet.</p> : <div className="space-y-3">
          {steps.map(s => <Card key={s.id}>
              <CardContent className="pt-4 grid gap-3 md:grid-cols-6 items-center">
                <div className="md:col-span-3 font-medium">{s.title}</div>
                <div className="md:col-span-2">
                  {canEdit ? (
                    <Select value={s.status} onValueChange={v => update.mutate({
                      id: s.id,
                      status: v as any
                    })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="capitalize">{s.status.replace('_', ' ')}</span>
                  )}
                </div>
                <div className="text-right">
                  {canEdit && (
                    <Button variant="outline" onClick={() => remove.mutate(s.id)}>Delete</Button>
                  )}
                </div>
              </CardContent>
            </Card>)}
        </div>}
    </Section>;
};

const DiscussionsTab: React.FC<{
  projectId: string;
  canEdit: boolean;
}> = ({
  projectId,
  canEdit
}) => {
  const {
    data: messages,
    create,
    remove,
    isLoading
  } = useProjectDiscussions(projectId);
  const [content, setContent] = useState("");
  const onSend = async () => {
    const c = content.trim();
    if (!c) return;
    try {
      await create.mutateAsync({
        content: c
      });
      setContent("");
    } catch (e: any) {
      toast({
        variant: 'destructive',
        description: e.message || "Failed to post"
      });
    }
  };
  return <Section title="Քննարկումներ">
      {canEdit && (
        <div className="grid gap-3 md:grid-cols-6 items-end mb-4">
          <div className="md:col-span-5">
            <Label htmlFor="msg">Message</Label>
            <Input id="msg" placeholder="Write a message…" value={content} onChange={e => setContent(e.target.value)} />
          </div>
          <div>
            <Button onClick={onSend} disabled={create.isPending}>Send</Button>
          </div>
        </div>
      )}

      {isLoading ? <p>Loading…</p> : !messages?.length ? <p className="text-muted-foreground">No messages yet.</p> : <div className="space-y-3">
          {messages.map(m => <Card key={m.id}>
              <CardContent className="pt-4 flex items-start justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
                  <div className="mt-1">{m.content}</div>
                </div>
                {canEdit && (
                  <Button variant="outline" onClick={() => remove.mutate(m.id)}>Delete</Button>
                )}
              </CardContent>
            </Card>)}
        </div>}
    </Section>;
};

const FilesTab: React.FC<{
  projectId: string;
  canEdit: boolean;
}> = ({
  projectId,
  canEdit
}) => {
  const {
    data: files,
    upload,
    togglePublic,
    remove,
    isLoading
  } = useProjectFiles(projectId);
  const [file, setFile] = useState<File | null>(null);
  const onUpload = async () => {
    if (!file) return;
    try {
      await upload.mutateAsync(file);
      setFile(null);
      toast({
        description: "Uploaded"
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        description: e.message || "Upload failed"
      });
    }
  };
  const getPublicUrl = (file_path: string) => supabase.storage.from("project-files").getPublicUrl(file_path).data.publicUrl;
  return <Section title="Ֆայլեր">
      {canEdit && (
        <div className="grid gap-3 md:grid-cols-6 items-end mb-4">
          <div className="md:col-span-5">
            <Label htmlFor="file">Add file</Label>
            <Input id="file" type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
          </div>
          <div>
            <Button onClick={onUpload} disabled={upload.isPending || !file}>Upload</Button>
          </div>
        </div>
      )}

      {isLoading ? <p>Loading…</p> : !files?.length ? <p className="text-muted-foreground">No files yet.</p> : <div className="space-y-3">
          {files.map(f => <Card key={f.id}>
              <CardContent className="pt-4 grid gap-3 md:grid-cols-6 items-center">
                <div className="md:col-span-3">
                  <div className="font-medium">{f.name}</div>
                  <a className="text-sm text-primary underline" href={getPublicUrl(f.file_path)} target="_blank" rel="noreferrer">Open</a>
                </div>
                <div className="md:col-span-2 flex items-center gap-2">
                  {canEdit ? (
                    <>
                      <Switch checked={f.is_public} onCheckedChange={v => togglePublic.mutate({
                        id: f.id,
                        is_public: v
                      })} />
                      <span className="text-sm">Public</span>
                    </>
                  ) : (
                    <span className="text-sm">{f.is_public ? 'Public' : 'Private'}</span>
                  )}
                </div>
                <div className="text-right">
                  {canEdit && (
                    <Button variant="outline" onClick={() => remove.mutate(f)}>Delete</Button>
                  )}
                </div>
              </CardContent>
            </Card>)}
        </div>}
    </Section>;
};

const EvaluationTab: React.FC<{
  projectId: string;
  canEdit: boolean;
}> = ({
  projectId,
  canEdit
}) => {
  const {
    data: evals,
    create,
    remove,
    isLoading
  } = useProjectEvaluations(projectId);
  const [score, setScore] = useState(0);
  const [subjectUser, setSubjectUser] = useState("");
  const [subjectTeam, setSubjectTeam] = useState("");
  const [comments, setComments] = useState("");
  const onAdd = async () => {
    if (!score) return toast({
      variant: 'destructive',
      description: 'Score is required'
    });
    try {
      await create.mutateAsync({
        score,
        subject_user_id: subjectUser || null,
        subject_team: subjectTeam || null,
        comments
      });
      setScore(0);
      setSubjectUser("");
      setSubjectTeam("");
      setComments("");
    } catch (e: any) {
      toast({
        variant: 'destructive',
        description: e.message || "Failed to evaluate"
      });
    }
  };
  return <Section title="Գնահատական">
      {canEdit && (
        <div className="grid gap-3 md:grid-cols-6 mb-4">
          <div>
            <Label htmlFor="score">Score</Label>
            <Input id="score" type="number" value={score} onChange={e => setScore(Number(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="user">Student ID (optional)</Label>
            <Input id="user" value={subjectUser} onChange={e => setSubjectUser(e.target.value)} placeholder="UUID" />
          </div>
          <div>
            <Label htmlFor="team">Team (optional)</Label>
            <Input id="team" value={subjectTeam} onChange={e => setSubjectTeam(e.target.value)} placeholder="Team name/code" />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="comments">Comments</Label>
            <Input id="comments" value={comments} onChange={e => setComments(e.target.value)} placeholder="Notes" />
          </div>
          <div className="flex items-end"><Button onClick={onAdd} disabled={create.isPending}>Save</Button></div>
        </div>
      )}

      {isLoading ? <p>Loading…</p> : !evals?.length ? <p className="text-muted-foreground">No evaluations yet.</p> : <div className="space-y-3">
          {evals.map(ev => <Card key={ev.id}>
              <CardContent className="pt-4 grid md:grid-cols-6 items-center gap-3">
                <div className="md:col-span-2 font-medium">Score: {ev.score}</div>
                <div className="md:col-span-3 text-sm text-muted-foreground">{ev.comments}</div>
                <div className="text-right">
                  {canEdit && (
                    <Button variant="outline" onClick={() => remove.mutate(ev.id)}>Delete</Button>
                  )}
                </div>
              </CardContent>
            </Card>)}
        </div>}
    </Section>;
};

const TimelineTab: React.FC<{
  projectId: string;
  canEdit: boolean;
}> = ({
  projectId,
  canEdit
}) => {
  const {
    data: events,
    add,
    isLoading
  } = useProjectTimeline(projectId);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("note");
  const [description, setDescription] = useState("");
  const onAdd = async () => {
    const t = title.trim();
    if (!t) return toast({
      variant: 'destructive',
      description: 'Title required'
    });
    try {
      await add.mutateAsync({
        title: t,
        type,
        description
      });
      setTitle("");
      setDescription("");
      setType("note");
    } catch (e: any) {
      toast({
        variant: 'destructive',
        description: e.message || "Failed to add event"
      });
    }
  };
  return <Section title="Թայմլայն">
      {canEdit && (
        <div className="grid gap-3 md:grid-cols-6 items-end mb-4">
          <div>
            <Label>Type</Label>
            <Input value={type} onChange={e => setType(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <Button onClick={onAdd} disabled={add.isPending}>Add</Button>
          </div>
        </div>
      )}

      {isLoading ? <p>Loading…</p> : !events?.length ? <p className="text-muted-foreground">No events yet.</p> : <div className="space-y-3">
          {events.map(ev => <Card key={ev.id}>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">{new Date(ev.event_date).toLocaleString()} • {ev.type}</div>
                <div className="font-medium">{ev.title}</div>
                {ev.description && <div className="text-sm">{ev.description}</div>}
              </CardContent>
            </Card>)}
        </div>}
    </Section>;
};

const ProjectDetail: React.FC = () => {
  const {
    id
  } = useParams();
  const projectId = useMemo(() => id as string, [id]);
  const {
    data: project,
    isLoading
  } = useProject(projectId);
  const {
    data: applications,
    apply,
    updateStatus
  } = useProjectApplications(projectId);
  const updateProject = useUpdateProject();
  const { data: userRole } = useUserRole();
  const { user } = useAuth();
  
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [editedProject, setEditedProject] = useState<Partial<typeof project>>({});

  // Check if current user can edit this project
  const canEdit = user && (user.id === project?.creator_id || userRole === 'admin');

  return (
    <div className="page-container">
      <Header />
      <main className="container mx-auto py-8">
        {isLoading ? (
          <p>Loading…</p>
        ) : !project ? (
          <p className="text-muted-foreground">Project not found</p>
        ) : (
          <>
            <header className="mb-6">
              <div className="flex justify-end mb-4">
                {canEdit && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (isEditingDescription) {
                        updateProject.mutate({ id: projectId, ...editedProject });
                        setIsEditingDescription(false);
                      } else {
                        setEditedProject(project || {});
                        setIsEditingDescription(true);
                      }
                    }}
                  >
                    {isEditingDescription ? 'Պահպանել' : 'Խմբագրել'}
                  </Button>
                )}
              </div>
              
              {project.image_url && (
                <div className="mb-6 relative">
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium shadow-lg">
                    {project.posting_type === 'practice' ? 'Պրակտիկա' : 
                     project.posting_type === 'job' ? 'Աշխատանք' : 'Նախագիծ'}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-left">{project.title}</h1>
              </div>
            </header>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-1">
                <TabsTrigger value="overview">Նկարագրություն</TabsTrigger>
                <TabsTrigger value="steps">Քայլեր</TabsTrigger>
                <TabsTrigger value="discussions">Քննարկումներ</TabsTrigger>
                <TabsTrigger value="files">Ֆայլեր</TabsTrigger>
                <TabsTrigger value="timeline">Թայմլայն</TabsTrigger>
                <TabsTrigger value="evaluation">Գնահատական</TabsTrigger>
              </TabsList>

                <TabsContent value="overview">
                <Section title="Նախագիծ">
                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                      <div className="mb-4">
                        <div className="text-sm text-muted-foreground mb-2">Նկարագրություն</div>
                        {isEditingDescription && !isPreviewMode ? (
                          <Textarea
                            value={editedProject.description || project.description || ''}
                            onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
                            className="min-h-[150px]"
                            placeholder="Նախագծի նկարագրություն..."
                          />
                        ) : (
                          <ExpandableText text={project.description || 'Նկարագրություն չի ավելացվել'} />
                        )}
                      </div>
                      
                      {(project.required_skills && project.required_skills.length > 0) || (isEditingDescription && !isPreviewMode) ? (
                        <div className="mb-4">
                          <div className="text-sm text-muted-foreground mb-2">Անհրաժեշտ հմտություններ</div>
                          {isEditingDescription && !isPreviewMode ? (
                            <Input
                              value={(editedProject.required_skills || project.required_skills || []).join(', ')}
                              onChange={(e) => setEditedProject({
                                ...editedProject, 
                                required_skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                              })}
                              placeholder="Մուտքագրեք հմտությունները ստորակետով բաժանված..."
                            />
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {(project.required_skills || []).map((skill, index) => (
                                <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : null}

                      {(project.useful_links && project.useful_links.length > 0) || (isEditingDescription && !isPreviewMode) ? (
                        <div className="mb-4">
                          <div className="text-sm text-muted-foreground mb-2">Օգտակար հղումներ</div>
                          {isEditingDescription && !isPreviewMode ? (
                            <Textarea
                              value={(editedProject.useful_links || project.useful_links || []).join('\n')}
                              onChange={(e) => setEditedProject({
                                ...editedProject, 
                                useful_links: e.target.value.split('\n').map(link => link.trim()).filter(link => link)
                              })}
                              placeholder="Մուտքագրեք հղումները (յուրաքանչյուրը նոր տողում)..."
                              className="min-h-[100px]"
                            />
                          ) : (
                            <div className="space-y-2">
                              {(project.useful_links || []).map((link, index) => (
                                <div key={index}>
                                  <a 
                                    href={link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline break-all"
                                  >
                                    {link}
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : null}

                    </div>

                    <aside className="space-y-4">
                       <div>
                         <div className="text-sm text-muted-foreground">Ստեղծող</div>
                          <div className="font-medium">
                            {(() => {
                              console.log('Creator profile data:', project.creator_profile);
                              
                              // Priority: Organization name first, then user name, then fallback to ID
                              if (project.creator_profile?.organization) {
                                return project.creator_profile.organization;
                              }
                              
                              if (project.creator_profile?.name) {
                                return project.creator_profile.name;
                              }
                              
                              const fullName = `${project.creator_profile?.first_name || ''} ${project.creator_profile?.last_name || ''}`.trim();
                              if (fullName) {
                                return fullName;
                              }
                              
                              return project.creator_id || 'Անանուն';
                            })()}
                          </div>
                       </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Կարգավիճակ</div>
                        {isEditingDescription && !isPreviewMode ? (
                          <Select value={editedProject.status || project.status} onValueChange={(v) => setEditedProject({...editedProject, status: v})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Ակտիվ</SelectItem>
                              <SelectItem value="completed">Ավարտված</SelectItem>
                              <SelectItem value="paused">Դադարեցված</SelectItem>
                              <SelectItem value="cancelled">Չեղարկված</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="font-medium">
                            {project.status === 'active' ? 'Ակտիվ' :
                             project.status === 'completed' ? 'Ավարտված' :
                             project.status === 'paused' ? 'Դադարեցված' :
                             project.status === 'cancelled' ? 'Չեղարկված' :
                             project.status}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Սկիզբ</div>
                        {isEditingDescription && !isPreviewMode ? (
                          <Input 
                            type="datetime-local" 
                            value={editedProject.start_date ? new Date(editedProject.start_date).toISOString().slice(0, 16) : ''} 
                            onChange={(e) => setEditedProject({...editedProject, start_date: e.target.value})}
                          />
                        ) : (
                          <div className="font-medium">{project.start_date ? new Date(project.start_date).toLocaleString() : "—"}</div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Ավարտ</div>
                        {isEditingDescription && !isPreviewMode ? (
                          <Input 
                            type="datetime-local" 
                            value={editedProject.end_date ? new Date(editedProject.end_date).toISOString().slice(0, 16) : ''} 
                            onChange={(e) => setEditedProject({...editedProject, end_date: e.target.value})}
                          />
                        ) : (
                          <div className="font-medium">{project.end_date ? new Date(project.end_date).toLocaleString() : "—"}</div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Դիմողների քանակ</div>
                        <div className="font-medium">{applications?.length || 0}</div>
                      </div>
                      {(project.max_applicants || (isEditingDescription && !isPreviewMode)) && (
                        <div>
                          <div className="text-sm text-muted-foreground">Առավելագույն դիմողներ</div>
                          {isEditingDescription && !isPreviewMode ? (
                            <Input 
                              type="number" 
                              value={editedProject.max_applicants || project.max_applicants || ''} 
                              onChange={(e) => setEditedProject({...editedProject, max_applicants: parseInt(e.target.value) || null})}
                              placeholder="Առավելագույն դիմողներ"
                            />
                          ) : (
                            <div className="font-medium">{project.max_applicants}</div>
                          )}
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-muted-foreground">Դիմումների վերջնաժամկետ</div>
                        {isEditingDescription && !isPreviewMode ? (
                          <Input 
                            type="date" 
                            value={editedProject.application_deadline ? new Date(editedProject.application_deadline).toISOString().slice(0, 10) : ''} 
                            onChange={(e) => setEditedProject({...editedProject, application_deadline: e.target.value})}
                          />
                        ) : (
                          <div className="font-medium">{project.application_deadline ? new Date(project.application_deadline).toLocaleDateString() : '—'}</div>
                        )}
                      </div>
                      <div className="mt-2">
                        {userRole === 'student' ? (
                          <ProjectApplicationButton 
                            user={user}
                            project={project}
                            applications={applications}
                            apply={apply}
                          />
                        ) : (
                          <Button 
                            disabled 
                            className="w-full min-h-[40px] flex items-center justify-center"
                            variant="secondary"
                          >
                            Միայն ուսանողները կարող են դիմել
                          </Button>
                        )}
                      </div>
                    </aside>
                  </div>
                </Section>

                {/* Applications Management Section for Project Creator */}
                {canEdit && applications && applications.length > 0 && (
                  <Section title="Դիմումների կառավարում">
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <Card key={application.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium">{application.applicant_profile?.name || application.applicant_name || 'Անանուն'}</div>
                              <div className="text-sm text-muted-foreground">
                                Դիմել է՝ {new Date(application.applied_at).toLocaleDateString()}
                              </div>
                              {application.cover_letter && (
                                <div className="mt-2 text-sm">
                                  <span className="font-medium">Ուղեկցող նամակ:</span> {application.cover_letter}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                application.status === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {application.status === 'pending' ? 'Սպասում է' :
                                 application.status === 'approved' ? 'Հաստատված' : 'Մերժված'}
                              </span>
                              {application.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => {
                                      updateStatus.mutate({ id: application.id, status: 'approved' });
                                      toast({ description: 'Դիմումը հաստատված է' });
                                    }}
                                  >
                                    Հաստատել
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => {
                                      updateStatus.mutate({ id: application.id, status: 'rejected' });
                                      toast({ description: 'Դիմումը մերժված է' });
                                    }}
                                  >
                                    Մերժել
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Section>
                )}
              </TabsContent>

                <TabsContent value="steps">
                  <StepsTab projectId={projectId} canEdit={canEdit && isEditingDescription} />
                </TabsContent>

                <TabsContent value="discussions">
                  <DiscussionsTab projectId={projectId} canEdit={canEdit && isEditingDescription} />
                </TabsContent>

                <TabsContent value="files">
                  <FilesTab projectId={projectId} canEdit={canEdit && isEditingDescription} />
                </TabsContent>

                <TabsContent value="timeline">
                  <TimelineTab projectId={projectId} canEdit={canEdit && isEditingDescription} />
                </TabsContent>

                <TabsContent value="evaluation">
                  <EvaluationTab projectId={projectId} canEdit={canEdit && isEditingDescription} />
                </TabsContent>
            </Tabs>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
