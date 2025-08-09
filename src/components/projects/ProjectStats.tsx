import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FolderKanban, Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Project } from '@/hooks/useProjects';

interface ProjectStatsProps {
  projects: Project[];
  userRole?: string;
}

const ProjectStats: React.FC<ProjectStatsProps> = ({ projects, userRole }) => {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const pendingProjects = projects.filter(p => p.status === 'pending').length;
  
  const completionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;
  const activeRate = totalProjects > 0 ? (activeProjects / totalProjects) * 100 : 0;

  const stats = [
    {
      title: 'Ընդամենը նախագծեր',
      value: totalProjects,
      icon: FolderKanban,
      color: 'bg-edu-blue',
      trend: '+12%'
    },
    {
      title: 'Ակտիվ նախագծեր',
      value: activeProjects,
      icon: Clock,
      color: 'bg-success-green',
      progress: activeRate
    },
    {
      title: 'Ավարտված նախագծեր',
      value: completedProjects,
      icon: CheckCircle,
      color: 'bg-edu-purple',
      progress: completionRate
    },
    {
      title: 'Սպասման մեջ',
      value: pendingProjects,
      icon: Users,
      color: 'bg-warning-yellow',
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 text-white p-1 rounded ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            
            {stat.progress !== undefined && (
              <div className="mt-2 space-y-1">
                <Progress value={stat.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {stat.progress.toFixed(1)}% of total
                </p>
              </div>
            )}
            
            {stat.trend && (
              <div className="flex items-center gap-1 text-xs text-success-green mt-1">
                <TrendingUp className="h-3 w-3" />
                {stat.trend} this month
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectStats;