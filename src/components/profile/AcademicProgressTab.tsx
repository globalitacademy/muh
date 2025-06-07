
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useUserProgress } from '@/hooks/useUserProgress';
import { BookOpen, TrendingUp, Award, Clock } from 'lucide-react';
import LearningProgressCard from './LearningProgressCard';

const AcademicProgressTab = () => {
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();
  const { data: userProgress, isLoading: progressLoading } = useUserProgress();

  if (enrollmentsLoading || progressLoading) {
    return <div className="animate-pulse">Բեռնվում է...</div>;
  }

  const activeEnrollments = enrollments?.filter(e => !e.completed_at) || [];
  const completedEnrollments = enrollments?.filter(e => e.completed_at) || [];

  const totalProgress = enrollments?.length > 0 
    ? enrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / enrollments.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Overall Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeEnrollments.length}</p>
                <p className="text-sm text-muted-foreground">Ընթացիկ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedEnrollments.length}</p>
                <p className="text-sm text-muted-foreground">Ավարտված</p>
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
                <p className="text-2xl font-bold">{Math.round(totalProgress)}%</p>
                <p className="text-sm text-muted-foreground">Ընդհանուր</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userProgress?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Թեմաներ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Ընդհանուր առաջընթաց</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Ամբողջական առաջընթաց</span>
              <span>{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Active Courses */}
      {activeEnrollments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold font-armenian">Ընթացիկ դասընթացներ</h3>
          <div className="grid gap-4">
            {activeEnrollments.map((enrollment) => (
              <LearningProgressCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Courses */}
      {completedEnrollments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold font-armenian">Ավարտված դասընթացներ</h3>
          <div className="grid gap-4">
            {completedEnrollments.map((enrollment) => (
              <LearningProgressCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        </div>
      )}

      {/* No enrollments state */}
      {(!enrollments || enrollments.length === 0) && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-armenian text-lg">Դասընթացներ չկան</p>
              <p className="text-sm">Սկսեք ձեր առաջին դասընթացը՝ ուսուցման համար</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AcademicProgressTab;
