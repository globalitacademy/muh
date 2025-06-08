
import React from 'react';
import { User } from 'lucide-react';
import { UserProfile } from '@/hooks/useAdminUsers';

interface InstructorFormHeaderProps {
  instructor?: UserProfile;
  title: string;
  subtitle: string;
}

const InstructorFormHeader: React.FC<InstructorFormHeaderProps> = ({ 
  instructor, 
  title, 
  subtitle 
}) => {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-edu-blue to-edu-orange rounded-full flex items-center justify-center mx-auto mb-4">
        {instructor?.avatar_url ? (
          <img 
            src={instructor.avatar_url} 
            alt={instructor.name || 'Instructor'} 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <User className="w-8 h-8 text-white" />
        )}
      </div>
      <h3 className="text-xl font-bold font-armenian mb-2">{title}</h3>
      <p className="text-muted-foreground font-armenian">{subtitle}</p>
    </div>
  );
};

export default InstructorFormHeader;
