
import React from 'react';
import { useAdminUsers, useUpdateUserRole } from '@/hooks/useAdminUsers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, User } from 'lucide-react';

const AdminUsersTab = () => {
  const { data: users, isLoading } = useAdminUsers();
  const updateUserRole = useUpdateUserRole();

  const handleRoleChange = async (userId: string, newRole: string) => {
    await updateUserRole.mutateAsync({ userId, role: newRole });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'instructor':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      case 'employer':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-armenian">Օգտատերերի կառավարում</h2>
        <Badge variant="outline" className="font-armenian">
          Ընդամենը: {users?.length || 0} օգտատեր
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {users?.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold font-armenian">
                      {user.name || 'Անանուն օգտատեր'}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-2">ID: {user.id}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium font-armenian">Կազմակերպություն:</span>{' '}
                        {user.organization || 'Նշված չէ'}
                      </div>
                      <div>
                        <span className="font-medium font-armenian">Խումբ:</span>{' '}
                        {user.group_number || 'Նշված չէ'}
                      </div>
                      <div>
                        <span className="font-medium font-armenian">Գրանցման ամսաթիվ:</span>{' '}
                        {new Date(user.created_at).toLocaleDateString('hy-AM')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role === 'admin' && 'Ադմինիստրատոր'}
                    {user.role === 'instructor' && 'Դասախոս'}
                    {user.role === 'student' && 'Ուսանող'}
                    {user.role === 'employer' && 'Գործատու'}
                  </Badge>
                  <Select 
                    value={user.role} 
                    onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                    disabled={updateUserRole.isPending}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Ուսանող</SelectItem>
                      <SelectItem value="instructor">Դասախոս</SelectItem>
                      <SelectItem value="employer">Գործատու</SelectItem>
                      <SelectItem value="admin">Ադմինիստրատոր</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users?.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-armenian">Օգտատերեր չեն գտնվել</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminUsersTab;
