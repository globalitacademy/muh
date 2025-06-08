
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Star, Users, MapPin, Globe } from 'lucide-react';

interface ModuleInstructor {
  id: string;
  instructor_id: string;
  group_number: string | null;
  is_primary: boolean;
  instructor: {
    id: string;
    name: string | null;
    bio: string | null;
    avatar_url: string | null;
    organization: string | null;
    department: string | null;
    phone: string | null;
    linkedin_url: string | null;
    personal_website: string | null;
  };
}

interface ModuleDetailInstructorsProps {
  moduleId: string;
}

const ModuleDetailInstructors = ({ moduleId }: ModuleDetailInstructorsProps) => {
  const { data: instructors, isLoading } = useQuery({
    queryKey: ['moduleInstructors', moduleId],
    queryFn: async (): Promise<ModuleInstructor[]> => {
      console.log('Fetching instructors for module:', moduleId);
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
            bio,
            avatar_url,
            organization,
            department,
            phone,
            linkedin_url,
            personal_website
          )
        `)
        .eq('module_id', moduleId)
        .order('is_primary', { ascending: false })
        .order('group_number', { ascending: true });

      if (error) {
        console.error('Error fetching module instructors:', error);
        throw error;
      }

      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!instructors || instructors.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="font-armenian text-muted-foreground">
            Այս մոդուլին դեռ դասախոսներ չեն նշանակվել
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {instructors.map((moduleInstructor) => {
        const instructor = moduleInstructor.instructor;
        
        return (
          <Card key={moduleInstructor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <Avatar className="w-20 h-20 border-2 border-background shadow-lg">
                  <AvatarImage src={instructor.avatar_url || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-edu-blue to-edu-orange text-white text-lg">
                    <GraduationCap className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold font-armenian">
                        {instructor.name || 'Անանուն դասախոս'}
                      </h3>
                      {moduleInstructor.is_primary && (
                        <Badge className="bg-gradient-to-r from-edu-blue to-edu-orange text-white">
                          Գլխավոր դասախոս
                        </Badge>
                      )}
                    </div>

                    {moduleInstructor.group_number && (
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground font-armenian">
                          Խումբ: {moduleInstructor.group_number}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      {instructor.organization && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="font-armenian">{instructor.organization}</span>
                        </div>
                      )}
                      {instructor.department && (
                        <div className="flex items-center gap-1">
                          <span className="font-armenian">• {instructor.department}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {instructor.bio && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground font-armenian leading-relaxed">
                        {instructor.bio}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    {instructor.linkedin_url && (
                      <a
                        href={instructor.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                    {instructor.personal_website && (
                      <a
                        href={instructor.personal_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span className="font-armenian">Կայք</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                      <span className="text-xs text-muted-foreground font-armenian">(245 գնահատական)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground font-armenian">1,240+ ուսանող</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ModuleDetailInstructors;
