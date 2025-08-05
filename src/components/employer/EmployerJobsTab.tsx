import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Briefcase, Users, BarChart3 } from 'lucide-react';
import JobPostingForm from './JobPostingForm';
import JobPostingsList from './JobPostingsList';
import { useEmployerJobPostings, useEmployerApplications } from '@/hooks/useJobPostings';

const EmployerJobsTab = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: jobPostings } = useEmployerJobPostings();
  const { data: applications } = useEmployerApplications();

  const activePostings = jobPostings?.filter(p => p.is_active).length || 0;
  const totalApplications = applications?.length || 0;
  const pendingApplications = applications?.filter(a => a.status === 'pending').length || 0;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-armenian">Ակտիվ առաջարկներ</p>
                <p className="text-2xl font-bold">{activePostings}</p>
              </div>
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-armenian">Ընդհանուր դիմումներ</p>
                <p className="text-2xl font-bold">{totalApplications}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-armenian">Նոր դիմումներ</p>
                <p className="text-2xl font-bold">{pendingApplications}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-armenian">Աշխատանքի առաջարկներ</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-armenian">
              <Plus className="w-4 h-4 mr-2" />
              Նոր առաջարկ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-armenian">Նոր առաջարկ ստեղծել</DialogTitle>
            </DialogHeader>
            <JobPostingForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="postings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="postings" className="font-armenian">Իմ առաջարկները</TabsTrigger>
          <TabsTrigger value="applications" className="font-armenian">Դիմումներ</TabsTrigger>
        </TabsList>

        <TabsContent value="postings">
          <JobPostingsList />
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle className="font-armenian">Ստացված դիմումներ</CardTitle>
            </CardHeader>
            <CardContent>
              {!applications || applications.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold font-armenian mb-2">Դեռ դիմումներ չկան</h3>
                  <p className="text-muted-foreground font-armenian">
                    Ուսանողները դեռ չեն դիմել ձեր առաջարկներին
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{application.profiles?.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {application.job_postings?.title}
                          </p>
                        </div>
                        <Badge variant={
                          application.status === 'pending' ? 'secondary' :
                          application.status === 'accepted' ? 'default' :
                          application.status === 'rejected' ? 'destructive' :
                          'outline'
                        }>
                          {application.status === 'pending' ? 'Սպասվող' :
                           application.status === 'accepted' ? 'Ընդունված' :
                           application.status === 'rejected' ? 'Մերժված' :
                           'Դիտված'}
                        </Badge>
                      </div>
                      
                      {application.cover_letter && (
                        <p className="text-sm">{application.cover_letter}</p>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="font-armenian">
                          Ընդունել
                        </Button>
                        <Button size="sm" variant="outline" className="font-armenian">
                          Մերժել
                        </Button>
                      </div>
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

export default EmployerJobsTab;