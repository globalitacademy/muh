
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter, Users, GraduationCap } from 'lucide-react';
import { UserProfile } from '@/hooks/useAdminUsers';
import UserActionsMenu from './shared/UserActionsMenu';

const EnhancedAdminStudentsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: students, isLoading, refetch } = useQuery({
    queryKey: ['adminStudents'],
    queryFn: async (): Promise<UserProfile[]> => {
      console.log('Fetching students...');
    const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, name, first_name, last_name, organization, role, status, 
          group_number, phone, department, avatar_url, bio, address, 
          cover_photo_url, field_of_study, personal_website, linkedin_url, 
          birth_date, is_visible_to_employers, email_verified, two_factor_enabled, 
          verified, language_preference, created_at, updated_at
        `)
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }

      return data || [];
    },
  });

  const { data: groups } = useQuery({
    queryKey: ['studentGroups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('group_number')
        .eq('role', 'student')
        .not('group_number', 'is', null);

      if (error) throw error;
      
      const uniqueGroups = [...new Set(data.map(item => item.group_number))].filter(Boolean);
      return uniqueGroups;
    },
  });

  const filteredStudents = students?.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.group_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = groupFilter === 'all' || student.group_number === groupFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
    return matchesSearch && matchesGroup && matchesStatus;
  }) || [];

  const groupedStudents = filteredStudents.reduce((acc, student) => {
    const group = student.group_number || 'Չփոխանցված խումբ';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(student);
    return acc;
  }, {} as Record<string, UserProfile[]>);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold font-armenian">Ուսանողներ</h3>
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
          <h3 className="text-lg font-semibold font-armenian">Ուսանողներ</h3>
          <p className="text-sm text-muted-foreground font-armenian">
            Ընդհանուր {filteredStudents.length} ուսանող
          </p>
        </div>
        <Button className="font-armenian">
          <Users className="w-4 h-4 mr-2" />
          Ավելացնել ուսանող
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Որոնել ուսանողների մեջ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 font-armenian"
          />
        </div>
        
        <Select value={groupFilter} onValueChange={setGroupFilter}>
          <SelectTrigger className="font-armenian">
            <SelectValue placeholder="Խումբ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-armenian">Բոլոր խմբերը</SelectItem>
            {groups?.map((group) => (
              <SelectItem key={group} value={group} className="font-armenian">
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="font-armenian">
            <SelectValue placeholder="Կարգավիճակ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-armenian">Բոլոր կարգավիճակները</SelectItem>
            <SelectItem value="active" className="font-armenian">Ակտիվ</SelectItem>
            <SelectItem value="graduated" className="font-armenian">Ավարտած</SelectItem>
            <SelectItem value="suspended" className="font-armenian">Կասեցված</SelectItem>
            <SelectItem value="blocked" className="font-armenian">Արգելափակված</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="font-armenian">
          <Filter className="w-4 h-4 mr-2" />
          Ֆիլտրեր
        </Button>
      </div>

      {/* Students by Groups */}
      <div className="space-y-6">
        {Object.entries(groupedStudents).map(([groupName, groupStudents]) => (
          <Card key={groupName}>
            <CardHeader>
              <CardTitle className="font-armenian flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                {groupName} ({groupStudents.length} ուսանող)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {groupStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={student.avatar_url || ''} />
                        <AvatarFallback>
                          {student.name?.charAt(0) || 'Ու'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium font-armenian">{student.name || 'Անանուն'}</p>
                          <Badge 
                            variant={student.status === 'active' ? 'default' : 
                                   student.status === 'pending' ? 'secondary' :
                                   student.status === 'graduated' ? 'outline' : 'destructive'}
                            className="text-xs"
                          >
                            {student.status === 'active' ? 'Ակտիվ' : 
                             student.status === 'pending' ? 'Ընթացքի մեջ' :
                             student.status === 'graduated' ? 'Ավարտած' :
                             student.status === 'suspended' ? 'Կասեցված' :
                             student.status === 'blocked' ? 'Արգելափակված' : student.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-muted-foreground">
                          <div className="space-y-1">
                            {student.organization && (
                              <div><span className="font-medium font-armenian">Կազմակերպություն:</span> {student.organization}</div>
                            )}
                            {student.department && (
                              <div><span className="font-medium font-armenian">Բաժին:</span> {student.department}</div>
                            )}
                            {student.phone && (
                              <div><span className="font-medium font-armenian">Հեռախոս:</span> {student.phone}</div>
                            )}
                            {student.field_of_study && (
                              <div><span className="font-medium font-armenian">Մասնագիտություն:</span> {student.field_of_study}</div>
                            )}
                          </div>
                          <div className="space-y-1">
                            {student.address && (
                              <div><span className="font-medium font-armenian">Հասցե:</span> {student.address}</div>
                            )}
                            {student.personal_website && (
                              <div><span className="font-medium font-armenian">Կայք:</span> <a href={student.personal_website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{student.personal_website}</a></div>
                            )}
                            {student.linkedin_url && (
                              <div><span className="font-medium font-armenian">LinkedIn:</span> <a href={student.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn</a></div>
                            )}
                            <div><span className="font-medium font-armenian">Գրանցվել է:</span> {new Date(student.created_at).toLocaleDateString('hy-AM')}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <UserActionsMenu user={student} onActionComplete={() => refetch()} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {Object.keys(groupedStudents).length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-armenian text-muted-foreground">
                {searchTerm || groupFilter !== 'all' || statusFilter !== 'all' ? 
                  'Ֆիլտրերի համապատասխան ուսանողներ չեն գտնվել' : 
                  'Դեռ ուսանողներ չկան'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedAdminStudentsTab;
