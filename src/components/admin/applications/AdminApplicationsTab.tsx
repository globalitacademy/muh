
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Check, X, Eye, Clock, Users, GraduationCap, Building2 } from 'lucide-react';
import { useUserApplications, useApproveApplication, useRejectApplication, UserApplication } from '@/hooks/useUserApplications';
import { format } from 'date-fns';
import AddStudentForm from '../users/AddStudentForm';
import AddEmployerForm from '../users/AddEmployerForm';

const AdminApplicationsTab = () => {
  const { data: applications, isLoading } = useUserApplications();
  const approveApplication = useApproveApplication();
  const rejectApplication = useRejectApplication();
  
  const [selectedApplication, setSelectedApplication] = useState<UserApplication | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddEmployerModalOpen, setIsAddEmployerModalOpen] = useState(false);

  const handleApprove = (applicationId: string) => {
    approveApplication.mutate({ applicationId });
  };

  const handleReject = () => {
    if (selectedApplication) {
      rejectApplication.mutate({
        applicationId: selectedApplication.id,
        reason: rejectionReason.trim() || undefined,
      });
      setIsRejectModalOpen(false);
      setSelectedApplication(null);
      setRejectionReason('');
    }
  };

  const openRejectModal = (application: UserApplication) => {
    setSelectedApplication(application);
    setIsRejectModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="font-armenian"><Clock className="w-3 h-3 mr-1" />Ենթակա է</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500 font-armenian"><Check className="w-3 h-3 mr-1" />Հաստատված</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="font-armenian"><X className="w-3 h-3 mr-1" />Մերժված</Badge>;
      default:
        return <Badge variant="outline" className="font-armenian">{status}</Badge>;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return <Users className="w-4 h-4" />;
      case 'instructor':
        return <GraduationCap className="w-4 h-4" />;
      case 'employer':
        return <Building2 className="w-4 h-4" />;
      default:
        return <UserPlus className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'student':
        return 'Ուսանող';
      case 'instructor':
        return 'Դասախոս';
      case 'employer':
        return 'Գործատու';
      case 'admin':
        return 'Ադմին';
      default:
        return role;
    }
  };

  const filterApplicationsByRole = (role: string) => {
    return applications?.filter(app => app.role === role) || [];
  };

  const pendingCount = applications?.filter(app => app.status === 'pending').length || 0;
  const approvedCount = applications?.filter(app => app.status === 'approved').length || 0;
  const rejectedCount = applications?.filter(app => app.status === 'rejected').length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-edu-blue"></div>
      </div>
    );
  }

  const ApplicationsTable = ({ applications }: { applications: UserApplication[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-armenian">Անուն</TableHead>
          <TableHead className="font-armenian">Էլ. փոստ</TableHead>
          <TableHead className="font-armenian">Հեռախոս</TableHead>
          <TableHead className="font-armenian">Կազմակերպություն</TableHead>
          <TableHead className="font-armenian">Դերակատարում</TableHead>
          <TableHead className="font-armenian">Կարգավիճակ</TableHead>
          <TableHead className="font-armenian">Ամսաթիվ</TableHead>
          <TableHead className="font-armenian">Գործողություններ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <TableRow key={application.id}>
            <TableCell className="font-medium font-armenian">{application.name}</TableCell>
            <TableCell>{application.email}</TableCell>
            <TableCell>{application.phone || '-'}</TableCell>
            <TableCell className="font-armenian">{application.organization || '-'}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2 font-armenian">
                {getRoleIcon(application.role)}
                {getRoleLabel(application.role)}
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(application.status)}</TableCell>
            <TableCell>{format(new Date(application.created_at), 'dd/MM/yyyy')}</TableCell>
            <TableCell>
              {application.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => handleApprove(application.id)}
                    disabled={approveApplication.isPending}
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => openRejectModal(application)}
                    disabled={rejectApplication.isPending}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
              {application.status !== 'pending' && (
                <Button size="sm" variant="outline">
                  <Eye className="w-3 h-3" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-armenian text-gradient">Գրանցման դիմումներ</h2>
              <p className="text-muted-foreground font-armenian">Կառավարեք նոր օգտատերերի գրանցման հայտերը</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsAddStudentModalOpen(true)}
              className="font-armenian"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Ավելացնել ուսանող
            </Button>
            <Button 
              onClick={() => setIsAddEmployerModalOpen(true)}
              className="font-armenian"
              variant="outline"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Ավելացնել գործատու
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-armenian text-orange-600">Սպասող դիմումներ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-armenian text-green-600">Հաստատված</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-armenian text-red-600">Մերժված</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Applications by Role */}
      <div className="glass-card rounded-2xl p-2 animate-fade-in-up">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="all" className="font-armenian data-[state=active]:bg-background">
              Բոլորը
            </TabsTrigger>
            <TabsTrigger value="pending" className="font-armenian data-[state=active]:bg-background">
              Սպասող
            </TabsTrigger>
            <TabsTrigger value="students" className="font-armenian data-[state=active]:bg-background">
              Ուսանողներ
            </TabsTrigger>
            <TabsTrigger value="instructors" className="font-armenian data-[state=active]:bg-background">
              Դասախոսներ
            </TabsTrigger>
            <TabsTrigger value="employers" className="font-armenian data-[state=active]:bg-background">
              Գործատուներ
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[400px]">
            <TabsContent value="all" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-armenian">Բոլոր դիմումները</CardTitle>
                  <CardDescription className="font-armenian">
                    Ցուցակում {applications?.length || 0} դիմում
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ApplicationsTable applications={applications || []} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-armenian">Սպասող դիմումներ</CardTitle>
                  <CardDescription className="font-armenian">
                    Քննարկման սպասող {pendingCount} դիմում
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ApplicationsTable applications={applications?.filter(app => app.status === 'pending') || []} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-armenian">Ուսանողների դիմումներ</CardTitle>
                  <CardDescription className="font-armenian">
                    Ուսանող դառնալու {filterApplicationsByRole('student').length} դիմում
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ApplicationsTable applications={filterApplicationsByRole('student')} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instructors" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-armenian">Դասախոսների դիմումներ</CardTitle>
                  <CardDescription className="font-armenian">
                    Դասախոս դառնալու {filterApplicationsByRole('instructor').length} դիմում
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ApplicationsTable applications={filterApplicationsByRole('instructor')} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employers" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-armenian">Գործատուների դիմումներ</CardTitle>
                  <CardDescription className="font-armenian">
                    Գործատու դառնալու {filterApplicationsByRole('employer').length} դիմում
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ApplicationsTable applications={filterApplicationsByRole('employer')} />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Add Student Modal */}
      <Dialog open={isAddStudentModalOpen} onOpenChange={setIsAddStudentModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-armenian">Ուսանող ավելացնել</DialogTitle>
          </DialogHeader>
          <AddStudentForm onSuccess={() => setIsAddStudentModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Add Employer Modal */}
      <Dialog open={isAddEmployerModalOpen} onOpenChange={setIsAddEmployerModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-armenian">Գործատու ավելացնել</DialogTitle>
          </DialogHeader>
          <AddEmployerForm onSuccess={() => setIsAddEmployerModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-armenian">Մերժել դիմումը</DialogTitle>
            <DialogDescription className="font-armenian">
              Ցանկանու՞մ եք մերժել {selectedApplication?.name}-ի դիմումը։
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium font-armenian">Մերժման պատճառ (ոչ պարտադիր)</label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Նշեք մերժման պատճառը..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)} className="font-armenian">
              Չեղարկել
            </Button>
            <Button variant="destructive" onClick={handleReject} className="font-armenian">
              Մերժել
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApplicationsTab;
