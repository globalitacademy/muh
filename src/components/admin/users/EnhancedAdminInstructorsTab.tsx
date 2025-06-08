
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/hooks/useAdminUsers';
import InstructorsTabHeader from './instructors/InstructorsTabHeader';
import InstructorsSearch from './instructors/InstructorsSearch';
import InstructorsList from './instructors/InstructorsList';

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

  return (
    <div className="space-y-6">
      <InstructorsTabHeader
        instructorsCount={filteredInstructors.length}
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
        onRefetch={refetch}
      />

      <InstructorsSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <InstructorsList
        instructors={filteredInstructors}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onRefetch={refetch}
      />
    </div>
  );
};

export default EnhancedAdminInstructorsTab;
