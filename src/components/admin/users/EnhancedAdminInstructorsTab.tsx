
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, GraduationCap, Users } from 'lucide-react';
import { UserProfile } from '@/hooks/useAdminUsers';
import UserActionsMenu from './shared/UserActionsMenu';
import AddInstructorForm from './AddInstructorForm';
import EditInstructorDialog from './EditInstructorDialog';
import ViewInstructorDialog from './ViewInstructorDialog';

interface InstructorWithGroups extends UserProfile {
  instructor_groups?: { group_number: string }[];
}

const EnhancedAdminInstructorsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: instructors, isLoading, refetch } = useQuery({
    queryKey: ['adminInstructorsWithGroups'],
    queryFn: async (): Promise<InstructorWithGroups[]> => {
      console.log('Fetching instructors with groups...');
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          instructor_groups (
            group_number
          )
        `)
        .eq('role', 'instructor')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching instructors:', error);
        throw error;
      }

      return data || [];
    },
  });

  const filteredInstructors = instructors?.filter(instructor =>
    instructor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.department?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold font-armenian">Դասախոսներ</h3>
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
          <h3 className="text-lg font-semibold font-armenian">Դասախոսներ</h3>
          <p className="text-sm text-muted-foreground font-armenian">
            Ընդհանուր {filteredInstructors.length} դասախոս
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="font-armenian">
              <Plus className="w-4 h-4 mr-2" />
              Ավելացնել դասախոս
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-armenian">Նոր դասախոս ավելացնել</DialogTitle>
            </DialogHeader>
            <AddInstructorForm 
              onSuccess={() => {
                setShowAddDialog(false);
                refetch();
              }}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Որոնել դասախոսների մեջ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 font-armenian"
        />
      </div>

      {/* Instructors Grid */}
      <div className="grid gap-4">
        {filteredInstructors.map((instructor) => (
          <Card key={instructor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={instructor.avatar_url || ''} />
                    <AvatarFallback>
                      <GraduationCap className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium font-armenian">{instructor.name || 'Անանուն'}</h4>
                      <Badge 
                        variant={instructor.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {instructor.status === 'active' ? 'Ակտիվ' : 'Ոչ ակտիվ'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {instructor.organization && (
                        <p className="font-armenian">{instructor.organization}</p>
                      )}
                      {instructor.department && (
                        <p className="font-armenian">Բաժին: {instructor.department}</p>
                      )}
                      {instructor.phone && (
                        <p>{instructor.phone}</p>
                      )}
                    </div>
                    
                    {/* Teaching Groups */}
                    {instructor.instructor_groups && instructor.instructor_groups.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground font-armenian mb-1">Դասավանդող խմբեր:</p>
                        <div className="flex flex-wrap gap-1">
                          {instructor.instructor_groups.map((group, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {group.group_number}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {instructor.bio && (
                      <p className="text-sm text-muted-foreground mt-2 font-armenian line-clamp-2">
                        {instructor.bio}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <ViewInstructorDialog instructor={instructor} />
                  <EditInstructorDialog instructor={instructor} onSuccess={() => refetch()} />
                  <UserActionsMenu user={instructor} onActionComplete={() => refetch()} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredInstructors.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-armenian text-muted-foreground">
                {searchTerm ? 'Դասախոսներ չեն գտնվել' : 'Դեռ դասախոսներ չկան'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedAdminInstructorsTab;
