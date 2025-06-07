
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Eye, TrendingUp, Activity, Calendar } from 'lucide-react';

const AdminUserActivityTab = () => {
  const activities = [
    {
      id: 1,
      user: 'Անի Հակոբյան',
      action: 'Ավարտել է "JavaScript Basics" մոդուլը',
      timestamp: '2024-01-15 14:30:22',
      type: 'completion',
      duration: '2ժ 30ր'
    },
    {
      id: 2,
      user: 'Դավիթ Պետրոսյան',
      action: 'Գրանցվել է "React Advanced" դասընթացին',
      timestamp: '2024-01-15 14:25:15',
      type: 'enrollment',
      duration: '-'
    },
    {
      id: 3,
      user: 'Մարիամ Գրիգորյան',
      action: 'Անցել է "CSS Flexbox" քիզը',
      timestamp: '2024-01-15 14:20:10',
      type: 'quiz',
      duration: '15ր'
    },
    {
      id: 4,
      user: 'Արեն Ավագյան',
      action: 'Սկսել է "Node.js Backend" մոդուլը',
      timestamp: '2024-01-15 14:15:05',
      type: 'start',
      duration: '-'
    },
    {
      id: 5,
      user: 'Նարե Խաչատրյան',
      action: 'Ներբեռնել է "HTML Guide" ռեսուրսը',
      timestamp: '2024-01-15 14:10:30',
      type: 'download',
      duration: '-'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completion':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'enrollment':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'quiz':
        return <Activity className="w-4 h-4 text-purple-500" />;
      case 'start':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'download':
        return <Eye className="w-4 h-4 text-gray-500" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case 'completion':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0';
      case 'enrollment':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0';
      case 'quiz':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0';
      case 'start':
        return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0';
      case 'download':
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'completion':
        return 'Ավարտ';
      case 'enrollment':
        return 'Գրանցում';
      case 'quiz':
        return 'Քիզ';
      case 'start':
        return 'Սկիզբ';
      case 'download':
        return 'Ներբեռնում';
      default:
        return 'Գործողություն';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-armenian text-gradient">Օգտատերերի գործունեություն</h2>
              <p className="text-muted-foreground font-armenian">Հետևեք օգտատերերի ռեալ ժամանակի գործունեությանը</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="font-armenian">
              <Calendar className="w-4 h-4 mr-2" />
              Այսօր
            </Button>
            <Button variant="outline" className="font-armenian">
              <Eye className="w-4 h-4 mr-2" />
              Արտահանել
            </Button>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">47</div>
                <div className="text-sm font-armenian text-muted-foreground">Ավարտված մոդուլներ</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">124</div>
                <div className="text-sm font-armenian text-muted-foreground">Նոր գրանցումներ</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">89</div>
                <div className="text-sm font-armenian text-muted-foreground">Անցած քիզեր</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-sm font-armenian text-muted-foreground">Ակտիվ ժամեր</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Timeline */}
      <Card className="modern-card animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Վերջին գործունեություն
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="flex items-start gap-4 p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl hover:from-muted/40 hover:to-muted/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {getActivityIcon(activity.type)}
                <Badge className={`${getActivityBadgeColor(activity.type)} px-3 py-1 text-xs font-semibold`}>
                  {getActivityTypeLabel(activity.type)}
                </Badge>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold font-armenian">{activity.user}</h4>
                    <p className="text-muted-foreground">{activity.action}</p>
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {activity.timestamp}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-armenian text-muted-foreground">Տևողություն:</span>
                    <span className="font-semibold">{activity.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Live Activity Feed */}
      <Card className="modern-card animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Ուղիղ հոսք
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50 animate-pulse" />
            <h3 className="text-xl font-semibold font-armenian mb-2">Ուղիղ գործունեության հետևում</h3>
            <p className="text-muted-foreground font-armenian mb-6">
              Իրական ժամանակում հետևեք օգտատերերի գործունեությանը
            </p>
            <Button className="font-armenian btn-modern">
              <Activity className="w-4 h-4 mr-2" />
              Մշակման փուլում
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserActivityTab;
