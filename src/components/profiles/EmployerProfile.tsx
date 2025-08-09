
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
    <div className="space-y-8 min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Modern Profile Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 animate-pulse" />
        <Card className="relative border-none shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                  <Building2 className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-armenian">
                    Գործատուի պրոֆիլ
                  </CardTitle>
                  <CardDescription className="text-lg font-armenian text-muted-foreground">
                    Բարի գալուստ, {profile?.name || 'Գործատու'}!
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Առցանց
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <p className="text-sm font-medium text-blue-600 font-armenian mb-1">Կազմակերպություն</p>
                <p className="text-lg font-semibold text-blue-900">{profile?.organization || 'Նշված չէ'}</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                <p className="text-sm font-medium text-purple-600 font-armenian mb-1">Բաժին</p>
                <p className="text-lg font-semibold text-purple-900">{profile?.department || 'Նշված չէ'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Tabs with Enhanced Design */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
          <TabsList className="grid w-full grid-cols-7 h-auto p-2 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg">
            <TabsTrigger 
              value="dashboard" 
              className="font-armenian data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg flex flex-col gap-1 h-16 transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Գլխավոր</span>
            </TabsTrigger>
            <TabsTrigger 
              value="jobs" 
              className="font-armenian data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg flex flex-col gap-1 h-16 transition-all duration-200"
            >
              <UserPlus className="w-5 h-5" />
              <span className="text-xs">Հայտարարություններ</span>
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="font-armenian data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg flex flex-col gap-1 h-16 transition-all duration-200"
            >
              <FolderKanban className="w-5 h-5" />
              <span className="text-xs">Նախագծեր</span>
            </TabsTrigger>
            <TabsTrigger 
              value="candidates" 
              className="font-armenian data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg flex flex-col gap-1 h-16 transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              <span className="text-xs">Թեկնածուներ</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="font-armenian data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg flex flex-col gap-1 h-16 transition-all duration-200"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Վերլուծություն</span>
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="font-armenian data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg flex flex-col gap-1 h-16 transition-all duration-200"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs">Հաղորդագրություններ</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="font-armenian data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg flex flex-col gap-1 h-16 transition-all duration-200"
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs">Կարգավորումներ</span>
            </TabsTrigger>
          </TabsList>
        </Card>

        <TabsContent value="dashboard" className="mt-8 space-y-8">
          {/* Modern Quick Actions */}
          <Card className="border-none shadow-xl bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="font-armenian text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Գործատուի գործողություններ
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Button
                className="group relative overflow-hidden h-auto p-6 font-armenian bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
                className="group relative overflow-hidden h-auto p-6 font-armenian bg-gradient-to-br from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
                className="group relative overflow-hidden h-auto p-6 font-armenian bg-gradient-to-br from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
          <Card className="border-none shadow-xl bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="font-armenian text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Ակտիվ հայտարարություններ
              </CardTitle>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-3 text-muted-foreground font-armenian">Բեռնվում է...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobPostings.filter(p => p.is_active).slice(0, 5).map((p) => (
                    <div key={p.id} className="group relative overflow-hidden p-4 border border-border/50 rounded-xl bg-gradient-to-r from-background to-muted/20 hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg font-armenian group-hover:text-primary transition-colors duration-200">{p.title}</h4>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              📍 {p.location || 'Տեղամաս նշված չէ'}
                            </Badge>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {p.posting_type === 'internship' ? '🎓 Պրակտիկա' : p.posting_type === 'project' ? '📁 Նախագիծ' : '💼 Աշխատանք'}
                            </Badge>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none shadow-lg">
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
                        variant="outline" 
                        className="mt-4 font-armenian"
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
          <Card className="border-none shadow-xl bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="font-armenian text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Վիճակագրություն
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                  <div className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {jobPostings.filter(p => p.is_active).length}
                  </div>
                  <p className="text-sm font-medium text-blue-600 font-armenian mt-1">Ակտիվ հայտարարություններ</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                  <div className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {applications.length}
                  </div>
                  <p className="text-sm font-medium text-purple-600 font-armenian mt-1">Ընդհանուր դիմումներ</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100">
                  <div className="text-3xl font-bold bg-gradient-to-br from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {applications.filter(a => a.status === 'pending').length}
                  </div>
                  <p className="text-sm font-medium text-yellow-600 font-armenian mt-1">Սպասում է</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                  <div className="text-3xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {applications.filter(a => a.status === 'accepted').length}
                  </div>
                  <p className="text-sm font-medium text-green-600 font-armenian mt-1">Ընդունված</p>
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
