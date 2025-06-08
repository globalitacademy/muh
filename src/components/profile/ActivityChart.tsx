
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, TrendingUp, Clock, Target, Loader2 } from 'lucide-react';
import { useUserActivity } from '@/hooks/useUserActivity';
import { useUserGoals } from '@/hooks/useUserGoals';

const ActivityChart = () => {
  const { data: activities = [], isLoading: activitiesLoading } = useUserActivity();
  const { data: goals = [], isLoading: goalsLoading } = useUserGoals();

  const isLoading = activitiesLoading || goalsLoading;

  // Process weekly activity data
  const getWeeklyData = () => {
    const weekDays = ['Կիր', 'Երկ', 'Երք', 'Չոր', 'Հնգ', 'Ուրբ', 'Շաբ'];
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayActivities = activities.filter(activity => activity.date === dateStr);
      const hours = dayActivities.reduce((sum, activity) => 
        sum + (activity.duration_minutes || 0), 0) / 60;
      const completed = dayActivities.length;

      weekData.push({
        day: weekDays[date.getDay()],
        hours: Math.round(hours * 10) / 10,
        completed
      });
    }

    return weekData;
  };

  // Process monthly progress data
  const getMonthlyProgress = () => {
    const months = ['Հոկ', 'Նոյ', 'Դեկ', 'Հուն', 'Փետ', 'Մար'];
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthGoals = goals.filter(goal => {
        if (!goal.deadline) return false;
        const goalDate = new Date(goal.deadline);
        return goalDate.getMonth() === date.getMonth() && 
               goalDate.getFullYear() === date.getFullYear();
      });

      const averageProgress = monthGoals.length > 0 
        ? Math.round(monthGoals.reduce((sum, goal) => sum + goal.progress, 0) / monthGoals.length)
        : 0;

      monthlyData.push({
        month: months[i] || date.toLocaleDateString('hy-AM', { month: 'short' }),
        progress: averageProgress
      });
    }

    return monthlyData;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const weeklyData = getWeeklyData();
  const monthlyProgress = getMonthlyProgress();
  
  const totalHours = weeklyData.reduce((sum, day) => sum + day.hours, 0);
  const totalCompleted = weeklyData.reduce((sum, day) => sum + day.completed, 0);
  const activeDays = weeklyData.filter(day => day.hours > 0).length;
  const averageProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground font-armenian">Ժամ այս շաբաթ</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{totalCompleted}</p>
                <p className="text-xs text-muted-foreground font-armenian">Ավարտված գործունեություն</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{averageProgress}%</p>
                <p className="text-xs text-muted-foreground font-armenian">Միջին առաջընթաց</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{activeDays}</p>
                <p className="text-xs text-muted-foreground font-armenian">Ակտիվ օր</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Շաբաթական գործունեություն
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weeklyData.some(day => day.hours > 0 || day.completed > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="hours" fill="#3b82f6" name="Ժամեր" />
                <Bar dataKey="completed" fill="#10b981" name="Ավարտված" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-armenian">Գործունեություն չի գրանցվել այս շաբաթ</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Ամսական առաջընթաց
          </CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyProgress.some(month => month.progress > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="progress" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.3}
                  name="Առաջընթաց %"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-armenian">Առաջընթաց չի գրանցվել</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityChart;
