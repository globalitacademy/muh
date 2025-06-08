
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { UserProfile } from '@/hooks/useAdminUsers';
import InstructorCard from './InstructorCard';

interface InstructorWithGroups extends UserProfile {
  instructor_groups?: { group_number: string }[];
}

interface InstructorsListProps {
  instructors: InstructorWithGroups[];
  isLoading: boolean;
  searchTerm: string;
  onRefetch: () => void;
}

const InstructorsList: React.FC<InstructorsListProps> = ({
  instructors,
  isLoading,
  searchTerm,
  onRefetch,
}) => {
  if (isLoading) {
    return (
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
    );
  }

  if (instructors.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="font-armenian text-muted-foreground">
            {searchTerm ? 'Դասախոսներ չեն գտնվել' : 'Դեռ դասախոսներ չկան'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {instructors.map((instructor) => (
        <InstructorCard 
          key={instructor.id} 
          instructor={instructor} 
          onRefetch={onRefetch}
        />
      ))}
    </div>
  );
};

export default InstructorsList;
