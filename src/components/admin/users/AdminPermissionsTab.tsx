
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, User, Settings, Plus, Edit, Eye, Clock, AlertTriangle } from 'lucide-react';

const AdminPermissionsTab = () => {
  const [selectedRole, setSelectedRole] = useState('admin');

  // Mock roles and permissions data
  const roles = [
    {
      id: 'admin',
      name: 'Ադմինիստրատոր',
      description: 'Լիարժեք մուտք բոլոր գործառույթներին',
      userCount: 3,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'instructor',
      name: 'Դասախոս',
      description: 'Դասընթացների և ուսանողների կառավարում',
      userCount: 12,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'student',
      name: 'Ուսանող',
      description: 'Դասընթացների նյութերի դիտում',
      userCount: 347,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'employer',
      name: 'Գործատու',
      description: 'Աշխատանքի հայտարարությունների կառավարում',
      userCount: 8,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const permissions = [
    {
      category: 'Օգտատերերի կառավարում',
      items: [
        { id: 'users_view', name: 'Օգտատերերի դիտում', admin: true, instructor: false, student: false, employer: false },
        { id: 'users_create', name: 'Օգտատերերի ստեղծում', admin: true, instructor: false, student: false, employer: false },
        { id: 'users_edit', name: 'Օգտատերերի խմբագրում', admin: true, instructor: false, student: false, employer: false },
        { id: 'users_delete', name: 'Օգտատերերի ջնջում', admin: true, instructor: false, student: false, employer: false }
      ]
    },
    {
      category: 'Դասընթացների կառավարում',
      items: [
        { id: 'courses_view', name: 'Դասընթացների դիտում', admin: true, instructor: true, student: true, employer: false },
        { id: 'courses_create', name: 'Դասընթացների ստեղծում', admin: true, instructor: true, student: false, employer: false },
        { id: 'courses_edit', name: 'Դասընթացների խմբագրում', admin: true, instructor: true, student: false, employer: false },
        { id: 'courses_delete', name: 'Դասընթացների ջնջում', admin: true, instructor: false, student: false, employer: false }
      ]
    },
    {
      category: 'Գնահատական',
      items: [
        { id: 'grades_view', name: 'Գնահատականների դիտում', admin: true, instructor: true, student: true, employer: false },
        { id: 'grades_edit', name: 'Գնահատականների խմբագրում', admin: true, instructor: true, student: false, employer: false }
      ]
    },
    {
      category: 'Աշխատանքի հայտարարություններ',
      items: [
        { id: 'jobs_view', name: 'Հայտարարությունների դիտում', admin: true, instructor: false, student: true, employer: true },
        { id: 'jobs_create', name: 'Հայտարարությունների ստեղծում', admin: true, instructor: false, student: false, employer: true },
        { id: 'jobs_edit', name: 'Հայտարարությունների խմբագրում', admin: true, instructor: false, student: false, employer: true }
      ]
    }
  ];

  const auditLogs = [
    {
      id: '1',
      user: 'Արամ Ավետիսյան',
      action: 'Ուսանողի ջնջում',
      target: 'mari.karapetyan@example.com',
      timestamp: '2024-01-16 14:30:25',
      status: 'success'
    },
    {
      id: '2',
      user: 'Մարիամ Գրիգորյան',
      action: 'Դասընթացի ստեղծում',
      target: 'React Advanced',
      timestamp: '2024-01-16 13:15:10',
      status: 'success'
    },
    {
      id: '3',
      user: 'Ադմին',
      action: 'Դերի փոփոխություն',
      target: 'davit.hakobyan@example.com',
      timestamp: '2024-01-16 12:45:33',
      status: 'failed'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold font-armenian">Իրավասություններ և դերեր</h3>
          <p className="text-muted-foreground font-armenian">Կառավարեք օգտատերերի մուտքի իրավասությունները</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="font-armenian btn-modern">
              <Plus className="w-4 h-4 mr-2" />
              Նոր դեր
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-armenian">Նոր դեր ստեղծել</DialogTitle>
            </DialogHeader>
            <div className="text-center py-8">
              <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="font-armenian text-muted-foreground">Դերի ստեղծման ձևաթուղթ</p>
              <p className="text-sm text-muted-foreground">Մշակման փուլում</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="lg:col-span-1">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Դերեր
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedRole === role.id 
                      ? 'bg-gradient-to-r ' + role.color + ' text-white shadow-lg transform scale-105' 
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold font-armenian">{role.name}</h4>
                      <p className={`text-sm ${selectedRole === role.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {role.description}
                      </p>
                    </div>
                    <Badge variant={selectedRole === role.id ? 'secondary' : 'outline'} className="ml-2">
                      {role.userCount}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="modern-card mt-6">
            <CardHeader>
              <CardTitle className="font-armenian flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Վերջին գործողություններ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-3 bg-muted/20 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">{log.user}</span>
                    <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className="text-xs">
                      {log.status === 'success' ? 'Հաջողված' : 'Ձախողված'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-armenian">{log.action}</p>
                  <p className="text-xs text-muted-foreground">{log.target}</p>
                  <p className="text-xs text-muted-foreground mt-1">{log.timestamp}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Permissions Matrix */}
        <div className="lg:col-span-2">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Իրավասություններ - {roles.find(r => r.id === selectedRole)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {permissions.map((category) => (
                  <div key={category.category}>
                    <h4 className="font-semibold font-armenian mb-3 pb-2 border-b">
                      {category.category}
                    </h4>
                    <div className="space-y-3">
                      {category.items.map((permission) => (
                        <div key={permission.id} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                          <span className="font-armenian">{permission.name}</span>
                          <Switch
                            checked={permission[selectedRole as keyof typeof permission] as boolean}
                            disabled
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPermissionsTab;
