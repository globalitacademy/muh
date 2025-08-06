import React, { useMemo, useState } from "react";
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
import { useProjectSteps } from "@/hooks/useProjectSteps";
import { toast } from "sonner";

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
    <Section title="Steps">
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

            <Tabs defaultValue="overview">
              <TabsList className="flex flex-wrap">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="steps">Steps</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="overview"><Section title="Overview" /></TabsContent>
              <TabsContent value="schedule"><Section title="Schedule" /></TabsContent>
              <TabsContent value="steps"><StepsTab projectId={projectId} /></TabsContent>
              <TabsContent value="discussions"><Section title="Discussions" /></TabsContent>
              <TabsContent value="files"><Section title="Files" /></TabsContent>
              <TabsContent value="evaluation"><Section title="Evaluation" /></TabsContent>
              <TabsContent value="timeline"><Section title="Timeline" /></TabsContent>
            </Tabs>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
