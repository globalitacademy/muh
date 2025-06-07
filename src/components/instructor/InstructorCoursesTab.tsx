
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInstructorCourses, useCreateCourse } from '@/hooks/useInstructorCourses';
import { Plus, Users, BookOpen, Clock, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InstructorCoursesTab = () => {
  const { data: courses, isLoading } = useInstructorCourses();
  const createCourse = useCreateCourse();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (isLoading) {
    return <div className="animate-pulse font-armenian">Բեռնվում է...</div>;
  }

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
      case 'սկսնակ':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
      case 'միջին':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
      case 'բարձր':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-armenian">Իմ դասընթացները</h2>
        <Button onClick={() => setShowCreateForm(true)} className="font-armenian">
          <Plus className="w-4 h-4 mr-2" />
          Նոր դասընթաց
        </Button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-armenian line-clamp-2">
                  {course.title}
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <Badge 
                variant="outline" 
                className={getDifficultyColor(course.difficulty_level)}
              >
                {course.difficulty_level}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {course.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{course.students_count} ուսանող</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-green-500" />
                  <span>{course.total_lessons} դաս</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>{course.duration_weeks} շաբաթ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    {course.price > 0 ? `${course.price}֏` : 'Անվճար'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Badge variant={course.is_active ? 'default' : 'secondary'} className="font-armenian">
                  {course.is_active ? 'Ակտիվ' : 'Ապաակտիվ'}
                </Badge>
                {course.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {(!courses || courses.length === 0) && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-armenian text-lg">Դասընթացներ չկան</p>
              <p className="text-sm">Ստեղծեք ձեր առաջին դասընթացը</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InstructorCoursesTab;
