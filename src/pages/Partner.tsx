import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, BookOpen, Settings } from 'lucide-react';
import PartnerInstitutionTab from '@/components/partner/PartnerInstitutionTab';
import PartnerCoursesTab from '@/components/partner/PartnerCoursesTab';
import PartnerStudentsTab from '@/components/partner/PartnerStudentsTab';
import PartnerSettingsTab from '@/components/partner/PartnerSettingsTab';

export default function Partner() {
  const { user } = useAuth();
  const { data: userRole, isLoading } = useUserRole();
  const [activeTab, setActiveTab] = useState('institution');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (userRole !== 'partner') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Գործընկեր վահանակ
          </h1>
          <p className="text-muted-foreground">
            Կառավարեք ձեր կրթական հաստատությունը և մասնավոր դասընթացները
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="institution" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Հաստատություն
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Դասընթացներ
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Ուսանողներ
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Կարգավորումներ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="institution" className="mt-6">
            <PartnerInstitutionTab />
          </TabsContent>

          <TabsContent value="courses" className="mt-6">
            <PartnerCoursesTab />
          </TabsContent>

          <TabsContent value="students" className="mt-6">
            <PartnerStudentsTab />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <PartnerSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}