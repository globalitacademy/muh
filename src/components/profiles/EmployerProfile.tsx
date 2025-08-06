
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Building2, UserPlus, Search, FileText, MessageSquare, Settings, Users, BarChart3, Home } from 'lucide-react';
import SettingsTab from '@/components/settings/SettingsTab';
import EmployerJobsTab from '@/components/employer/EmployerJobsTab';
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
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-armenian">
            <Building2 className="w-5 h-5" />
            Գործատուի պրոֆիլ
          </CardTitle>
          <CardDescription className="font-armenian">
            Բարի գալուստ, {profile?.name || 'Գործատու'}!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground font-armenian">Կազմակերպություն</p>
              <p className="font-semibold">{profile?.organization || 'Նշված չէ'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-armenian">Բաժին</p>
              <p className="font-semibold">{profile?.department || 'Նշված չէ'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="font-armenian">
            <Home className="w-4 h-4 mr-2" />
            Գլխավոր
          </TabsTrigger>
          <TabsTrigger value="jobs" className="font-armenian">
            <UserPlus className="w-4 h-4 mr-2" />
            Հայտարարություններ
          </TabsTrigger>
          <TabsTrigger value="candidates" className="font-armenian">
            <Search className="w-4 h-4 mr-2" />
            Թեկնածուներ
          </TabsTrigger>
          <TabsTrigger value="analytics" className="font-armenian">
            <BarChart3 className="w-4 h-4 mr-2" />
            Վերլուծություն
          </TabsTrigger>
          <TabsTrigger value="messages" className="font-armenian">
            <MessageSquare className="w-4 h-4 mr-2" />
            Հաղորդագրություններ
          </TabsTrigger>
          <TabsTrigger value="settings" className="font-armenian">
            <Settings className="w-4 h-4 mr-2" />
            Կարգավորումներ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-armenian">Գործատուի գործողություններ</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                className="flex items-center gap-2 h-auto p-4 font-armenian"
                variant="default"
                onClick={() => setActiveTab('jobs')}
                aria-label="Աշխատանք հայտարարել"
              >
                <UserPlus className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold">Աշխատանք հայտարարել</p>
                  <p className="text-xs opacity-90">Նոր հայտարարություն</p>
                </div>
              </Button>
              <Button
                className="flex items-center gap-2 h-auto p-4 font-armenian"
                variant="outline"
                onClick={() => setActiveTab('candidates')}
                aria-label="Դիտել թեկնածուներ"
              >
                <Search className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold">Թեկնածուներ</p>
                  <p className="text-xs text-muted-foreground">Գտնել թեկնածուներ</p>
                </div>
              </Button>
              <Button
                className="flex items-center gap-2 h-auto p-4 font-armenian"
                variant="outline"
                onClick={() => setActiveTab('candidates')}
                aria-label="Դիտել CV-ներ"
              >
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold">CV-ներ</p>
                  <p className="text-xs text-muted-foreground">Դիտել կենսագրությունները</p>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Active Job Postings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="font-armenian">Ակտիվ հայտարարություններ</CardTitle>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="text-sm text-muted-foreground font-armenian">Բեռնվում է...</div>
              ) : (
                <div className="space-y-3">
                  {jobPostings.filter(p => p.is_active).slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold font-armenian">{p.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {p.location || 'Տեղամաս նշված չէ'} • {p.posting_type === 'internship' ? 'Պրակտիկա' : p.posting_type === 'project' ? 'Նախագիծ' : 'Աշխատանք'}
                        </p>
                      </div>
                      <Badge variant="secondary">Ակտիվ</Badge>
                    </div>
                  ))}
                  {jobPostings.filter(p => p.is_active).length === 0 && (
                    <div className="text-sm text-muted-foreground font-armenian">Այս պահին ակտիվ հայտարարություններ չկան</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="font-armenian">Վիճակագրություն</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{jobPostings.filter(p => p.is_active).length}</p>
                  <p className="text-sm text-muted-foreground font-armenian">Ակտիվ հայտարարություններ</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{applications.length}</p>
                  <p className="text-sm text-muted-foreground font-armenian">Ընդհանուր դիմումներ</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{applications.filter(a => a.status === 'pending').length}</p>
                  <p className="text-sm text-muted-foreground font-armenian">Սպասում է</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{applications.filter(a => a.status === 'accepted').length}</p>
                  <p className="text-sm text-muted-foreground font-armenian">Ընդունված</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="mt-6">
          <EmployerJobsTab />
        </TabsContent>

        <TabsContent value="candidates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-armenian">Թեկնածուներ</CardTitle>
            </CardHeader>
            <CardContent>
              {appsLoading ? (
                <div className="text-sm text-muted-foreground font-armenian">Բեռնվում է...</div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-armenian">Դեռևս դիմումներ չկան</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 10).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold font-armenian">{app.profiles?.name || 'Անուն չի նշված'}</p>
                        <p className="text-sm text-muted-foreground">{app.job_postings?.title}</p>
                      </div>
                      <Badge variant={app.status === 'accepted' ? 'default' : app.status === 'pending' ? 'secondary' : 'outline'}>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
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
