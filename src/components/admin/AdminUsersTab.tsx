
import React from 'react';
import { useAdminUsers, useUpdateUserRole } from '@/hooks/useAdminUsers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, UserCheck, Search } from 'lucide-react';

const AdminUsersTab = () => {
  const { data: users, isLoading } = useAdminUsers();
  const updateUserRole = useUpdateUserRole();

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'instructor' | 'student' | 'employer') => {
    await updateUserRole.mutateAsync({ userId, role: newRole });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0';
      case 'instructor':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0';
      case 'student':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0';
      case 'employer':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
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
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-armenian text-gradient">Օգտատերերի կառավարում</h2>
              <p className="text-muted-foreground font-armenian">Կառավարեք բոլոր օգտատերերի դերերը և կարգավիճակները</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="font-armenian bg-gradient-to-r from-edu-light-blue to-edu-blue text-white border-0 px-4 py-2">
              <UserCheck className="w-4 h-4 mr-2" />
              Ընդամենը: {users?.length || 0} օգտատեր
            </Badge>
            <Button variant="outline" className="font-armenian">
              <Search className="w-4 h-4 mr-2" />
              Որոնել
            </Button>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 gap-4">
        {users?.map((user, index) => (
          <div 
            key={user.id} 
            className="modern-card course-card-hover rounded-2xl animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-edu-blue to-edu-orange flex items-center justify-center shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold font-armenian mb-2">
                      {user.name || 'Անանուն օգտատեր'}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 font-mono bg-muted/50 px-2 py-1 rounded">
                      ID: {user.id}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                      <div className="space-y-1">
                        <span className="font-medium font-armenian text-muted-foreground">Կազմակերպություն</span>
                        <p className="font-semibold">{user.organization || 'Նշված չէ'}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium font-armenian text-muted-foreground">Խումբ</span>
                        <p className="font-semibold">{user.group_number || 'Նշված չէ'}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium font-armenian text-muted-foreground">Գրանցման ամսաթիվ</span>
                        <p className="font-semibold">{new Date(user.created_at).toLocaleDateString('hy-AM')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={`${getRoleBadgeColor(user.role)} px-4 py-2 text-sm font-semibold`}>
                    {user.role === 'admin' && 'Ադմինիստրատոր'}
                    {user.role === 'instructor' && 'Դասախոս'}
                    {user.role === 'student' && 'Ուսանող'}
                    {user.role === 'employer' && 'Գործատու'}
                  </Badge>
                  <Select 
                    value={user.role} 
                    onValueChange={(newRole: 'admin' | 'instructor' | 'student' | 'employer') => handleRoleChange(user.id, newRole)}
                    disabled={updateUserRole.isPending}
                  >
                    <SelectTrigger className="w-48 bg-background/50 border-muted hover:bg-background/80 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-sm border-muted">
                      <SelectItem value="student">Ուսանող</SelectItem>
                      <SelectItem value="instructor">Դասախոս</SelectItem>
                      <SelectItem value="employer">Գործատու</SelectItem>
                      <SelectItem value="admin">Ադմինիստրատոր</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </div>
        ))}
      </div>

      {users?.length === 0 && (
        <div className="glass-card rounded-2xl animate-fade-in-up">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center">
              <User className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold font-armenian mb-2">Օգտատերեր չեն գտնվել</h3>
            <p className="text-muted-foreground font-armenian">Դեռևս գրանցված օգտատերեր չկան համակարգում</p>
          </CardContent>
        </div>
      )}
    </div>
  );
};

export default AdminUsersTab;
