import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEmployerJobPostings, useEmployerApplications } from '@/hooks/useJobPostings';
import { Search, CheckCircle, XCircle, Clock, FileText, FolderKanban, Trash2, User, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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
    phone?: string;
    organization?: string;
    group_number?: string;
    department?: string;
    bio?: string;
    field_of_study?: string;
    linkedin_url?: string;
    avatar_url?: string;
  };
}

const useEmployerProjectApplications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['employer-project-applications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // First get projects created by the current user
      const { data: userProjects, error: projectsError } = await supabase
        .from('projects')
        .select('id')
        .eq('creator_id', user.id);
      
      if (projectsError) {
        console.error('Error fetching user projects:', projectsError);
        throw projectsError;
      }
      
      if (!userProjects || userProjects.length === 0) {
        console.log('No projects found for user');
        return [];
      }
      
      const projectIds = userProjects.map(p => p.id);
      console.log('User project IDs:', projectIds);
      
      // Fetch applications for user's projects
      const { data: applications, error } = await supabase
        .from('project_applications')
        .select('*')
        .in('project_id', projectIds)
        .order('applied_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching project applications:', error);
        throw error;
      }
      
      if (!applications || applications.length === 0) {
        console.log('No applications found');
        return [];
      }
      
      console.log('Found applications:', applications.length);
      
      // Fetch project and profile data for each application
      const enrichedApplications = await Promise.all(
        applications.map(async (app) => {
          const [projectRes, profileRes] = await Promise.all([
            supabase
              .from('projects')
              .select('id, title, description, creator_id')
              .eq('id', app.project_id)
              .maybeSingle(),
            supabase
              .from('profiles')
              .select('id, name, phone, organization, group_number, department, bio, field_of_study, linkedin_url, avatar_url')
              .eq('id', app.applicant_id)
              .maybeSingle()
          ]);
          
          if (projectRes.error) {
            console.error('Error fetching project:', projectRes.error);
          }
          if (profileRes.error) {
            console.error('Error fetching profile:', profileRes.error);
          }
          
          return {
            ...app,
            projects: projectRes.data,
            profiles: profileRes.data
          };
        })
      );
      
      console.log('Enriched applications:', enrichedApplications);
      return enrichedApplications;
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

const useDeleteProjectApplication = () => {
  return async (applicationId: string) => {
    const { error } = await supabase
      .from('project_applications')
      .delete()
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
  const deleteApplication = useDeleteProjectApplication();

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

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteApplication(application.id);
      toast({
        description: 'Դիմումը ջնջվել է'
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
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <FolderKanban className="w-4 h-4 mr-2" />
                {application.projects?.title}
              </div>
              <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                {application.profiles?.name || 'Անանուն օգտատեր'}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {application.profiles?.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <span className="text-blue-600">📱</span>
                  </div>
                  <span>{application.profiles.phone}</span>
                </div>
              )}
              {application.profiles?.organization && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <span className="text-purple-600">🏢</span>
                  </div>
                  <span>{application.profiles.organization}</span>
                </div>
              )}
              {application.profiles?.group_number && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <span className="text-green-600">👥</span>
                  </div>
                  <span>Խումբ {application.profiles.group_number}</span>
                </div>
              )}
              {application.profiles?.field_of_study && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <span className="text-amber-600">🎓</span>
                  </div>
                  <span>{application.profiles.field_of_study}</span>
                </div>
              )}
              {application.profiles?.linkedin_url && (
                <a href={application.profiles.linkedin_url} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors group/link">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover/link:bg-blue-500/20 transition-colors">
                    <span>💼</span>
                  </div>
                  <span className="underline underline-offset-2">LinkedIn պրոֆիլ</span>
                </a>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <span>Դիմել է՝ {new Date(application.applied_at).toLocaleDateString('hy-AM')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            {getStatusBadge(application.status)}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 group/delete"
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4 group-hover/delete:scale-110 transition-transform" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-0 shadow-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-destructive">Ջնջե՞լ դիմումը</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    Այս գործողությունը չի կարելի հետ գցել։ Դիմումը ընդմիշտ կջնջվի:
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover:bg-muted">Չեղարկել</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-destructive/25"
                  >
                    Ջնջել
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {application.profiles?.bio && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-primary" />
              <Label className="text-sm font-semibold text-foreground">Կենսագրական տվյալներ</Label>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border border-border/50 backdrop-blur-sm">
              <p className="text-sm leading-relaxed text-muted-foreground">{application.profiles.bio}</p>
            </div>
          </div>
        )}

        {application.cover_letter && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-primary" />
              <Label className="text-sm font-semibold text-foreground">Ուղեկցող նամակ</Label>
            </div>
            <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 backdrop-blur-sm">
              <p className="text-sm leading-relaxed text-foreground/90">{application.cover_letter}</p>
            </div>
          </div>
        )}

        {application.status === 'pending' && (
          <div className="flex gap-3">
            <Button 
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-green-500/25 transition-all duration-200"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Հաստատել
            </Button>
            
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 transition-all duration-200"
                  disabled={loading}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Մերժել
                </Button>
              </DialogTrigger>
              <DialogContent className="border-0 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-destructive">Մերժել դիմումը</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rejection-reason" className="text-sm font-medium">Մերժման պատճառ (ոչ պարտադիր)</Label>
                    <Textarea
                      id="rejection-reason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Նշեք մերժման պատճառը..."
                      className="mt-2 border-border/50 focus:border-destructive/50"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleReject}
                      variant="destructive"
                      disabled={loading}
                      className="flex-1 shadow-lg hover:shadow-destructive/25"
                    >
                      Մերժել
                    </Button>
                    <Button
                      onClick={() => setShowRejectDialog(false)}
                      variant="outline"
                      className="flex-1 hover:bg-muted"
                    >
                      Չեղարկել
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {application.status !== 'pending' && (
          <div className="pt-4 border-t border-border/50">
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => {/* Navigate to tasks management */}}
            >
              <FolderKanban className="w-4 h-4 mr-2" />
              Կառավարել առաջադրանքները
            </Button>
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