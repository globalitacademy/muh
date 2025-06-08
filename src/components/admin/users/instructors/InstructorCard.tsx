
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GraduationCap } from 'lucide-react';
import { UserProfile } from '@/hooks/useAdminUsers';
import UserActionsMenu from '../shared/UserActionsMenu';
import EditInstructorDialog from '../EditInstructorDialog';
import ViewInstructorDialog from '../ViewInstructorDialog';

interface InstructorWithGroups extends UserProfile {
  instructor_groups?: { group_number: string }[];
}

interface InstructorCardProps {
  instructor: InstructorWithGroups;
  onRefetch: () => void;
}

const InstructorCard: React.FC<InstructorCardProps> = ({
  instructor,
  onRefetch,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
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
            <EditInstructorDialog instructor={instructor} onSuccess={() => onRefetch()} />
            <UserActionsMenu user={instructor} onActionComplete={() => onRefetch()} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorCard;
