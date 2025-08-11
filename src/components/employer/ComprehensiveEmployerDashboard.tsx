import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyProjects, useCreateProject, useUpdateProject } from "@/hooks/useProjects";
import { useProjectApplications } from "@/hooks/useProjectApplications";
import { useAuth } from "@/hooks/useAuth";
import { ProjectCreationForm } from "./project/ProjectCreationForm";
import { toast } from "sonner";
import { Plus, Edit, Eye, Calendar, Users, MessageSquare, BarChart3 } from "lucide-react";

export const ComprehensiveEmployerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: projects, isLoading: projectsLoading } = useMyProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const userProjects = projects?.filter(p => p.creator_id === user?.id) || [];

  const handleCreateProject = async (projectData: any) => {
    try {
      await createProject.mutateAsync({
        ...projectData,
        start_date: projectData.start_date?.toISOString(),
        end_date: projectData.end_date?.toISOString(),
        application_deadline: projectData.application_deadline?.toISOString(),
      });
      toast.success("Project created successfully!");
      setShowCreateForm(false);
    } catch (error) {
      toast.error("Failed to create project");
    }
  };

  const ProjectCard: React.FC<{ project: any }> = ({ project }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{project.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={project.is_public ? "default" : "secondary"}>
                {project.is_public ? "Public" : "Private"}
              </Badge>
              <Badge variant="outline">{project.project_type || 'project'}</Badge>
              <Badge variant="outline">{project.status}</Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={() => setSelectedProject(project)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {project.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Category: {project.category}</span>
          <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
        </div>
        {project.application_deadline && (
          <div className="mt-2 text-xs text-orange-600">
            Deadline: {new Date(project.application_deadline).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const ProjectManagementView: React.FC<{ project: any }> = ({ project }) => {
    const { data: applications } = useProjectApplications(project.id);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <p className="text-muted-foreground">{project.organization}</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedProject(null)}>
            Back to Projects
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Applications ({applications?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="discussions" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge>{project.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Applications:</span>
                    <span>{applications?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Public:</span>
                    <Badge variant={project.is_public ? "default" : "secondary"}>
                      {project.is_public ? "Yes" : "No"}
                    </Badge>
                  </div>
                  {project.max_applicants && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Applicants:</span>
                      <span>{project.max_applicants}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {project.required_skills && project.required_skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.required_skills.map((skill: string) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={() => setActiveTab("applications")} 
                    variant="outline" 
                    className="w-full"
                  >
                    Review Applications
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("tasks")} 
                    variant="outline" 
                    className="w-full"
                  >
                    Manage Tasks
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("discussions")} 
                    variant="outline" 
                    className="w-full"
                  >
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>

            {project.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{project.description}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Application Management</CardTitle>
              </CardHeader>
              <CardContent>
                {applications && applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((app: any) => (
                      <div key={app.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Application #{app.id.slice(0, 8)}</h4>
                          <Badge variant={
                            app.status === 'approved' ? 'default' : 
                            app.status === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Applied: {new Date(app.applied_at).toLocaleDateString()}
                        </p>
                        {app.cover_letter && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Cover Letter:</p>
                            <p className="text-sm text-muted-foreground">{app.cover_letter}</p>
                          </div>
                        )}
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="default">Approve</Button>
                          <Button size="sm" variant="destructive">Reject</Button>
                          <Button size="sm" variant="outline">View Profile</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No applications yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Task management features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discussions">
            <Card>
              <CardHeader>
                <CardTitle>Communication Hub</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Discussion and messaging features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>File Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">File sharing and management features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Project Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Analytics and reporting features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  if (selectedProject) {
    return <ProjectManagementView project={selectedProject} />;
  }

  if (showCreateForm) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Create New Project</h1>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            Cancel
          </Button>
        </div>
        <ProjectCreationForm 
          onSubmit={handleCreateProject}
          isLoading={createProject.isPending}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employer Dashboard</h1>
          <p className="text-muted-foreground">Manage your projects, jobs, and internships</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Project
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProjects.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProjects.filter(p => p.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public Projects</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProjects.filter(p => p.is_public).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {projectsLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : userProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">You haven't created any projects yet.</p>
              <Button onClick={() => setShowCreateForm(true)}>
                Create Your First Project
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};