
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Building2, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import UserActionsMenu from './shared/UserActionsMenu';

interface EmployerProfile {
  id: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  organization: string | null;
  role: string;
  phone: string | null;
  address: string | null;
  department: string | null;
  group_number: string | null;
  avatar_url: string | null;
  cover_photo_url: string | null;
  bio: string | null;
  status: string;
  verified: boolean;
  email_verified: boolean;
  two_factor_enabled: boolean;
  birth_date: string | null;
  field_of_study: string | null;
  personal_website: string | null;
  linkedin_url: string | null;
  language_preference: string;
  is_visible_to_employers: boolean;
  created_at: string;
  updated_at: string;
}

const AdminEmployersTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: employers, isLoading, refetch } = useQuery({
    queryKey: ['adminEmployers'],
    queryFn: async (): Promise<EmployerProfile[]> => {
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
    employer.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.field_of_study?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full sm:w-80" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-edu-blue to-edu-orange rounded-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold font-armenian">Գործատուներ</h3>
            <p className="text-sm text-muted-foreground font-armenian">
              {filteredEmployers.length} գործատու
            </p>
          </div>
        </div>

        <Button className="font-armenian">
          <Plus className="w-4 h-4 mr-2" />
          Ավելացնել գործատու
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Որոնել գործատուների մեջ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 font-armenian"
        />
      </div>

      {/* Employers List */}
      {filteredEmployers.length === 0 && !isLoading ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold font-armenian">Գործատուներ չեն գտնվել</h3>
              <p className="text-muted-foreground font-armenian">
                {searchTerm ? 'Փորձեք փոխել որոնման պարամետրերը' : 'Դեռ գործատուներ չկան համակարգում'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {filteredEmployers.map((employer) => (
            <Card key={employer.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-6 flex-1">
                    {/* Organization Logo */}
                    <div className="flex-shrink-0">
                      <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                        <AvatarImage 
                          src={employer.avatar_url} 
                          className="object-cover" 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xl font-bold">
                          {employer.organization?.charAt(0) || employer.name?.charAt(0) || 'Գ'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    {/* Organization Information */}
                    <div className="flex-1 min-w-0 space-y-4">
                      {/* Header with Organization Name and Status */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-bold text-xl text-foreground font-armenian">
                            {employer.organization || 'Կազմակերպություն նշված չէ'}
                          </h3>
                          <div className="flex gap-2">
                            <Badge 
                              variant={employer.status === 'active' ? 'default' : 'secondary'} 
                              className="text-xs font-medium"
                            >
                              {employer.status === 'active' ? 'Ակտիվ' : 
                               employer.status === 'pending' ? 'Ընթացքի մեջ' : 'Ապաակտիվ'}
                            </Badge>
                            {employer.verified && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                Հաստատված
                              </Badge>
                            )}
                            {employer.email_verified && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                Էլ.փոստ հաստատված
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Director Information */}
                        {(employer.name || employer.first_name || employer.last_name) && (
                          <div className="flex items-center gap-2 text-base">
                            <span className="font-semibold text-muted-foreground font-armenian">Տնօրեն:</span>
                            <span className="font-medium text-foreground font-armenian">
                              {employer.name || `${employer.first_name || ''} ${employer.last_name || ''}`.trim()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Contact Information Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {/* Phone */}
                        {employer.phone && (
                          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                            <span className="font-medium text-green-700 font-armenian text-sm">Հեռախոս:</span>
                            <a 
                              href={`tel:${employer.phone}`}
                              className="font-medium text-green-600 hover:text-green-800"
                            >
                              {employer.phone}
                            </a>
                          </div>
                        )}
                        
                        {/* Personal Website */}
                        {employer.personal_website && (
                          <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-md">
                            <span className="font-medium text-purple-700 font-armenian text-sm">Վեբկայք:</span>
                            <a 
                              href={employer.personal_website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-medium text-purple-600 hover:text-purple-800 underline truncate"
                            >
                              {employer.personal_website.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        )}
                        
                        {/* Address */}
                        {(employer.address || employer.bio) && (
                          <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
                            <span className="font-medium text-orange-700 font-armenian text-sm">Հասցե:</span>
                            <span className="font-medium text-orange-600 font-armenian truncate">
                              {employer.address || employer.bio}
                            </span>
                          </div>
                        )}
                        
                        {/* Department */}
                        {employer.department && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <span className="font-medium text-muted-foreground font-armenian text-sm">Բաժին:</span>
                            <span className="font-medium text-foreground font-armenian">{employer.department}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Additional Information */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {employer.field_of_study && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <span className="font-medium text-muted-foreground font-armenian text-sm">Մասնագիտություն:</span>
                            <span className="font-medium text-foreground font-armenian">{employer.field_of_study}</span>
                          </div>
                        )}
                        
                        {employer.linkedin_url && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <span className="font-medium text-muted-foreground font-armenian text-sm">LinkedIn:</span>
                            <a 
                              href={employer.linkedin_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 hover:text-blue-800 underline truncate"
                            >
                              LinkedIn
                            </a>
                          </div>
                        )}
                        
                        {employer.birth_date && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <span className="font-medium text-muted-foreground font-armenian text-sm">Ծննդյան օր:</span>
                            <span className="font-medium text-foreground">
                              {new Date(employer.birth_date).toLocaleDateString('hy-AM')}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                          <span className="font-medium text-muted-foreground font-armenian text-sm">Գրանցվել է:</span>
                          <span className="font-medium text-foreground">
                            {new Date(employer.created_at).toLocaleDateString('hy-AM')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <UserActionsMenu user={employer} onActionComplete={() => refetch()} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEmployersTab;
