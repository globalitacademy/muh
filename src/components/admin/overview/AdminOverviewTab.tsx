
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { Users, BookOpen, BarChart3, Activity, TrendingUp, Clock, Award, MessageSquare } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const AdminOverviewTab = () => {
  const { data: adminStats, isLoading: statsLoading } = useAdminStats();
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();

  if (statsLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const stats = adminStats || {
    totalModules: 0,
    totalUsers: 0,
    activeCourses: 0,
    totalEnrollments: 0,
    totalInstructors: 0,
    totalStudents: 0,
    systemStatus: 'active' as const,
  };

  const analyticsData = analytics || {
    activeUsers: 0,
    completedCourses: 0,
    completionRate: 0,
    averageRating: 0,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient font-armenian">
          Ադմինիստրատորի ընդհանուր տեսքը
        </h1>
        <p className="text-muted-foreground font-armenian">
          Համակարգի ընդհանուր վիճակագրությունը և հիմնական ցուցանիշները
        </p>
      </div>

      {/* Main Stats Grid - Alternative Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground font-armenian">Ընդամենը մոդուլներ</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-secondary/20 rounded-2xl">
                <Users className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground font-armenian">Ընդամենը օգտատերեր</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent/20 rounded-2xl">
                <BarChart3 className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground font-armenian">Ակտիվ դասընթացներ</p>
                <p className="text-2xl font-bold text-foreground">{stats.activeCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl ${stats.systemStatus === 'active' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                <Activity className={`h-6 w-6 ${stats.systemStatus === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground font-armenian">Համակարգի կարգավիճակ</p>
                <p className={`text-2xl font-bold ${stats.systemStatus === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stats.systemStatus === 'active' ? 'Ակտիվ' : 'Սխալ'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ակտիվ օգտատերեր</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.activeUsers}</div>
            <p className="text-xs text-muted-foreground font-armenian">Այսօր գրանցված</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ավարտված դասընթացներ</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.completedCourses}</div>
            <p className="text-xs text-muted-foreground font-armenian">Այս ամսվա ընթացքում</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ավարտման տոկոս</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.completionRate}%</div>
            <p className="text-xs text-muted-foreground font-armenian">Ընդհանուր միջին</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Միջին գնահատական</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.averageRating}/5</div>
            <p className="text-xs text-muted-foreground font-armenian">Ուսանողների կողմից</p>
          </CardContent>
        </Card>
      </div>

      {/* User Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="font-armenian">Դասախոսներ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-edu-blue">{stats.totalInstructors}</div>
            <p className="text-sm text-muted-foreground font-armenian">Գրանցված դասախոսներ</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="font-armenian">Ուսանողներ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-edu-orange">{stats.totalStudents}</div>
            <p className="text-sm text-muted-foreground font-armenian">Գրանցված ուսանողներ</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="font-armenian">Գրանցումներ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success-green">{stats.totalEnrollments}</div>
            <p className="text-sm text-muted-foreground font-armenian">Ընդամենը գրանցումներ</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="font-armenian">Արագ գործողություններ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <BookOpen className="w-5 h-5 text-edu-blue" />
              <span className="font-armenian">Նոր մոդուլ</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <Users className="w-5 h-5 text-edu-orange" />
              <span className="font-armenian">Օգտատեր ավելացնել</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <MessageSquare className="w-5 h-5 text-success-green" />
              <span className="font-armenian">Հաղորդագրություն</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <BarChart3 className="w-5 h-5 text-edu-dark-blue" />
              <span className="font-armenian">Հաշվետվություն</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverviewTab;
