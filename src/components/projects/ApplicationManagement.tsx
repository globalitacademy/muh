import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Calendar,
  FileText,
  Eye,
  Trash2
} from 'lucide-react';
import { useProjectApplications } from '@/hooks/useProjectApplications';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface ApplicationManagementProps {
  projectId: string;
}

const ApplicationManagement: React.FC<ApplicationManagementProps> = ({ projectId }) => {
  const { data: applications, updateStatus, remove, isLoading } = useProjectApplications(projectId);
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);

  const handleStatusUpdate = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      await updateStatus.mutateAsync({ id: applicationId, status });
      toast({
        title: 'Success',
        description: `Application ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update application status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    try {
      await remove.mutateAsync(applicationId);
      toast({
        title: 'Success',
        description: 'Application deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete application',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-warning-yellow text-white"><Clock className="h-3 w-3 mr-1" />Սպասման մեջ</Badge>;
      case 'approved':
        return <Badge className="bg-success-green text-white"><CheckCircle className="h-3 w-3 mr-1" />Հաստատված</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive text-white"><XCircle className="h-3 w-3 mr-1" />Մերժված</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const groupedApplications = {
    pending: applications?.filter(app => app.status === 'pending') || [],
    approved: applications?.filter(app => app.status === 'approved') || [],
    rejected: applications?.filter(app => app.status === 'rejected') || [],
  };

  if (isLoading) {
    return (
      <Card className="modern-card">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Դիմումների կառավարում
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Սպասման մեջ ({groupedApplications.pending.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Հաստատված ({groupedApplications.approved.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Մերժված ({groupedApplications.rejected.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {groupedApplications.pending.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Նոր դիմումներ չկան
              </div>
            ) : (
              groupedApplications.pending.map((application) => (
                <Card key={application.id} className="border border-warning-yellow/20">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {application.applicant_name?.charAt(0) || application.applicant_id.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{application.applicant_name || `User ${application.applicant_id.slice(0, 8)}`}</h4>
                            {getStatusBadge(application.status)}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}
                            </div>
                          </div>
                          
                          {application.cover_letter && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm font-medium">
                                <FileText className="h-3 w-3" />
                                Cover Letter
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {application.cover_letter}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedApplication(
                            selectedApplication === application.id ? null : application.id
                          )}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-success-green hover:bg-success-green/90"
                          onClick={() => handleStatusUpdate(application.id, 'approved')}
                          disabled={updateStatus.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Հաստատել
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusUpdate(application.id, 'rejected')}
                          disabled={updateStatus.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Մերժել
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive"
                              disabled={remove.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Ջնջե՞լ դիմումը</AlertDialogTitle>
                              <AlertDialogDescription>
                                Այս գործողությունը չի կարելի հետ գցել։ Դիմումը ընդմիշտ կջնջվի:
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Չեղարկել</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteApplication(application.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Ջնջել
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    
                    {selectedApplication === application.id && application.cover_letter && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <h5 className="font-medium mb-2">Full Cover Letter</h5>
                        <p className="text-sm whitespace-pre-wrap">{application.cover_letter}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {groupedApplications.approved.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Հաստատված դիմումներ չկան
              </div>
            ) : (
              groupedApplications.approved.map((application) => (
                <Card key={application.id} className="border border-success-green/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {application.applicant_name?.charAt(0) || application.applicant_id.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{application.applicant_name || `User ${application.applicant_id.slice(0, 8)}`}</h4>
                          <p className="text-sm text-muted-foreground">
                            Approved {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(application.status)}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive"
                              disabled={remove.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Ջնջե՞լ դիմումը</AlertDialogTitle>
                              <AlertDialogDescription>
                                Այս գործողությունը չի կարելի հետ գցել։ Դիմումը ընդմիշտ կջնջվի:
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Չեղարկել</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteApplication(application.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Ջնջել
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {groupedApplications.rejected.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Մերժված դիմումներ չկան
              </div>
            ) : (
              groupedApplications.rejected.map((application) => (
                <Card key={application.id} className="border border-destructive/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {application.applicant_name?.charAt(0) || application.applicant_id.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{application.applicant_name || `User ${application.applicant_id.slice(0, 8)}`}</h4>
                          <p className="text-sm text-muted-foreground">
                            Rejected {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(application.status)}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive"
                              disabled={remove.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Ջնջե՞լ դիմումը</AlertDialogTitle>
                              <AlertDialogDescription>
                                Այս գործողությունը չի կարելի հետ գցել։ Դիմումը ընդմիշտ կջնջվի:
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Չեղարկել</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteApplication(application.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Ջնջել
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApplicationManagement;