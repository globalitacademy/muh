
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, DollarSign, Star, TrendingUp, Award } from 'lucide-react';
import { CourseStats } from '@/hooks/useInstructorDashboard';

interface InstructorDashboardStatsProps {
  stats: CourseStats;
  isLoading: boolean;
}

const InstructorDashboardStats = ({ stats, isLoading }: InstructorDashboardStatsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Ընդհանուր դասընթացներ',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Ակտիվ ուսանողներ',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Ընդհանուր եկամուտ',
      value: `${stats.totalRevenue.toLocaleString()}֏`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    {
      title: 'Միջին գնահատական',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    },
    {
      title: 'Ավարտելիություն',
      value: `${Math.round(stats.completionRate)}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Ակտիվ դասընթացներ',
      value: stats.activeCourses,
      icon: Award,
      color: 'text-indigo-600',
      bg: 'bg-indigo-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-armenian">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InstructorDashboardStats;
