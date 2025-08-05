
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
        .select(`
          id, name, first_name, last_name, organization, role, status, 
          group_number, phone, department, avatar_url, bio, address, 
          cover_photo_url, field_of_study, personal_website, linkedin_url, 
          birth_date, is_visible_to_employers, email_verified, two_factor_enabled, 
          verified, language_preference, created_at, updated_at
        `)
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
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={employer.avatar_url || ''} />
                    <AvatarFallback className="bg-gradient-to-br from-edu-blue to-edu-orange text-white text-lg font-semibold">
                      {employer.organization?.charAt(0) || employer.name?.charAt(0) || 'Գ'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg font-armenian">
                        {employer.organization || 'Կազմակերպություն նշված չէ'}
                      </h4>
                      <Badge 
                        variant={employer.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {employer.status === 'active' ? 'Ակտիվ' : 'Ոչ ակտիվ'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="space-y-1">
                        {employer.name && (
                          <div><span className="font-medium font-armenian">Տնօրեն:</span> <span className="font-armenian">{employer.name}</span></div>
                        )}
                        {(employer.first_name || employer.last_name) && (
                          <div><span className="font-medium font-armenian">Անուն Ազգանուն:</span> <span className="font-armenian">{[employer.first_name, employer.last_name].filter(Boolean).join(' ')}</span></div>
                        )}
                        {employer.phone && (
                          <div><span className="font-medium font-armenian">Հեռախոս:</span> {employer.phone}</div>
                        )}
                        {employer.department && (
                          <div><span className="font-medium font-armenian">Բաժին:</span> <span className="font-armenian">{employer.department}</span></div>
                        )}
                        {employer.field_of_study && (
                          <div><span className="font-medium font-armenian">Մասնագիտություն:</span> <span className="font-armenian">{employer.field_of_study}</span></div>
                        )}
                      </div>
                      <div className="space-y-1">
                        {(employer.address || employer.bio) && (
                          <div><span className="font-medium font-armenian">Հասցե:</span> <span className="font-armenian">{employer.address || employer.bio}</span></div>
                        )}
                        {employer.personal_website && (
                          <div><span className="font-medium font-armenian">Կայք:</span> <a href={employer.personal_website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{employer.personal_website}</a></div>
                        )}
                        {employer.linkedin_url && (
                          <div><span className="font-medium font-armenian">LinkedIn:</span> <a href={employer.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn</a></div>
                        )}
                        {employer.birth_date && (
                          <div><span className="font-medium font-armenian">Ծննդյան օր:</span> {new Date(employer.birth_date).toLocaleDateString('hy-AM')}</div>
                        )}
                        <div><span className="font-medium font-armenian">Գրանցվել է:</span> {new Date(employer.created_at).toLocaleDateString('hy-AM')}</div>
                        {employer.email_verified !== null && (
                          <div><span className="font-medium font-armenian">Էլ․ փոստ հաստատված:</span> <span className={employer.email_verified ? 'text-green-600' : 'text-red-600'}>{employer.email_verified ? 'Այո' : 'Ոչ'}</span></div>
                        )}
                      </div>
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
