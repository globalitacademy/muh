
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useCertificates } from '@/hooks/useCertificates';
import { usePortfolios } from '@/hooks/usePortfolios';
import { BookOpen, Award, FolderOpen, Calendar, TrendingUp, Clock, Target, Star } from 'lucide-react';
import SkillsSection from './SkillsSection';
import ActivityChart from './ActivityChart';
import GoalsSection from './GoalsSection';

interface EnhancedPersonalInfoTabProps {
  profile: any;
}

const EnhancedPersonalInfoTab = ({ profile }: EnhancedPersonalInfoTabProps) => {
  const { data: enrollments } = useEnrollments();
  const { data: certificates } = useCertificates();
  const { data: portfolios } = usePortfolios();

  const activeEnrollments = enrollments?.filter(e => !e.completed_at) || [];
  const completedCourses = enrollments?.filter(e => e.completed_at) || [];

  // Calculate achievement level
  const totalAchievements = completedCourses.length + (certificates?.length || 0) + (portfolios?.length || 0);
  const getAchievementLevel = () => {
    if (totalAchievements >= 20) return { level: 'Փորձագետ', color: 'bg-purple-100 text-purple-800', stars: 5 };
    if (totalAchievements >= 15) return { level: 'Առաջադեմ', color: 'bg-blue-100 text-blue-800', stars: 4 };
    if (totalAchievements >= 10) return { level: 'Զարգացող', color: 'bg-green-100 text-green-800', stars: 3 };
    if (totalAchievements >= 5) return { level: 'Սկսնակ', color: 'bg-yellow-100 text-yellow-800', stars: 2 };
    return { level: 'Նորեկ', color: 'bg-gray-100 text-gray-800', stars: 1 };
  };

  const achievementLevel = getAchievementLevel();

  return (
    <div className="space-y-8">
      {/* Enhanced Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ընթացիկ դասընթացներ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <span className="text-3xl font-bold text-blue-600">{activeEnrollments.length}</span>
                <p className="text-xs text-muted-foreground font-armenian">Ակտիվ կուրսեր</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ավարտված դասընթացներ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <span className="text-3xl font-bold text-green-600">{completedCourses.length}</span>
                <p className="text-xs text-muted-foreground font-armenian">Հաջողված</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-bl-full"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Վկայականներ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <span className="text-3xl font-bold text-yellow-600">{certificates?.length || 0}</span>
                <p className="text-xs text-muted-foreground font-armenian">Ստացված</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Նախագծեր</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FolderOpen className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <span className="text-3xl font-bold text-purple-600">{portfolios?.length || 0}</span>
                <p className="text-xs text-muted-foreground font-armenian">Իրականացված</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Level */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-6 h-6 ${i < achievementLevel.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <div>
                <h3 className="text-xl font-bold font-armenian">Մակարդակ՝ {achievementLevel.level}</h3>
                <p className="text-muted-foreground">Ընդհանուր ձեռքբերումներ՝ {totalAchievements}</p>
              </div>
            </div>
            <Badge variant="secondary" className={achievementLevel.color}>
              {achievementLevel.level}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Activity Visualization */}
      <ActivityChart />

      {/* Skills Section */}
      <SkillsSection />

      {/* Goals Section */}
      <GoalsSection />

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Վերջին գործունեությունը
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeEnrollments.slice(0, 3).map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/50 to-transparent border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium">Ընթացիկ դասընթաց</p>
                    <p className="text-sm text-muted-foreground">
                      Առաջընթաց: {enrollment.progress_percentage || 0}%
                    </p>
                    <div className="w-32 h-1 bg-muted rounded-full mt-1">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress_percentage || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="font-armenian">
                  Շարունակել
                </Button>
              </div>
            ))}
            
            {activeEnrollments.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2 font-armenian">Ընթացիկ դասընթացներ չկան</h3>
                <p className="font-armenian">Սկսեք նոր դասընթաց՝ ձեր գիտելիքները ընդլայնելու համար</p>
                <Button className="mt-4 font-armenian">
                  Գտնել դասընթացներ
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPersonalInfoTab;
