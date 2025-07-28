import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { GraduationCap, Plus, Trash2, Users, Save } from 'lucide-react';
import { useAssignInstructorToModule, useRemoveInstructorFromModule, useUpdateModuleInstructor } from '@/hooks/useModuleInstructors';
import { toast } from 'sonner';

interface ModuleInstructorsManagementProps {
  moduleId: string;
}

interface InstructorProfile {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  organization?: string;
  department?: string;
}

const ModuleInstructorsManagement = ({ moduleId }: ModuleInstructorsManagementProps) => {
  const [selectedInstructorId, setSelectedInstructorId] = useState('');
  const [groupNumber, setGroupNumber] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const assignInstructor = useAssignInstructorToModule();
  const removeInstructor = useRemoveInstructorFromModule();
  const updateInstructor = useUpdateModuleInstructor();

  // Fetch available instructors
  const { data: availableInstructors, isLoading: loadingInstructors } = useQuery({
    queryKey: ['availableInstructors'],
    queryFn: async (): Promise<InstructorProfile[]> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, organization, department')
        .eq('role', 'instructor')
        .order('name');

      if (error) {
        console.error('Error fetching instructors:', error);
        throw error;
      }

      return data || [];
    },
  });

  // Fetch assigned instructors
  const { data: assignedInstructors, isLoading: loadingAssigned, refetch } = useQuery({
    queryKey: ['moduleInstructors', moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_instructors')
        .select(`
          id,
          instructor_id,
          group_number,
          is_primary,
          instructor:profiles!instructor_id (
            id,
            name,
            avatar_url,
            organization,
            department
          )
        `)
        .eq('module_id', moduleId)
        .order('is_primary', { ascending: false });

      if (error) {
        console.error('Error fetching assigned instructors:', error);
        throw error;
      }

      return data || [];
    },
  });

  const handleAssignInstructor = async () => {
    if (!selectedInstructorId) {
      toast.error('Խնդրում ենք ընտրել դասախոս');
      return;
    }

    try {
      await assignInstructor.mutateAsync({
        moduleId,
        instructorId: selectedInstructorId,
        groupNumber: groupNumber || null,
        isPrimary,
      });

      setSelectedInstructorId('');
      setGroupNumber('');
      setIsPrimary(false);
      refetch();
    } catch (error) {
      console.error('Error assigning instructor:', error);
    }
  };

  const handleRemoveInstructor = async (assignmentId: string) => {
    if (!confirm('Վստա՞հ եք, որ ուզում եք հեռացնել այս դասախոսին:')) {
      return;
    }

    try {
      await removeInstructor.mutateAsync(assignmentId);
      refetch();
    } catch (error) {
      console.error('Error removing instructor:', error);
    }
  };

  const handleUpdateInstructor = async (assignmentId: string, updates: { group_number?: string; is_primary?: boolean }) => {
    try {
      await updateInstructor.mutateAsync({
        assignmentId,
        updates,
      });
      refetch();
    } catch (error) {
      console.error('Error updating instructor:', error);
    }
  };

  if (loadingInstructors || loadingAssigned) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-edu-blue"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Instructor */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Plus className="w-5 h-5 text-edu-blue" />
            Նշանակել դասախոս
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="font-armenian">Դասախոս</Label>
              <Select value={selectedInstructorId} onValueChange={setSelectedInstructorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Ընտրել դասախոս" />
                </SelectTrigger>
                <SelectContent>
                  {availableInstructors?.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={instructor.avatar_url || ''} />
                          <AvatarFallback className="text-xs">
                            {instructor.name?.charAt(0) || 'Ա'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-armenian">{instructor.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-armenian">Խումբ</Label>
              <Input
                placeholder="Խմբի համար"
                value={groupNumber}
                onChange={(e) => setGroupNumber(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="primary-instructor"
                checked={isPrimary}
                onCheckedChange={setIsPrimary}
              />
              <Label htmlFor="primary-instructor" className="font-armenian">
                Գլխավոր դասախոս
              </Label>
            </div>

            <div>
              <Button
                onClick={handleAssignInstructor}
                disabled={!selectedInstructorId || assignInstructor.isPending}
                className="w-full font-armenian"
              >
                <Save className="w-4 h-4 mr-2" />
                Նշանակել
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Instructors */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-edu-blue" />
            Նշանակված դասախոսներ ({assignedInstructors?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!assignedInstructors || assignedInstructors.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-armenian text-muted-foreground">
                Այս մոդուլին դեռ դասախոսներ չեն նշանակվել
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignedInstructors.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={assignment.instructor.avatar_url || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-edu-blue to-edu-orange text-white">
                        <GraduationCap className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h4 className="font-semibold font-armenian">
                        {assignment.instructor.name || 'Անանուն դասախոս'}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {assignment.group_number && (
                          <span className="font-armenian">
                            Խումբ: {assignment.group_number}
                          </span>
                        )}
                        {assignment.instructor.organization && (
                          <span className="font-armenian">
                            • {assignment.instructor.organization}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {assignment.is_primary && (
                      <Badge className="bg-gradient-to-r from-edu-blue to-edu-orange text-white">
                        Գլխավոր
                      </Badge>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveInstructor(assignment.id)}
                      disabled={removeInstructor.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleInstructorsManagement;