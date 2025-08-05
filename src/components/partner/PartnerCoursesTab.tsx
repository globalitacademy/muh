import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, Users, Calendar, DollarSign } from 'lucide-react';
import PartnerCourseDialog from './PartnerCourseDialog';
import { format } from 'date-fns';

interface PartnerCourse {
  id: string;
  title: string;
  description?: string;
  duration_weeks: number;
  price: number;
  max_students?: number;
  current_students: number;
  start_date?: string;
  end_date?: string;
  status: string;
  is_active: boolean;
  image_url?: string;
}

export default function PartnerCoursesTab() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<PartnerCourse | null>(null);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['partner-courses', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_courses')
        .select('*')
        .eq('partner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PartnerCourse[];
    },
    enabled: !!user?.id,
  });

  const openCreateDialog = () => {
    setSelectedCourse(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (course: PartnerCourse) => {
    setSelectedCourse(course);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Հրապարակված';
      case 'draft':
        return 'Նախագիծ';
      case 'archived':
        return 'Արխիվացված';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Մասնավոր դասընթացներ</h2>
          <p className="text-muted-foreground">
            Կառավարեք ձեր կրթական հաստատության դասընթացները
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Նոր դասընթաց
        </Button>
      </div>

      {!courses || courses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Դուք դեռ չեք ստեղծել որևէ դասընթաց
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Ստեղծել առաջին դասընթացը
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <Badge className={getStatusColor(course.status)}>
                    {getStatusText(course.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Course Image */}
                {course.image_url && (
                  <img 
                    src={course.image_url} 
                    alt={course.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}

                {course.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{course.duration_weeks} շաբաթ</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {course.price === 0 ? 'անվճար' : `${course.price} դրամ`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {course.current_students}/{course.max_students || '∞'} ուսանող
                    </span>
                  </div>

                  {course.start_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Սկիզբ՝ {format(new Date(course.start_date), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={() => openEditDialog(course)}
                  variant="outline" 
                  className="w-full"
                >
                  Խմբագրել
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PartnerCourseDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        course={selectedCourse}
      />
    </div>
  );
}