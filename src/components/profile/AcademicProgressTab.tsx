
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useEnrollments } from '@/hooks/useEnrollments';
import { BookOpen, Clock, Star, TrendingUp } from 'lucide-react';

const AcademicProgressTab = () => {
  const { data: enrollments, isLoading } = useEnrollments();

  if (isLoading) {
    return <div className="animate-pulse">Բեռնվում է...</div>;
  }

  const activeEnrollments = enrollments?.filter(e => !e.completed_at) || [];
  const completedEnrollments = enrollments?.filter(e => e.completed_at) || [];

  const totalProgress = enrollments?.length > 0 
    ? enrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / enrollments.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Ընդհանուր առաջընթաց</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ամբողջական առաջընթաց</span>
              <span className="text-sm text-muted-foreground">{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{activeEnrollments.length}</div>
                <div className="text-sm text-muted-foreground">Ընթացիկ դասընթացներ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedEnrollments.length}</div>
                <div className="text-sm text-muted-foreground">Ավարտված դասընթացներ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{enrollments?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Ընդհանուր դասընթացներ</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Ընթացիկ դասընթացներ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold font-armenian">Դասընթաց</h4>
                    <p className="text-sm text-muted-foreground">
                      Սկսված: {new Date(enrollment.enrolled_at).toLocaleDateString('hy-AM')}
                    </p>
                  </div>
                  <Badge variant="secondary">Ընթացիկ</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Առաջընթաց</span>
                    <span>{enrollment.progress_percentage || 0}%</span>
                  </div>
                  <Progress value={enrollment.progress_percentage || 0} className="h-2" />
                </div>
              </div>
            ))}
            
            {activeEnrollments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-armenian">Ընթացիկ դասընթացներ չկան</p>
                <p className="text-sm">Սկսեք նոր դասընթաց՝ ձեր գիտելիքները ընդլայնելու համար</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completed Courses */}
      {completedEnrollments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-armenian">Ավարտված դասընթացներ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold font-armenian">Դասընթաց</h4>
                      <p className="text-sm text-muted-foreground">
                        Ավարտված: {enrollment.completed_at ? new Date(enrollment.completed_at).toLocaleDateString('hy-AM') : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <Star className="w-3 h-3 mr-1" />
                        Ավարտված
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AcademicProgressTab;
