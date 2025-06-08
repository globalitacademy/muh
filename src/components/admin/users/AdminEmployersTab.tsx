
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Plus, MoreVertical, Building2 } from 'lucide-react';
import { UserProfile } from '@/hooks/useAdminUsers';
import UserActionsMenu from './shared/UserActionsMenu';

const AdminEmployersTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: employers, isLoading, refetch } = useQuery({
    queryKey: ['adminEmployers'],
    queryFn: async (): Promise<UserProfile[]> => {
      console.log('Fetching employers...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'employer')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching employers:', error);
        throw error;
      }

      return data || [];
    },
  });

  const filteredEmployers = employers?.filter(employer =>
    employer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.organization?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold font-armenian">Գործատուներ</h3>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold font-armenian">Գործատուներ</h3>
          <p className="text-sm text-muted-foreground font-armenian">
            Ընդհանուր {filteredEmployers.length} գործատու
          </p>
        </div>
        <Button className="font-armenian">
          <Plus className="w-4 h-4 mr-2" />
          Ավելացնել գործատու
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Որոնել գործատուների մեջ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 font-armenian"
        />
      </div>

      {/* Employers Grid */}
      <div className="grid gap-4">
        {filteredEmployers.map((employer) => (
          <Card key={employer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={employer.avatar_url || ''} />
                    <AvatarFallback>
                      <Building2 className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium font-armenian">{employer.name || 'Անանուն'}</h4>
                    <p className="text-sm text-muted-foreground font-armenian">
                      {employer.organization || 'Կազմակերպություն նշված չէ'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={employer.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {employer.status === 'active' ? 'Ակտիվ' : 'Ոչ ակտիվ'}
                      </Badge>
                      {employer.phone && (
                        <span className="text-xs text-muted-foreground">{employer.phone}</span>
                      )}
                    </div>
                  </div>
                </div>
                <UserActionsMenu user={employer} onActionComplete={() => refetch()} />
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredEmployers.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-armenian text-muted-foreground">
                {searchTerm ? 'Գործատուներ չեն գտնվել' : 'Դեռ գործատուներ չկան'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminEmployersTab;
