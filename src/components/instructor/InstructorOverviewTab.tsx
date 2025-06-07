
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInstructorCourses } from '@/hooks/useInstructorCourses';
import { useInstructorStudents } from '@/hooks/useInstructorStudents';
import { useInstructorAnalytics } from '@/hooks/useInstructorAnalytics';
import { BookOpen, Users, Star, TrendingUp, Calendar } from 'lucide-react';

const InstructorOverviewTab = () => {
  const { data: courses, isLoading: coursesLoading } = useInstructorCourses();
  const { data: students, isLoading: studentsLoading } = useInstructorStudents();
  const { data: analytics, isLoading: analyticsLoading } = useInstructorAnalytics();

  if (coursesLoading || studentsLoading || analyticsLoading) {
    return <div className="animate-pulse font-armenian">Բեռնվում է...</div>;
  }

  const activeCourses = courses?.filter(c => c.is_active) || [];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCourses.length}</p>
                <p className="text-sm text-muted-foreground font-armenian">Ակտիվ դասընթացներ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics?.totalStudents || 0}</p>
                <p className="text-sm text-muted-foreground font-armenian">Ընդհանուր ուսանողներ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics?.averageRating?.toFixed(1) || '0.0'}</p>
                <p className="text-sm text-muted-foreground font-armenian">Միջին գնահատական</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(analytics?.completionRate || 0)}%</p>
                <p className="text-sm text-muted-foreground font-armenian">Ավարտելիություն</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Courses */}
      {activeCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-armenian">Ակտիվ դասընթացներ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeCourses.slice(0, 3).map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-semibold font-armenian">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {course.students_count || 0} ուսանող • {course.total_lessons || 0} դաս
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-armenian">
                      {course.difficulty_level}
                    </Badge>
                    <Badge variant="outline" className="font-armenian">
                      Ակտիվ
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State for No Courses */}
      {activeCourses.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-armenian text-lg">Ակտիվ դասընթացներ չկան</p>
              <p className="text-sm">Ստեղծեք ձեր առաջին դասընթացը</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InstructorOverviewTab;
