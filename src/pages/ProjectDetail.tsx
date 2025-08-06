import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams } from "react-router-dom";
import { useProject } from "@/hooks/useProjects";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const Section: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <Card className="mb-6">
    <CardContent className="pt-6">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {children || <p className="text-muted-foreground">Coming soon…</p>}
    </CardContent>
  </Card>
);

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const { data: project, isLoading } = useProject(id);

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
              <TabsContent value="steps"><Section title="Steps" /></TabsContent>
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
