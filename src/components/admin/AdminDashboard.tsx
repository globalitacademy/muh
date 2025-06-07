
import React from 'react';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, Settings, BarChart3 } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import AdminModulesTab from './AdminModulesTab';
import AdminUsersTab from './AdminUsersTab';

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-armenian">Ադմինիստրատորի կառավարման վահանակ</h1>
          <p className="text-muted-foreground font-armenian">
            Կառավարեք համակարգի բոլոր բաղադրիչները
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ընդամենը մոդուլներ</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ընդամենը օգտատերեր</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">347</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ակտիվ դասընթացներ</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Համակարգի կարգավիճակ</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Ակտիվ</div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="modules" className="font-armenian">Մոդուլների կառավարում</TabsTrigger>
          <TabsTrigger value="users" className="font-armenian">Օգտատերերի կառավարում</TabsTrigger>
          <TabsTrigger value="settings" className="font-armenian">Համակարգի կարգավորումներ</TabsTrigger>
        </TabsList>

        <TabsContent value="modules">
          <AdminModulesTab />
        </TabsContent>

        <TabsContent value="users">
          <AdminUsersTab />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="font-armenian">Համակարգի կարգավորումներ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground font-armenian">
                Համակարգի կարգավորումների բաժինը մշակման փուլում է:
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
