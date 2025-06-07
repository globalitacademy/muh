
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProfile } from '@/hooks/useUserProfile';
import { BookOpen, Users, BarChart3, MessageSquare, Settings, Home } from 'lucide-react';
import InstructorDashboardMain from '@/components/instructor/InstructorDashboardMain';
import InstructorCoursesTab from '@/components/instructor/InstructorCoursesTab';
import InstructorStudentsTab from '@/components/instructor/InstructorStudentsTab';
import InstructorAnalyticsTab from '@/components/instructor/InstructorAnalyticsTab';

const InstructorProfile = () => {
  const { data: profile, isLoading } = useUserProfile();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return <div className="animate-pulse font-armenian">Բեռնվում է...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-armenian">
            <BookOpen className="w-5 h-5" />
            Դասախոսի պրոֆիլ
          </CardTitle>
          <CardDescription className="font-armenian">
            Բարի գալուստ, {profile?.name || 'Դասախոս'}!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground font-armenian">Բաժին</p>
              <p className="font-semibold">{profile?.department || 'Նշված չէ'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-armenian">Կազմակերպություն</p>
              <p className="font-semibold">{profile?.organization || 'Նշված չէ'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-armenian">Հեռախոս</p>
              <p className="font-semibold">{profile?.phone || 'Նշված չէ'}</p>
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
          <TabsTrigger value="courses" className="font-armenian">
            <BookOpen className="w-4 h-4 mr-2" />
            Դասընթացներ
          </TabsTrigger>
          <TabsTrigger value="students" className="font-armenian">
            <Users className="w-4 h-4 mr-2" />
            Ուսանողներ
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
          <InstructorDashboardMain />
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <InstructorCoursesTab />
        </TabsContent>

        <TabsContent value="students" className="mt-6">
          <InstructorStudentsTab />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <InstructorAnalyticsTab />
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
          <Card>
            <CardHeader>
              <CardTitle className="font-armenian">Կարգավորումներ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-armenian">Կարգավորումների ֆունկցիան շուտով</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstructorProfile;
