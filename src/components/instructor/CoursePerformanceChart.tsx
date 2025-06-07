
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { CoursePerformance } from '@/hooks/useInstructorDashboard';

interface CoursePerformanceChartProps {
  courses: CoursePerformance[];
  isLoading: boolean;
}

const CoursePerformanceChart = ({ courses, isLoading }: CoursePerformanceChartProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-muted rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chartData = courses.map(course => ({
    name: course.title.length > 15 ? course.title.substring(0, 15) + '...' : course.title,
    students: course.students,
    completion: course.completion,
    rating: course.rating,
    revenue: course.revenue
  }));

  const pieData = courses.map((course, index) => ({
    name: course.title,
    value: course.students,
    color: `hsl(${index * 137.5 % 360}, 70%, 50%)`
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Դասընթացների կատարողականություն</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'students' ? `${value} ուսանող` : 
                  name === 'completion' ? `${value}% ավարտում` :
                  name === 'rating' ? `${value} գնահատական` : value,
                  name === 'students' ? 'Ուսանողներ' :
                  name === 'completion' ? 'Ավարտելիություն' :
                  name === 'rating' ? 'Գնահատական' : name
                ]}
              />
              <Bar dataKey="students" fill="#3b82f6" name="students" />
              <Bar dataKey="completion" fill="#10b981" name="completion" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="font-armenian">Ուսանողների բաշխում</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="font-armenian">Եկամտի միտում</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}֏`, 'Եկամուտ']} />
                <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoursePerformanceChart;
