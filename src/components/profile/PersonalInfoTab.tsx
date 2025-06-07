
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useCertificates } from '@/hooks/useCertificates';
import { usePortfolios } from '@/hooks/usePortfolios';
import { BookOpen, Award, FolderOpen, Calendar, TrendingUp } from 'lucide-react';

interface PersonalInfoTabProps {
  profile: any;
}

const PersonalInfoTab = ({ profile }: PersonalInfoTabProps) => {
  const { data: enrollments } = useEnrollments();
  const { data: certificates } = useCertificates();
  const { data: portfolios } = usePortfolios();

  const activeEnrollments = enrollments?.filter(e => !e.completed_at) || [];
  const completedCourses = enrollments?.filter(e => e.completed_at) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Ընթացիկ դասընթացներ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold">{activeEnrollments.length}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Ավարտված դասընթացներ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold">{completedCourses.length}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Վկայականներ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="text-2xl font-bold">{certificates?.length || 0}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Նախագծեր</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-purple-500" />
            <span className="text-2xl font-bold">{portfolios?.length || 0}</span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="font-armenian">Վերջին գործունեությունը</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeEnrollments.slice(0, 3).map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Ընթացիկ դասընթաց</p>
                    <p className="text-sm text-muted-foreground">
                      Առաջընթաց: {enrollment.progress_percentage || 0}%
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Տեսնել
                </Button>
              </div>
            ))}
            
            {activeEnrollments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Ընթացիկ դասընթացներ չկան</p>
                <p className="text-sm">Սկսեք նոր դասընթաց՝ ձեր գիտելիքները ընդլայնելու համար</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoTab;
