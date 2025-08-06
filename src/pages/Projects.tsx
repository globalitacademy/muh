import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMyProjects, useCreateProject } from "@/hooks/useProjects";
import { useUserRoles } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Projects: React.FC = () => {
  const { data: projects, isLoading } = useMyProjects();
  const { data: roles } = useUserRoles();
  const canCreate = roles?.includes("instructor") || roles?.includes("employer");
  const createMutation = useCreateProject();
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const onCreate = async () => {
    if (!title.trim()) return toast.error("Please enter a title");
    try {
      const project = await createMutation.mutateAsync({
        title: title.trim(),
        description: description || undefined,
        start_date: undefined,
        end_date: undefined,
        is_public: false,
      });
      toast.success("Project created");
      nav(`/projects/${project.id}`);
    } catch (e: any) {
      toast.error(e.message || "Failed to create project");
    }
  };

  return (
    <div className="page-container">
      <Header />
      <main className="container mx-auto py-8">
        <section className="mb-8">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-muted-foreground">Manage and collaborate on projects.</p>
        </section>

        {canCreate && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create a new project</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="desc">Description</Label>
                <Input id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
              </div>
              <div className="md:col-span-2">
                <Button onClick={onCreate} disabled={createMutation.isPending}>Create</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <section>
          <h2 className="text-xl font-medium mb-4">My projects</h2>
          {isLoading ? (
            <p>Loading…</p>
          ) : projects && projects.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <Card key={p.id} className="cursor-pointer" onClick={() => nav(`/projects/${p.id}`)}>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{p.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No projects yet.</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
