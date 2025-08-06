import React, { useMemo, useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams } from "react-router-dom";
import { useProject } from "@/hooks/useProjects";
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
import { toast } from "sonner";
import { Image } from "lucide-react";

const Section: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {children || <p className="text-muted-foreground">Coming soon…</p>}
    </CardContent>
  </Card>
);

const statusOptions = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "blocked", label: "Blocked" },
] as const;

const StepsTab: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { data: steps, create, update, remove, isLoading } = useProjectSteps(projectId);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<typeof statusOptions[number]["value"]>("todo");

  const onAdd = async () => {
    const t = title.trim();
    if (!t) return toast.error("Title is required");
    try {
      await create.mutateAsync({ title: t, status });
      setTitle("");
      setStatus("todo");
    } catch (e: any) {
      toast.error(e.message || "Failed to add step");
    }
  };

  return (
    <Section title="Քայլեր">
      <div className="grid gap-3 md:grid-cols-4 items-end mb-4">
        <div className="md:col-span-2">
          <Label htmlFor="new-step">New step</Label>
          <Input id="new-step" placeholder="Step title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button onClick={onAdd} disabled={create.isPending}>Add</Button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading…</p>
      ) : !steps?.length ? (
        <p className="text-muted-foreground">No steps yet.</p>
      ) : (
        <div className="space-y-3">
          {steps.map((s) => (
            <Card key={s.id}>
              <CardContent className="pt-4 grid gap-3 md:grid-cols-6 items-center">
                <div className="md:col-span-3 font-medium">{s.title}</div>
                <div className="md:col-span-2">
                  <Select value={s.status} onValueChange={(v) => update.mutate({ id: s.id, status: v as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-right">
                  <Button variant="outline" onClick={() => remove.mutate(s.id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
};

const DiscussionsTab: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { data: messages, create, remove, isLoading } = useProjectDiscussions(projectId);
  const [content, setContent] = useState("");

  const onSend = async () => {
    const c = content.trim();
    if (!c) return;
    try {
      await create.mutateAsync({ content: c });
      setContent("");
    } catch (e: any) {
      toast.error(e.message || "Failed to post");
    }
  };

  return (
    <Section title="Քննարկումներ">
      <div className="grid gap-3 md:grid-cols-6 items-end mb-4">
        <div className="md:col-span-5">
          <Label htmlFor="msg">Message</Label>
          <Input id="msg" placeholder="Write a message…" value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div>
          <Button onClick={onSend} disabled={create.isPending}>Send</Button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading…</p>
      ) : !messages?.length ? (
        <p className="text-muted-foreground">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <Card key={m.id}>
              <CardContent className="pt-4 flex items-start justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
                  <div className="mt-1">{m.content}</div>
                </div>
                <Button variant="outline" onClick={() => remove.mutate(m.id)}>Delete</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
};

const FilesTab: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { data: files, upload, togglePublic, remove, isLoading } = useProjectFiles(projectId);
  const [file, setFile] = useState<File | null>(null);

  const onUpload = async () => {
    if (!file) return;
    try {
      await upload.mutateAsync(file);
      setFile(null);
      toast.success("Uploaded");
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    }
  };

  const getPublicUrl = (file_path: string) => supabase.storage.from("project-files").getPublicUrl(file_path).data.publicUrl;

  return (
    <Section title="Ֆայլեր">
      <div className="grid gap-3 md:grid-cols-6 items-end mb-4">
        <div className="md:col-span-5">
          <Label htmlFor="file">Add file</Label>
          <Input id="file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
        <div>
          <Button onClick={onUpload} disabled={upload.isPending || !file}>Upload</Button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading…</p>
      ) : !files?.length ? (
        <p className="text-muted-foreground">No files yet.</p>
      ) : (
        <div className="space-y-3">
          {files.map((f) => (
            <Card key={f.id}>
              <CardContent className="pt-4 grid gap-3 md:grid-cols-6 items-center">
                <div className="md:col-span-3">
                  <div className="font-medium">{f.name}</div>
                  <a className="text-sm text-primary underline" href={getPublicUrl(f.file_path)} target="_blank" rel="noreferrer">Open</a>
                </div>
                <div className="md:col-span-2 flex items-center gap-2">
                  <Switch checked={f.is_public} onCheckedChange={(v) => togglePublic.mutate({ id: f.id, is_public: v })} />
                  <span className="text-sm">Public</span>
                </div>
                <div className="text-right">
                  <Button variant="outline" onClick={() => remove.mutate(f)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
};

const EvaluationTab: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { data: evals, create, remove, isLoading } = useProjectEvaluations(projectId);
  const [score, setScore] = useState(0);
  const [subjectUser, setSubjectUser] = useState("");
  const [subjectTeam, setSubjectTeam] = useState("");
  const [comments, setComments] = useState("");

  const onAdd = async () => {
    if (!score) return toast.error("Score is required");
    try {
      await create.mutateAsync({ score, subject_user_id: subjectUser || null, subject_team: subjectTeam || null, comments });
      setScore(0); setSubjectUser(""); setSubjectTeam(""); setComments("");
    } catch (e: any) { toast.error(e.message || "Failed to evaluate"); }
  };

  return (
    <Section title="Գնահատական">
      <div className="grid gap-3 md:grid-cols-6 mb-4">
        <div>
          <Label htmlFor="score">Score</Label>
          <Input id="score" type="number" value={score} onChange={(e) => setScore(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="user">Student ID (optional)</Label>
          <Input id="user" value={subjectUser} onChange={(e) => setSubjectUser(e.target.value)} placeholder="UUID" />
        </div>
        <div>
          <Label htmlFor="team">Team (optional)</Label>
          <Input id="team" value={subjectTeam} onChange={(e) => setSubjectTeam(e.target.value)} placeholder="Team name/code" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="comments">Comments</Label>
          <Input id="comments" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Notes" />
        </div>
        <div className="flex items-end"><Button onClick={onAdd} disabled={create.isPending}>Save</Button></div>
      </div>

      {isLoading ? (
        <p>Loading…</p>
      ) : !evals?.length ? (
        <p className="text-muted-foreground">No evaluations yet.</p>
      ) : (
        <div className="space-y-3">
          {evals.map((ev) => (
            <Card key={ev.id}>
              <CardContent className="pt-4 grid md:grid-cols-6 items-center gap-3">
                <div className="md:col-span-2 font-medium">Score: {ev.score}</div>
                <div className="md:col-span-3 text-sm text-muted-foreground">{ev.comments}</div>
                <div className="text-right">
                  <Button variant="outline" onClick={() => remove.mutate(ev.id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
};

const TimelineTab: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { data: events, add, isLoading } = useProjectTimeline(projectId);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("note");
  const [description, setDescription] = useState("");

  const onAdd = async () => {
    const t = title.trim();
    if (!t) return toast.error("Title required");
    try {
      await add.mutateAsync({ title: t, type, description });
      setTitle(""); setDescription(""); setType("note");
    } catch (e: any) { toast.error(e.message || "Failed to add event"); }
  };

  return (
    <Section title="Թայմլայն">
      <div className="grid gap-3 md:grid-cols-6 items-end mb-4">
        <div>
          <Label>Type</Label>
          <Input value={type} onChange={(e) => setType(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Label>Description</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <Button onClick={onAdd} disabled={add.isPending}>Add</Button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading…</p>
      ) : !events?.length ? (
        <p className="text-muted-foreground">No events yet.</p>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <Card key={ev.id}>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">{new Date(ev.event_date).toLocaleString()} • {ev.type}</div>
                <div className="font-medium">{ev.title}</div>
                {ev.description && <div className="text-sm">{ev.description}</div>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
};

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const projectId = useMemo(() => id as string, [id]);
  const { data: project, isLoading } = useProject(projectId);

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
              <h1 className="text-2xl font-semibold">{project.title}</h1>
              {project.description && <p className="text-muted-foreground">{project.description}</p>}
            </header>

            <Tabs defaultValue="description">
              <TabsList className="flex flex-wrap">
                <TabsTrigger value="description">Նկարագիր</TabsTrigger>
                <TabsTrigger value="schedule">Ժամանակացույց</TabsTrigger>
                <TabsTrigger value="steps">Քայլեր</TabsTrigger>
                <TabsTrigger value="discussions">Քննարկումներ</TabsTrigger>
                <TabsTrigger value="files">Ֆայլեր</TabsTrigger>
                <TabsTrigger value="evaluation">Գնահատական</TabsTrigger>
                <TabsTrigger value="timeline">Թայմլայն</TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <Section title="Նկարագիր">
                  {project.description ? (
                    <p>{project.description}</p>
                  ) : (
                    <p className="text-muted-foreground">Նկարագիր չկա։</p>
                  )}
                </Section>
              </TabsContent>

              <TabsContent value="schedule">
                <Section title="Ժամանակացույց">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Սկիզբ</div>
                      <div className="font-medium">{project.start_date ? new Date(project.start_date).toLocaleString() : "—"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Ավարտ</div>
                      <div className="font-medium">{project.end_date ? new Date(project.end_date).toLocaleString() : "—"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Կարգավիճակ</div>
                      <div className="font-medium">{project.status}</div>
                    </div>
                  </div>
                </Section>
              </TabsContent>

              <TabsContent value="steps"><StepsTab projectId={projectId} /></TabsContent>
              <TabsContent value="discussions"><DiscussionsTab projectId={projectId} /></TabsContent>
              <TabsContent value="files"><FilesTab projectId={projectId} /></TabsContent>
              <TabsContent value="evaluation"><EvaluationTab projectId={projectId} /></TabsContent>
              <TabsContent value="timeline"><TimelineTab projectId={projectId} /></TabsContent>
            </Tabs>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
