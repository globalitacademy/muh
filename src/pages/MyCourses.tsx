
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useModules } from '@/hooks/useModules';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Award, ArrowRight } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const MyCourses = () => {
  const { user, loading } = useAuth();
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();
  const { data: modules } = useModules();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const enrolledModules = enrollments?.map(enrollment => {
    const module = modules?.find(m => m.id === enrollment.module_id);
    return module ? { ...module, enrollment } : null;
  }).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-armenian mb-2">Իմ դասընթացները</h1>
          <p className="text-muted-foreground font-armenian">
            Շարունակեք ձեր ուսումնական ճանապարհորդությունը
          </p>
        </div>

        {enrollmentsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-edu-blue" />
          </div>
        ) : enrolledModules.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold font-armenian">
                  Դուք դեռ չեք գրանցվել որևէ դասընթացի
                </h3>
                <p className="text-muted-foreground font-armenian">
                  Ուսումնասիրեք մեր մոդուլները և սկսեք ուսումը
                </p>
              </div>
              <Button onClick={() => navigate('/')} className="font-armenian">
                Ցուցադրել դասընթացները
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledModules.map((moduleData: any) => (
              <Card key={moduleData.id} className="modern-card course-card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-armenian line-clamp-2">
                        {moduleData.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1 font-armenian">
                        {moduleData.instructor}
                      </p>
                    </div>
                    {moduleData.image_url && (
                      <img
                        src={moduleData.image_url}
                        alt={moduleData.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-armenian">Առաջընթաց</span>
                      <span>{moduleData.enrollment.progress_percentage}%</span>
                    </div>
                    <Progress value={moduleData.enrollment.progress_percentage} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-armenian">{moduleData.duration_weeks} շաբաթ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span className="font-armenian">{moduleData.total_lessons} դաս</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => navigate(`/course/${moduleData.id}`)}
                      className="flex-1 btn-modern font-armenian"
                    >
                      Շարունակել
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                    {moduleData.enrollment.progress_percentage === 100 && (
                      <Button variant="outline" size="icon" title="Վկայագիր">
                        <Award className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
