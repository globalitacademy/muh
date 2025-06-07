
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useInstructorAnalytics } from '@/hooks/useInstructorAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react';

const InstructorAnalyticsTab = () => {
  const { data: analytics, isLoading } = useInstructorAnalytics();

  if (isLoading) {
    return <div className="animate-pulse font-armenian">Բեռնվում է...</div>;
  }

  const monthlyData = analytics?.monthlyEnrollments.map((value, index) => ({
    month: ['Հուն', 'Փետ', 'Մար', 'Ապր', 'Մայ', 'Հուն', 'Հուլ', 'Օգս', 'Սեպ', 'Հոկ', 'Նոյ', 'Դեկ'][index],
    enrollments: value,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics?.totalCourses || 0}</p>
                <p className="text-sm text-muted-foreground font-armenian">Դասընթացներ</p>
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
                <p className="text-sm text-muted-foreground font-armenian">Ուսանողներ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics?.averageRating.toFixed(1) || '0.0'}</p>
                <p className="text-sm text-muted-foreground font-armenian">Գնահատական</p>
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

      {/* Monthly Enrollments Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Ամսական գրանցումներ</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="enrollments" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Course Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Դասընթացների կատարողականություն</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics?.coursePerformance.map((course) => (
              <div key={course.courseId} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold font-armenian">{course.title}</h4>
                  <span className="text-sm text-muted-foreground">
                    {course.studentsCount} ուսանող
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-armenian">Միջին առաջընթաց</span>
                      <span>{Math.round(course.averageProgress)}%</span>
                    </div>
                    <Progress value={course.averageProgress} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-armenian">Ավարտելիություն</span>
                      <span>{Math.round(course.completionRate)}%</span>
                    </div>
                    <Progress value={course.completionRate} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorAnalyticsTab;
