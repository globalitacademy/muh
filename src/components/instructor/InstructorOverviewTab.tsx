
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInstructorCourses } from '@/hooks/useInstructorCourses';
import { useInstructorStudents } from '@/hooks/useInstructorStudents';
import { useInstructorAnalytics } from '@/hooks/useInstructorAnalytics';
import { BookOpen, Users, Star, TrendingUp, Calendar, MessageSquare } from 'lucide-react';

const InstructorOverviewTab = () => {
  const { data: courses, isLoading: coursesLoading } = useInstructorCourses();
  const { data: students, isLoading: studentsLoading } = useInstructorStudents();
  const { data: analytics, isLoading: analyticsLoading } = useInstructorAnalytics();

  if (coursesLoading || studentsLoading || analyticsLoading) {
    return <div className="animate-pulse font-armenian">Բեռնվում է...</div>;
  }

  const activeCourses = courses?.filter(c => c.is_active) || [];
  const recentActivity = [
    { action: 'Նոր ուսանող գրանցվել է', course: 'JavaScript հիմունքներ', time: '2 ժամ առաջ' },
    { action: 'Գնահատական տրվել է', course: 'React զարգացում', time: '4 ժամ առաջ' },
    { action: 'Նոր առաջադրանք ստեղծվել է', course: 'Node.js հետադարձ', time: '1 օր առաջ' },
  ];

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
                <p className="text-2xl font-bold">{analytics?.averageRating.toFixed(1) || '0.0'}</p>
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
                    {course.students_count} ուսանող • {course.total_lessons} դաս
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Վերջին գործողություններ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border-l-2 border-blue-200">
                <div className="p-1 bg-blue-100 rounded">
                  <Calendar className="w-3 h-3 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium font-armenian">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.course}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorOverviewTab;
