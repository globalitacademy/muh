
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, User, Shield, GraduationCap, Building2, Building } from 'lucide-react';
import EnhancedAdminInstructorsTab from './users/EnhancedAdminInstructorsTab';
import EnhancedAdminStudentsTab from './users/EnhancedAdminStudentsTab';
import AdminEmployersTab from './users/AdminEmployersTab';
import AdminPartnersTab from './users/AdminPartnersTab';
import AdminPermissionsTab from './users/AdminPermissionsTab';

const AdminUsersTab = () => {
  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-0">
      {/* Header */}
      <div className="glass-card rounded-2xl p-4 md:p-6 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-armenian text-gradient">Օգտատերերի կառավարում</h2>
            <p className="text-sm md:text-base text-muted-foreground font-armenian">Կառավարեք բոլոր օգտատերերի դերերը և կարգավիճակները</p>
          </div>
        </div>
      </div>

      {/* User Management Tabs */}
      <div className="glass-card rounded-2xl p-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Tabs defaultValue="instructors" className="space-y-4 md:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-muted/50 p-1 rounded-xl min-w-max lg:min-w-0">
              <TabsTrigger value="instructors" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all text-xs sm:text-sm whitespace-nowrap">
                <GraduationCap className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Դասախոսներ</span>
                <span className="sm:hidden">Դասախ.</span>
              </TabsTrigger>
              <TabsTrigger value="students" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all text-xs sm:text-sm whitespace-nowrap">
                <User className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Ուսանողներ</span>
                <span className="sm:hidden">Ուսան.</span>
              </TabsTrigger>
              <TabsTrigger value="employers" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all text-xs sm:text-sm whitespace-nowrap">
                <Building2 className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Գործատուներ</span>
                <span className="sm:hidden">Գործ.</span>
              </TabsTrigger>
              <TabsTrigger value="partners" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all text-xs sm:text-sm whitespace-nowrap">
                <Building className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Գործընկերներ</span>
                <span className="sm:hidden">Գործընկ.</span>
              </TabsTrigger>
              <TabsTrigger value="permissions" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all text-xs sm:text-sm whitespace-nowrap">
                <Shield className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Իրավասություններ</span>
                <span className="sm:hidden">Իրավ.</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="min-h-[400px] md:min-h-[600px]">
            <TabsContent value="instructors" className="mt-4 md:mt-6">
              <EnhancedAdminInstructorsTab />
            </TabsContent>

            <TabsContent value="students" className="mt-4 md:mt-6">
              <EnhancedAdminStudentsTab />
            </TabsContent>

            <TabsContent value="employers" className="mt-4 md:mt-6">
              <AdminEmployersTab />
            </TabsContent>

            <TabsContent value="partners" className="mt-4 md:mt-6">
              <AdminPartnersTab />
            </TabsContent>

            <TabsContent value="permissions" className="mt-4 md:mt-6">
              <AdminPermissionsTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminUsersTab;
