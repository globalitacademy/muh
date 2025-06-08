
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { Activity, TrendingUp, Clock, Target } from 'lucide-react';

const ActivityChart = () => {
  const weeklyData = [
    { day: 'Երկ', hours: 3, completed: 2 },
    { day: 'Երք', hours: 4, completed: 3 },
    { day: 'Չոր', hours: 2, completed: 1 },
    { day: 'Հնգ', hours: 5, completed: 4 },
    { day: 'Ուրբ', hours: 3, completed: 2 },
    { day: 'Շաբ', hours: 6, completed: 5 },
    { day: 'Կիր', hours: 4, completed: 3 },
  ];

  const monthlyProgress = [
    { month: 'Հուն', progress: 65 },
    { month: 'Հուլ', progress: 78 },
    { month: 'Օգս', progress: 82 },
    { month: 'Սեպ', progress: 88 },
    { month: 'Հոկ', progress: 92 },
    { month: 'Նոյ', progress: 95 },
  ];

  const totalHours = weeklyData.reduce((sum, day) => sum + day.hours, 0);
  const totalCompleted = weeklyData.reduce((sum, day) => sum + day.completed, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalHours}</p>
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
                <p className="text-xs text-muted-foreground font-armenian">Ավարտված առաջադրանք</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">95%</p>
                <p className="text-xs text-muted-foreground font-armenian">Ընդհանուր առաջընթաց</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">12</p>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityChart;
