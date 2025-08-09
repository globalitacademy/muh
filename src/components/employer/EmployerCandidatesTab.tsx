import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEmployerJobPostings, useEmployerApplications } from '@/hooks/useJobPostings';
import { Search, CheckCircle, XCircle, Clock, FileText, FolderKanban } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

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

const useEmployerProjectApplications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['employer-project-applications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // First get all applications
      const { data: applications, error } = await supabase
        .from('project_applications')
        .select('*')
        .order('applied_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching project applications:', error);
        throw error;
      }
      
      if (!applications || applications.length === 0) {
        console.log('No project applications found');
        return [];
      }
      
      // Get additional data and filter by employer's projects
      const filteredApplications = [];
      for (const app of applications) {
        const [projectRes, profileRes] = await Promise.all([
          supabase.from('projects').select('id, title, description, creator_id').eq('id', app.project_id).maybeSingle(),
          supabase.from('profiles').select('id, name').eq('id', app.applicant_id).maybeSingle()
        ]);
        
        console.log('Project data:', projectRes.data, 'Profile data:', profileRes.data, 'User ID:', user.id);
        
        // Only include if project belongs to current user
        if (projectRes.data?.creator_id === user.id) {
          filteredApplications.push({
            ...app,
            projects: projectRes.data,
            profiles: profileRes.data
          });
        }
      }
      
      console.log('Filtered applications:', filteredApplications);
      return filteredApplications;
    },
    enabled: !!user?.id,
  });
};

const useUpdateProjectApplicationStatus = () => {
  const { user } = useAuth();
  
  return async ({ applicationId, status, rejectionReason }: { 
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
  };
};

const ProjectApplicationCard: React.FC<{ application: ProjectApplication }> = ({ application }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const updateStatus = useUpdateProjectApplicationStatus();

  const handleApprove = async () => {
    setLoading(true);
    try {
      await updateStatus({
        applicationId: application.id,
        status: 'approved'
      });
      toast({
        description: 'Դիմումը հաստատվել է'
      });
      // Refresh page to update data
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: 'Սխալ է տեղի ունեցել'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await updateStatus({
        applicationId: application.id,
        status: 'rejected',
        rejectionReason: rejectionReason || undefined
      });
      setShowRejectDialog(false);
      setRejectionReason('');
      toast({
        description: 'Դիմումը մերժվել է'
      });
      // Refresh page to update data
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: 'Սխալ է տեղի ունեցել'
      });
    } finally {
      setLoading(false);
    }
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
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
              disabled={loading}
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
                  disabled={loading}
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
                      disabled={loading}
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

export const EmployerCandidatesTab: React.FC = () => {
  const { data: jobApplications = [], isLoading: jobAppsLoading } = useEmployerApplications();
  const { data: projectApplications = [], isLoading: projectAppsLoading } = useEmployerProjectApplications();

  console.log('Project Applications:', projectApplications);
  console.log('Job Applications:', jobApplications);

  const pendingJobApps = jobApplications.filter(app => app.status === 'pending');
  const pendingProjectApps = projectApplications.filter(app => app.status === 'pending');
  
  // Separate internship applications from job applications
  const jobOnlyApplications = jobApplications.filter(app => 
    !app.job_postings || app.job_postings.posting_type !== 'internship'
  );
  const internshipApplications = jobApplications.filter(app => 
    app.job_postings && app.job_postings.posting_type === 'internship'
  );

  const pendingInternshipApps = internshipApplications.filter(app => app.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Թեկնածուներ</h2>
      </div>

      <Tabs defaultValue="project-applications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="project-applications" className="gap-2">
            <FolderKanban className="w-4 h-4" />
            Նախագծային դիմումներ
            {pendingProjectApps.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingProjectApps.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="job-applications" className="gap-2">
            <FileText className="w-4 h-4" />
            Աշխատանքային դիմումներ
            {pendingJobApps.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingJobApps.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="internship-applications" className="gap-2">
            <Search className="w-4 h-4" />
            Պրակտիկային դիմումներ
            {pendingInternshipApps.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingInternshipApps.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="project-applications" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Սպասող</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center text-yellow-600">
                  {pendingProjectApps.length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Հաստատված</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center text-green-600">
                  {projectApplications.filter(app => app.status === 'approved').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Մերժված</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center text-red-600">
                  {projectApplications.filter(app => app.status === 'rejected').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {projectAppsLoading ? (
            <div className="text-center">Բեռնվում է...</div>
          ) : projectApplications.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <FolderKanban className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-armenian">Նախագծային դիմումներ չկան</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingProjectApps.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Սպասող դիմումներ</h3>
                  <div className="grid gap-4">
                    {pendingProjectApps.map(application => (
                      <ProjectApplicationCard key={application.id} application={application} />
                    ))}
                  </div>
                </div>
              )}

              {projectApplications.filter(app => app.status !== 'pending').length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Այլ դիմումներ</h3>
                  <div className="grid gap-4">
                    {projectApplications.filter(app => app.status !== 'pending').map(application => (
                      <ProjectApplicationCard key={application.id} application={application} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="job-applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-armenian">Աշխատանքային հայտարարությունների դիմումներ</CardTitle>
            </CardHeader>
            <CardContent>
              {jobAppsLoading ? (
                <div className="text-sm text-muted-foreground font-armenian">Բեռնվում է...</div>
              ) : jobOnlyApplications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-armenian">Դեռևս դիմումներ չկան</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobOnlyApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold font-armenian">{app.profiles?.name || 'Անուն չի նշված'}</p>
                        <p className="text-sm text-muted-foreground">{app.job_postings?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Դիմել է՝ {new Date(app.created_at).toLocaleDateString('hy-AM')}
                        </p>
                      </div>
                      <Badge variant={
                        app.status === 'accepted' ? 'default' : 
                        app.status === 'pending' ? 'secondary' : 
                        'outline'
                      }>
                        {app.status === 'accepted' ? 'Ընդունված' :
                         app.status === 'pending' ? 'Սպասում է' :
                         app.status === 'rejected' ? 'Մերժված' : app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="internship-applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-armenian">Պրակտիկային դիմումներ</CardTitle>
            </CardHeader>
            <CardContent>
              {jobAppsLoading ? (
                <div className="text-sm text-muted-foreground font-armenian">Բեռնվում է...</div>
              ) : internshipApplications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-armenian">Դեռևս պրակտիկային դիմումներ չկան</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {internshipApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold font-armenian">{app.profiles?.name || 'Անուն չի նշված'}</p>
                        <p className="text-sm text-muted-foreground">{app.job_postings?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Դիմել է՝ {new Date(app.created_at).toLocaleDateString('hy-AM')}
                        </p>
                      </div>
                      <Badge variant={
                        app.status === 'accepted' ? 'default' : 
                        app.status === 'pending' ? 'secondary' : 
                        'outline'
                      }>
                        {app.status === 'accepted' ? 'Ընդունված' :
                         app.status === 'pending' ? 'Սպասում է' :
                         app.status === 'rejected' ? 'Մերժված' : app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};