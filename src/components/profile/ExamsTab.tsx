
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useExams, useExamRegistrations, useRegisterForExam } from '@/hooks/useExams';
import { GraduationCap, Clock, Calendar, Award, BookOpen } from 'lucide-react';

const ExamsTab = () => {
  const { data: exams, isLoading: examsLoading } = useExams();
  const { data: registrations, isLoading: registrationsLoading } = useExamRegistrations();
  const registerMutation = useRegisterForExam();

  if (examsLoading || registrationsLoading) {
    return <div className="animate-pulse">Բեռնվում է...</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Ավարտված</Badge>;
      case 'missed':
        return <Badge variant="destructive">Բաց թողնված</Badge>;
      default:
        return <Badge variant="secondary">Գրանցված</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* My Exam Registrations */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Իմ քննությունները</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {registrations?.map((registration) => (
              <div key={registration.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{registration.exams?.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {registration.exams?.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {registration.exams?.exam_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(registration.exams.exam_date).toLocaleDateString('hy-AM')}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {registration.exams?.duration_minutes} րոպե
                      </div>
                      {registration.score !== null && (
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {registration.score}/{registration.exams?.max_score}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge(registration.status)}
                  </div>
                </div>
              </div>
            ))}
            
            {(!registrations || registrations.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-armenian">Քննական գրանցումներ չկան</p>
                <p className="text-sm">Գրանցվեք քննությունների համար ստորև</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Exams */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Հասանելի քննություններ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exams?.map((exam) => (
              <div key={exam.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{exam.title}</h4>
                    {exam.description && (
                      <p className="text-sm text-muted-foreground mb-2">{exam.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {exam.modules?.title && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {exam.modules.title}
                        </div>
                      )}
                      {exam.exam_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(exam.exam_date).toLocaleDateString('hy-AM')}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {exam.duration_minutes} րոպե
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => registerMutation.mutate(exam.id)}
                    disabled={registrations?.some(reg => reg.exam_id === exam.id)}
                  >
                    {registrations?.some(reg => reg.exam_id === exam.id) ? 'Գրանցված եք' : 'Գրանցվել'}
                  </Button>
                </div>
              </div>
            ))}
            
            {(!exams || exams.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-armenian">Քննություններ չկան</p>
                <p className="text-sm">Այս պահին հասանելի քննություն չկա</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamsTab;
