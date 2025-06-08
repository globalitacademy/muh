
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users, User, Shield, GraduationCap, Building2, UserPlus } from 'lucide-react';
import EnhancedAdminInstructorsTab from './users/EnhancedAdminInstructorsTab';
import EnhancedAdminStudentsTab from './users/EnhancedAdminStudentsTab';
import AdminEmployersTab from './users/AdminEmployersTab';
import AdminPermissionsTab from './users/AdminPermissionsTab';
import AddStudentForm from './users/AddStudentForm';
import AddEmployerForm from './users/AddEmployerForm';

const AdminUsersTab = () => {
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddEmployerModalOpen, setIsAddEmployerModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-armenian text-gradient">Օգտատերերի կառավարում</h2>
              <p className="text-muted-foreground font-armenian">Կառավարեք բոլոր օգտատերերի դերերը և կարգավիճակները</p>
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

      {/* User Management Tabs */}
      <div className="glass-card rounded-2xl p-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Tabs defaultValue="instructors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="instructors" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
              <GraduationCap className="w-4 h-4 mr-2" />
              Դասախոսներ
            </TabsTrigger>
            <TabsTrigger value="students" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
              <User className="w-4 h-4 mr-2" />
              Ուսանողներ
            </TabsTrigger>
            <TabsTrigger value="employers" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
              <Building2 className="w-4 h-4 mr-2" />
              Գործատուներ
            </TabsTrigger>
            <TabsTrigger value="permissions" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
              <Shield className="w-4 h-4 mr-2" />
              Իրավասություններ
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[600px]">
            <TabsContent value="instructors" className="mt-6">
              <EnhancedAdminInstructorsTab />
            </TabsContent>

            <TabsContent value="students" className="mt-6">
              <EnhancedAdminStudentsTab />
            </TabsContent>

            <TabsContent value="employers" className="mt-6">
              <AdminEmployersTab />
            </TabsContent>

            <TabsContent value="permissions" className="mt-6">
              <AdminPermissionsTab />
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
    </div>
  );
};

export default AdminUsersTab;
