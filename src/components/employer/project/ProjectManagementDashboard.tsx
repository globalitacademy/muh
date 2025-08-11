import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/useProjects";
import { ProjectApplicationsManagement } from "./ProjectApplicationsManagement";
import { ProjectTasksManagement } from "./ProjectTasksManagement";
import { ProjectDiscussionsManagement } from "./ProjectDiscussionsManagement";
import { ProjectFilesManagement } from "./ProjectFilesManagement";
import { ProjectTimelineManagement } from "./ProjectTimelineManagement";
import { ProjectReviewsManagement } from "./ProjectReviewsManagement";
import { ProjectEditForm } from "./ProjectEditForm";
import { Calendar, Users, MessageSquare, FileText, BarChart3, Settings, Edit } from "lucide-react";

interface ProjectManagementDashboardProps {
  projectId: string;
}

export const ProjectManagementDashboard: React.FC<ProjectManagementDashboardProps> = ({
  projectId,
}) => {
  const { data: project, isLoading, error } = useProject(projectId);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Project not found or you don't have access to it.</p>
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCreatorDisplayName = () => {
    if (project.creator_profile?.name) return project.creator_profile.name;
    if (project.creator_profile?.organization) return project.creator_profile.organization;
    if (project.creator_profile?.first_name || project.creator_profile?.last_name) {
      return `${project.creator_profile.first_name || ''} ${project.creator_profile.last_name || ''}`.trim();
    }
    return 'Unknown Creator';
  };

  if (isEditing) {
    return (
      <div className="container mx-auto py-6">
        <ProjectEditForm 
          project={project} 
          onSave={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Project Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">{project.title}</CardTitle>
                <Badge className={getStatusBadgeColor(project.status)}>
                  {project.status}
                </Badge>
                {project.project_type && (
                  <Badge variant="outline">
                    {project.project_type}
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground space-y-1">
                <p><strong>Organization:</strong> {getCreatorDisplayName()}</p>
                <p><strong>Category:</strong> {project.category || 'Not specified'}</p>
                {project.start_date && project.end_date && (
                  <p><strong>Duration:</strong> {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}</p>
                )}
              </div>
            </div>
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
          </div>
        </CardHeader>
        {project.description && (
          <CardContent>
            <p className="text-muted-foreground">{project.description}</p>
          </CardContent>
        )}
      </Card>

      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Files
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={getStatusBadgeColor(project.status)}>
                    {project.status}
                  </Badge>
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
                {project.application_deadline && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Application Deadline:</span>
                    <span>{new Date(project.application_deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Required Skills */}
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

            {/* Quick Actions */}
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
                  Manage Applications
                </Button>
                <Button 
                  onClick={() => setActiveTab("tasks")} 
                  variant="outline" 
                  className="w-full"
                >
                  Create Task
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

          {/* Timeline Preview */}
          {project.timeline && project.timeline.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Timeline Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.timeline.map((phase: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{phase.phase}</h4>
                        <p className="text-sm text-muted-foreground">{phase.description}</p>
                        <p className="text-xs text-muted-foreground">{phase.weeks} weeks</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="applications">
          <ProjectApplicationsManagement projectId={projectId} />
        </TabsContent>

        <TabsContent value="tasks">
          <ProjectTasksManagement projectId={projectId} />
        </TabsContent>

        <TabsContent value="discussions">
          <ProjectDiscussionsManagement projectId={projectId} />
        </TabsContent>

        <TabsContent value="files">
          <ProjectFilesManagement projectId={projectId} />
        </TabsContent>

        <TabsContent value="timeline">
          <ProjectTimelineManagement project={project} />
        </TabsContent>

        <TabsContent value="reviews">
          <ProjectReviewsManagement projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};