import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, Eye, Users, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ProjectApplication {
  id: string;
  project_id: string;
  applicant_id: string;
  status: string;
  cover_letter: string | null;
  applied_at: string;
  projects?: {
    id: string;
    title: string;
    description: string;
  };
  profiles?: {
    id: string;
    name: string;
  };
}

interface Project {
  id: string;
  title: string;
  description: string;
  created_at: string;
  max_applicants: number | null;
  application_deadline: string | null;
  status: string;
}

const useProjectApplications = () => {
  return useQuery({
    queryKey: ['admin-project-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_applications')
        .select(`
          *
        `)
        .order('applied_at', { ascending: false });
      
      if (error) throw error;
      
      // Get project and profile data separately  
      const dataWithRelations = await Promise.all(
        (data || []).map(async (app) => {
          const [projectRes, profileRes] = await Promise.all([
            supabase.from('projects').select('id, title, description').eq('id', app.project_id).single(),
            supabase.from('profiles').select('id, name').eq('id', app.applicant_id).single()
          ]);
          
          return {
            ...app,
            projects: projectRes.data,
            profiles: profileRes.data
          };
        })
      );
      
      return dataWithRelations;
    },
  });
};

const useProjects = () => {
  return useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      applicationId, 
      status, 
      rejectionReason 
    }: { 
      applicationId: string; 
      status: 'approved' | 'rejected';
      rejectionReason?: string;
    }) => {
      const updateData: any = { status };
      
      if (status === 'rejected' && rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }
      
      const { error } = await supabase
        .from('project_applications')
        .update(updateData)
        .eq('id', applicationId);
      
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-project-applications'] });
      toast.success('Դիմումի կարգավիճակը թարմացված է');
    },
    onError: (error: any) => {
      console.error('Error updating application status:', error);
      toast.error('Սխալ է տեղի ունեցել');
    },
  });
};

const ApplicationCard: React.FC<{ application: ProjectApplication }> = ({ application }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const updateStatus = useUpdateApplicationStatus();

  const handleApprove = () => {
    updateStatus.mutate({
      applicationId: application.id,
      status: 'approved'
    });
  };

  const handleReject = () => {
    updateStatus.mutate({
      applicationId: application.id,
      status: 'rejected',
      rejectionReason: rejectionReason || undefined
    });
    setShowRejectDialog(false);
    setRejectionReason('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />Սպասում է</Badge>;
      case 'approved':
        return <Badge variant="default" className="gap-1 bg-green-600"><CheckCircle className="w-3 h-3" />Հաստատված</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Մերժված</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{application.projects?.title}</h3>
            <p className="text-muted-foreground">
              {application.profiles?.name || 'Անանուն օգտատեր'}
            </p>
            <p className="text-sm text-muted-foreground">
              Դիմել է՝ {new Date(application.applied_at).toLocaleDateString('hy-AM')}
            </p>
          </div>
          {getStatusBadge(application.status)}
        </div>

        {application.cover_letter && (
          <div className="mb-4">
            <Label className="text-sm font-medium">Ուղեկցող նամակ:</Label>
            <p className="text-sm mt-1 p-2 bg-muted rounded">{application.cover_letter}</p>
          </div>
        )}

        {application.status === 'pending' && (
          <div className="flex gap-2">
            <Button 
              onClick={handleApprove}
              disabled={updateStatus.isPending}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Հաստատել
            </Button>
            
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  disabled={updateStatus.isPending}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Մերժել
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Մերժել դիմումը</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rejection-reason">Մերժման պատճառ (ոչ պարտադիր)</Label>
                    <Textarea
                      id="rejection-reason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Նշեք մերժման պատճառը..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleReject}
                      variant="destructive"
                      disabled={updateStatus.isPending}
                      className="flex-1"
                    >
                      Մերժել
                    </Button>
                    <Button
                      onClick={() => setShowRejectDialog(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Չեղարկել
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ProjectCard: React.FC<{ project: Project; applicationsCount: number }> = ({ project, applicationsCount }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{project.title}</h3>
            <p className="text-muted-foreground text-sm mt-1">
              {project.description.substring(0, 150)}...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Ստեղծված՝ {new Date(project.created_at).toLocaleDateString('hy-AM')}
            </p>
          </div>
          <Badge variant="outline" className="gap-1">
            <Users className="w-3 h-3" />
            {applicationsCount} դիմող
          </Badge>
        </div>

        <div className="flex gap-2 text-sm text-muted-foreground">
          {project.max_applicants && (
            <span>Մաքս՝ {project.max_applicants} դիմող</span>
          )}
          {project.application_deadline && (
            <span>Ժամկետ՝ {new Date(project.application_deadline).toLocaleDateString('hy-AM')}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const AdminProjectsTab: React.FC = () => {
  const { data: applications, isLoading: applicationsLoading } = useProjectApplications();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  const pendingApplications = applications?.filter(app => app.status === 'pending') || [];
  const approvedApplications = applications?.filter(app => app.status === 'approved') || [];
  const rejectedApplications = applications?.filter(app => app.status === 'rejected') || [];

  const getProjectApplicationsCount = (projectId: string) => {
    return applications?.filter(app => app.project_id === projectId).length || 0;
  };

  if (applicationsLoading || projectsLoading) {
    return <div className="flex justify-center py-8">Բեռնվում է...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Նախագծերի կառավարում</h2>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="applications" className="gap-2">
            <FileText className="w-4 h-4" />
            Դիմումներ
            {pendingApplications.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingApplications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="projects" className="gap-2">
            <Users className="w-4 h-4" />
            Նախագծեր
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Սպասող</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center text-yellow-600">
                  {pendingApplications.length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Հաստատված</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center text-green-600">
                  {approvedApplications.length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Մերժված</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center text-red-600">
                  {rejectedApplications.length}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Սպասող դիմումներ</h3>
            {pendingApplications.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Սպասող դիմումներ չկան
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingApplications.map(application => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
              </div>
            )}
          </div>

          {(approvedApplications.length > 0 || rejectedApplications.length > 0) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Այլ դիմումներ</h3>
              <div className="grid gap-4">
                {[...approvedApplications, ...rejectedApplications].map(application => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid gap-4">
            {projects?.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Նախագծեր չկան
                </CardContent>
              </Card>
            ) : (
              projects?.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  applicationsCount={getProjectApplicationsCount(project.id)}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};