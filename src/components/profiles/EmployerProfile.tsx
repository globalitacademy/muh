
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Building2, UserPlus, Search, FileText, MessageSquare, Settings, Users, BarChart3, Home, FolderKanban } from 'lucide-react';
import SettingsTab from '@/components/settings/SettingsTab';
import EmployerJobsTab from '@/components/employer/EmployerJobsTab';
import EmployerProjectsTab from '@/components/employer/EmployerProjectsTab';
import { EmployerCandidatesTab } from '@/components/employer/EmployerCandidatesTab';
import { useEmployerJobPostings, useEmployerApplications } from '@/hooks/useJobPostings';

const EmployerProfile = () => {
  const { data: profile, isLoading } = useUserProfile();
  const [activeTab, setActiveTab] = useState('dashboard');
  const { data: jobPostings = [], isLoading: jobsLoading } = useEmployerJobPostings();
  const { data: applications = [], isLoading: appsLoading } = useEmployerApplications();

  if (isLoading) {
    return <div className="animate-pulse font-armenian">Բեռնվում է...</div>;
  }

  return (
    <div className="space-y-8 min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Modern Profile Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-employer-primary/10 via-employer-secondary/5 to-employer-accent/5 animate-pulse" />
        <Card className="relative border-none shadow-xl bg-employer-card/90 backdrop-blur-sm hover:bg-employer-card-hover transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-employer-primary to-employer-secondary rounded-xl shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground font-armenian">
                    Գործատուի պրոֆիլ
                  </CardTitle>
                  <CardDescription className="text-lg font-armenian text-muted-foreground">
                    Բարի գալուստ, {profile?.name || 'Գործատու'}!
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-status-active/10 text-status-active border-status-active/20">
                <div className="w-2 h-2 bg-status-active rounded-full mr-2 animate-pulse" />
                Առցանց
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-gradient-to-br from-employer-info/10 to-employer-info/5 border border-employer-info/20 hover:border-employer-info/30 transition-colors duration-200">
                <p className="text-sm font-medium text-employer-info font-armenian mb-1">Կազմակերպություն</p>
                <p className="text-lg font-semibold text-employer-info">{profile?.organization || 'Նշված չէ'}</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-employer-secondary/10 to-employer-secondary/5 border border-employer-secondary/20 hover:border-employer-secondary/30 transition-colors duration-200">
                <p className="text-sm font-medium text-employer-secondary font-armenian mb-1">Բաժին</p>
                <p className="text-lg font-semibold text-employer-secondary">{profile?.department || 'Նշված չէ'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Tabs with Enhanced Design */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Card className="border-none shadow-lg bg-employer-card/60 backdrop-blur-sm">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto p-2 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg gap-1">
            <TabsTrigger 
              value="dashboard" 
              className="font-armenian data-[state=active]:bg-employer-primary data-[state=active]:text-white data-[state=active]:shadow-lg flex flex-col gap-1 h-16 transition-all duration-200 hover:bg-hover-muted"
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Գլխավոր</span>
            </TabsTrigger>
            <TabsTrigger 
              value="jobs" 
              className="font-armenian data-[state=active]:bg-employer-accent data-[state=active]:text-white data-[state=active]:shadow-lg flex flex-col gap-1 h-16 transition-all duration-200 hover:bg-hover-muted"
            >
              <UserPlus className="w-5 h-5" />
              <span className="text-xs">Հայտարարություններ</span>
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="font-armenian data-[state=active]:bg-employer-secondary data-[state=active]:text-white data-[state=active]:shadow-lg flex flex-col gap-1 h-16 transition-all duration-200 hover:bg-hover-muted"
            >
              <FolderKanban className="w-5 h-5" />
              <span className="text-xs">Նախագծեր</span>
            </TabsTrigger>
            <TabsTrigger 
              value="candidates" 
              className="font-armenian data-[state=active]:bg-employer-info data-[state=active]:text-white data-[state=active]:shadow-lg flex flex-col gap-1 h-16 transition-all duration-200 hover:bg-hover-muted"
            >
              <Search className="w-5 h-5" />
              <span className="text-xs">Թեկնածուներ</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="font-armenian data-[state=active]:bg-employer-success data-[state=active]:text-white data-[state=active]:shadow-lg flex flex-col gap-1 h-16 transition-all duration-200 hover:bg-hover-muted"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Վերլուծություն</span>
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="font-armenian data-[state=active]:bg-employer-primary data-[state=active]:text-white data-[state=active]:shadow-lg flex flex-col gap-1 h-16 transition-all duration-200 hover:bg-hover-muted"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs">Հաղորդագրություններ</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="font-armenian data-[state=active]:bg-muted-foreground data-[state=active]:text-white data-[state=active]:shadow-lg flex flex-col gap-1 h-16 transition-all duration-200 hover:bg-hover-muted"
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs">Կարգավորումներ</span>
            </TabsTrigger>
          </TabsList>
        </Card>

        <TabsContent value="dashboard" className="mt-8 space-y-8">
          {/* Modern Quick Actions */}
          <Card className="border-none shadow-xl bg-gradient-to-br from-employer-card to-employer-card/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="font-armenian text-xl text-foreground">
                Գործատուի գործողություններ
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Button
                className="group relative overflow-hidden h-auto p-6 font-armenian bg-gradient-to-br from-employer-primary to-employer-primary/80 hover:from-employer-primary/90 hover:to-employer-primary/70 border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-white"
                onClick={() => setActiveTab('jobs')}
                aria-label="Աշխատանք հայտարարել"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">Աշխատանք հայտարարել</p>
                    <p className="text-sm opacity-90">Նոր հայտարարություն ստեղծել</p>
                  </div>
                </div>
              </Button>
              
              <Button
                className="group relative overflow-hidden h-auto p-6 font-armenian bg-gradient-to-br from-employer-info to-employer-info/80 hover:from-employer-info/90 hover:to-employer-info/70 border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-white"
                onClick={() => setActiveTab('candidates')}
                aria-label="Դիտել թեկնածուներ"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Search className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">Թեկնածուներ</p>
                    <p className="text-sm opacity-90">Գտնել լավագույն թեկնածուներին</p>
                  </div>
                </div>
              </Button>
              
              <Button
                className="group relative overflow-hidden h-auto p-6 font-armenian bg-gradient-to-br from-employer-secondary to-employer-secondary/80 hover:from-employer-secondary/90 hover:to-employer-secondary/70 border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-white"
                onClick={() => setActiveTab('projects')}
                aria-label="Դիտել նախագծեր"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">Նախագծեր</p>
                    <p className="text-sm opacity-90">Կառավարել նախագծերը</p>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Modern Active Job Postings */}
          <Card className="border-none shadow-xl bg-gradient-to-br from-employer-card to-employer-card/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="font-armenian text-xl text-foreground">
                Ակտիվ հայտարարություններ
              </CardTitle>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-employer-primary"></div>
                  <span className="ml-3 text-muted-foreground font-armenian">Բեռնվում է...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobPostings.filter(p => p.is_active).slice(0, 5).map((p) => (
                    <div key={p.id} className="group relative overflow-hidden p-4 border border-border/50 rounded-xl bg-gradient-to-r from-background to-muted/20 hover:shadow-lg transition-all duration-300 hover:border-employer-primary/30">
                      <div className="absolute inset-0 bg-gradient-to-r from-employer-primary/5 to-employer-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg font-armenian group-hover:text-employer-primary transition-colors duration-200">{p.title}</h4>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge className="bg-employer-info/10 text-employer-info border-employer-info/20">
                              📍 {p.location || 'Տեղամաս նշված չէ'}
                            </Badge>
                            <Badge className="bg-employer-secondary/10 text-employer-secondary border-employer-secondary/20">
                              {p.posting_type === 'internship' ? '🎓 Պրակտիկա' : p.posting_type === 'project' ? '📁 Նախագիծ' : '💼 Աշխատանք'}
                            </Badge>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-status-active to-employer-success text-white border-none shadow-lg">
                          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                          Ակտիվ
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {jobPostings.filter(p => p.is_active).length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <UserPlus className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground font-armenian">Այս պահին ակտիվ հայտարարություններ չկան</p>
                      <Button 
                        className="mt-4 font-armenian bg-employer-primary hover:bg-employer-primary/90 text-white"
                        onClick={() => setActiveTab('jobs')}
                      >
                        Ստեղծել հայտարարություն
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modern Statistics */}
          <Card className="border-none shadow-xl bg-gradient-to-br from-employer-card to-employer-card/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="font-armenian text-xl text-foreground">
                Վիճակագրություն
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-employer-info/10 to-employer-info/5 border border-employer-info/20 hover:border-employer-info/30 transition-colors duration-200">
                  <div className="text-3xl font-bold text-employer-info">
                    {jobPostings.filter(p => p.is_active).length}
                  </div>
                  <p className="text-sm font-medium text-employer-info font-armenian mt-1">Ակտիվ հայտարարություններ</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-employer-secondary/10 to-employer-secondary/5 border border-employer-secondary/20 hover:border-employer-secondary/30 transition-colors duration-200">
                  <div className="text-3xl font-bold text-employer-secondary">
                    {applications.length}
                  </div>
                  <p className="text-sm font-medium text-employer-secondary font-armenian mt-1">Ընդհանուր դիմումներ</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-status-pending/10 to-status-pending/5 border border-status-pending/20 hover:border-status-pending/30 transition-colors duration-200">
                  <div className="text-3xl font-bold text-status-pending">
                    {applications.filter(a => a.status === 'pending').length}
                  </div>
                  <p className="text-sm font-medium text-status-pending font-armenian mt-1">Սպասում է</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-status-approved/10 to-status-approved/5 border border-status-approved/20 hover:border-status-approved/30 transition-colors duration-200">
                  <div className="text-3xl font-bold text-status-approved">
                    {applications.filter(a => a.status === 'accepted').length}
                  </div>
                  <p className="text-sm font-medium text-status-approved font-armenian mt-1">Ընդունված</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="mt-6">
          <EmployerJobsTab />
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <EmployerProjectsTab />
        </TabsContent>

        <TabsContent value="candidates" className="mt-6">
          <EmployerCandidatesTab />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-armenian">Վերլուծություն</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-armenian">Վերլուծության ֆունկցիան շուտով</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-armenian">Հաղորդագրություններ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-armenian">Հաղորդագրությունների ֆունկցիան շուտով</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployerProfile;
