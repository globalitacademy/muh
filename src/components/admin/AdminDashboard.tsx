
import React from 'react';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, Settings, BarChart3, Activity, FileText, Shield, GraduationCap } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import AdminModulesTab from './AdminModulesTab';
import AdminUsersTab from './AdminUsersTab';
import AdminSettingsTab from './AdminSettingsTab';
import AdminAnalyticsTab from './AdminAnalyticsTab';
import AdminReportsTab from './AdminReportsTab';
import AdminLogsTab from './AdminLogsTab';
import AdminUserActivityTab from './AdminUserActivityTab';
import AdminCurriculumTab from './curriculum/AdminCurriculumTab';

const AdminDashboard = () => {
  const { data: isAdmin, isLoading, error } = useAdminRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-destructive mb-2 font-armenian">Մուտքի սխալ</h2>
        <p className="text-muted-foreground font-armenian">
          Դուք չունեք ադմինիստրատորի թույլտվություններ
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-edu-blue/10 to-edu-orange/10 rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-edu-orange/10 to-edu-blue/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative z-10 space-y-8 p-6">
        {/* Header */}
        <div className="glass-card rounded-2xl p-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gradient font-armenian mb-2">
                Ադմինիստրատորի կառավարման վահանակ
              </h1>
              <p className="text-muted-foreground font-armenian text-lg">
                Կառավարեք համակարգի բոլոր բաղադրիչները
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-edu-blue to-edu-orange rounded-2xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="modern-card course-card-hover rounded-2xl overflow-hidden">
            <div className="gradient-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">12</div>
                  <div className="text-white/80 font-armenian text-sm">Ընդամենը մոդուլներ</div>
                </div>
              </div>
            </div>
          </div>

          <div className="modern-card course-card-hover rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-edu-orange to-warning-yellow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">347</div>
                  <div className="text-white/80 font-armenian text-sm">Ընդամենը օգտատերեր</div>
                </div>
              </div>
            </div>
          </div>

          <div className="modern-card course-card-hover rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-success-green to-edu-blue p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">8</div>
                  <div className="text-white/80 font-armenian text-sm">Ակտիվ դասընթացներ</div>
                </div>
              </div>
            </div>
          </div>

          <div className="modern-card course-card-hover rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-edu-dark-blue to-edu-light-blue p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">Ակտիվ</div>
                  <div className="text-white/80 font-armenian text-sm">Համակարգի կարգավիճակ</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Tabs */}
        <div className="glass-card rounded-2xl p-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Tabs defaultValue="modules" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="modules" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
                <BookOpen className="w-4 h-4 mr-2" />
                Մոդուլներ
              </TabsTrigger>
              <TabsTrigger value="curriculum" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
                <GraduationCap className="w-4 h-4 mr-2" />
                Ծրագրեր
              </TabsTrigger>
              <TabsTrigger value="users" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
                <Users className="w-4 h-4 mr-2" />
                Օգտատերեր
              </TabsTrigger>
              <TabsTrigger value="analytics" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
                <BarChart3 className="w-4 h-4 mr-2" />
                Վերլուծություն
              </TabsTrigger>
              <TabsTrigger value="reports" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
                <FileText className="w-4 h-4 mr-2" />
                Հաշվետվություններ
              </TabsTrigger>
              <TabsTrigger value="logs" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
                <Activity className="w-4 h-4 mr-2" />
                Մատյաններ
              </TabsTrigger>
              <TabsTrigger value="activity" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
                <Users className="w-4 h-4 mr-2" />
                Գործունեություն
              </TabsTrigger>
              <TabsTrigger value="settings" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
                <Settings className="w-4 h-4 mr-2" />
                Կարգավորումներ
              </TabsTrigger>
            </TabsList>

            <div className="min-h-[600px]">
              <TabsContent value="modules" className="mt-6">
                <AdminModulesTab />
              </TabsContent>

              <TabsContent value="curriculum" className="mt-6">
                <AdminCurriculumTab />
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <AdminUsersTab />
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <AdminAnalyticsTab />
              </TabsContent>

              <TabsContent value="reports" className="mt-6">
                <AdminReportsTab />
              </TabsContent>

              <TabsContent value="logs" className="mt-6">
                <AdminLogsTab />
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <AdminUserActivityTab />
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <AdminSettingsTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
