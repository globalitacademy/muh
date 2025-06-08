
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, BookOpen, Activity, Eye } from 'lucide-react';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { Loader2 } from 'lucide-react';

const AdminAnalyticsTab = () => {
  const { data: analytics, isLoading, error } = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    console.error('Error loading analytics:', error);
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold font-armenian mb-2">Տվյալների բեռնման սխալ</h3>
        <p className="text-muted-foreground font-armenian">Խնդրում ենք փորձել նորից</p>
      </div>
    );
  }

  const data = analytics || {
    activeUsers: 0,
    completedCourses: 0,
    dailyActivity: 0,
    averageRating: 0,
    completionRate: 0,
    satisfaction: 0,
    averageStudyTime: '0ժ',
  };

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-0">
      {/* Header */}
      <div className="glass-card rounded-2xl p-4 md:p-6 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-armenian text-gradient">Վերլուծական տվյալներ</h2>
            <p className="text-sm md:text-base text-muted-foreground font-armenian">Համակարգի գործունեության վիճակագրություն և վերլուծություն</p>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="font-armenian text-base md:text-lg flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="truncate">Ակտիվ օգտատերեր</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold mb-2">{data.activeUsers.toLocaleString()}</div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-green-500">+{Math.floor(data.activeUsers * 0.12)}%</span>
              <span className="text-muted-foreground truncate">վերջին ամսում</span>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="font-armenian text-base md:text-lg flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="truncate">Ամփոփված դասընթացներ</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold mb-2">{data.completedCourses.toLocaleString()}</div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-green-500">+{Math.floor(data.completedCourses * 0.08)}%</span>
              <span className="text-muted-foreground truncate">վերջին ամսում</span>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="font-armenian text-base md:text-lg flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="truncate">Օրական գործունեություն</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold mb-2">{data.dailyActivity}%</div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-green-500">+5%</span>
              <span className="text-muted-foreground truncate">վերջին շաբաթում</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <Card className="modern-card animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="font-armenian flex items-center gap-2 text-base md:text-lg">
              <BarChart3 className="w-5 h-5" />
              Օգտատերերի աճ
            </CardTitle>
          </CardHeader>
          <CardContent className="h-48 md:h-64 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-50" />
              <p className="font-armenian text-sm md:text-base">Գծապատկերը մշակման փուլում է</p>
              <p className="text-xs md:text-sm mt-2">Ակտիվ օգտատերեր: {data.activeUsers}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle className="font-armenian flex items-center gap-2 text-base md:text-lg">
              <Activity className="w-5 h-5" />
              Դասընթացների հաջողություն
            </CardTitle>
          </CardHeader>
          <CardContent className="h-48 md:h-64 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Activity className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-50" />
              <p className="font-armenian text-sm md:text-base">Գծապատկերը մշակման փուլում է</p>
              <p className="text-xs md:text-sm mt-2">Ավարտման տոկոս: {data.completionRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card className="modern-card animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2 text-base md:text-lg">
            <Eye className="w-5 h-5" />
            Մանրամասն վիճակագրություն
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center p-3 md:p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl">
              <div className="text-xl md:text-2xl font-bold text-blue-600">{data.completionRate}%</div>
              <div className="text-xs md:text-sm font-armenian text-muted-foreground">Ավարտման տոկոս</div>
            </div>
            <div className="text-center p-3 md:p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl">
              <div className="text-xl md:text-2xl font-bold text-green-600">{data.averageRating}</div>
              <div className="text-xs md:text-sm font-armenian text-muted-foreground">Միջին գնահատական</div>
            </div>
            <div className="text-center p-3 md:p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl">
              <div className="text-xl md:text-2xl font-bold text-purple-600">{data.averageStudyTime}</div>
              <div className="text-xs md:text-sm font-armenian text-muted-foreground">Միջին ուսուցման ժամանակ</div>
            </div>
            <div className="text-center p-3 md:p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl">
              <div className="text-xl md:text-2xl font-bold text-orange-600">{data.satisfaction}%</div>
              <div className="text-xs md:text-sm font-armenian text-muted-foreground">Գոհունակություն</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsTab;
