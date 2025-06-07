
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, BookOpen, Activity, Eye } from 'lucide-react';

const AdminAnalyticsTab = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-armenian text-gradient">Վերլուծական տվյալներ</h2>
            <p className="text-muted-foreground font-armenian">Համակարգի գործունեության վիճակագրություն և վերլուծություն</p>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="font-armenian text-lg flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Users className="w-4 h-4 text-white" />
              </div>
              Ակտիվ օգտատերեր
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">1,247</div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-500">+12%</span>
              <span className="text-muted-foreground">վերջին ամսում</span>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="font-armenian text-lg flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              Ամփոփված դասընթացներ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">3,456</div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-500">+8%</span>
              <span className="text-muted-foreground">վերջին ամսում</span>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="font-armenian text-lg flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Activity className="w-4 h-4 text-white" />
              </div>
              Օրական գործունեություն
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">87%</div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-500">+5%</span>
              <span className="text-muted-foreground">վերջին շաբաթում</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="modern-card animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="font-armenian flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Օգտատերերի աճ
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="font-armenian">Գծապատկերը մշակման փուլում է</p>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle className="font-armenian flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Դասընթացների հաջողություն
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="font-armenian">Գծապատկերը մշակման փուլում է</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card className="modern-card animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Մանրամասն վիճակագրություն
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">73%</div>
              <div className="text-sm font-armenian text-muted-foreground">Ավարտման տոկոս</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl">
              <div className="text-2xl font-bold text-green-600">4.7</div>
              <div className="text-sm font-armenian text-muted-foreground">Միջին գնահատական</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">2.3ժ</div>
              <div className="text-sm font-armenian text-muted-foreground">Միջին ուսուցման ժամանակ</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">94%</div>
              <div className="text-sm font-armenian text-muted-foreground">Գոհունակություն</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsTab;
