
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, User, Shield, GraduationCap } from 'lucide-react';
import AdminInstructorsTab from './users/AdminInstructorsTab';
import AdminStudentsTab from './users/AdminStudentsTab';
import AdminPermissionsTab from './users/AdminPermissionsTab';

const AdminUsersTab = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-armenian text-gradient">Օգտատերերի կառավարում</h2>
            <p className="text-muted-foreground font-armenian">Կառավարեք բոլոր օգտատերերի դերերը և կարգավիճակները</p>
          </div>
        </div>
      </div>

      {/* User Management Tabs */}
      <div className="glass-card rounded-2xl p-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Tabs defaultValue="instructors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="instructors" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
              <GraduationCap className="w-4 h-4 mr-2" />
              Դասախոսներ
            </TabsTrigger>
            <TabsTrigger value="students" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
              <User className="w-4 h-4 mr-2" />
              Ուսանողներ
            </TabsTrigger>
            <TabsTrigger value="permissions" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
              <Shield className="w-4 h-4 mr-2" />
              Իրավասություններ
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[600px]">
            <TabsContent value="instructors" className="mt-6">
              <AdminInstructorsTab />
            </TabsContent>

            <TabsContent value="students" className="mt-6">
              <AdminStudentsTab />
            </TabsContent>

            <TabsContent value="permissions" className="mt-6">
              <AdminPermissionsTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminUsersTab;
