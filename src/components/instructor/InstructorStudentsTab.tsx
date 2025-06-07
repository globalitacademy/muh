
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useInstructorStudents } from '@/hooks/useInstructorStudents';
import { User, MessageSquare, TrendingUp, CheckCircle } from 'lucide-react';

const InstructorStudentsTab = () => {
  const { data: students, isLoading } = useInstructorStudents();

  if (isLoading) {
    return <div className="animate-pulse font-armenian">Բեռնվում է...</div>;
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-armenian">Ուսանողներ</h2>
        <div className="text-sm text-muted-foreground">
          Ընդհանուր: {students?.length || 0} ուսանող
        </div>
      </div>

      {/* Students List */}
      <div className="grid gap-4">
        {students?.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold font-armenian">
                      {student.profiles?.name || 'Անանուն ուսանող'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {student.modules?.title}
                      {student.profiles?.group_number && (
                        <span> • Խումբ {student.profiles.group_number}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">
                        {student.progress_percentage || 0}%
                      </span>
                    </div>
                    <Progress 
                      value={student.progress_percentage || 0} 
                      className="w-24 h-2"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {student.completed_at ? (
                      <Badge className="bg-green-100 text-green-800 font-armenian">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ավարտված
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="font-armenian">
                        Ընթացիկ
                      </Badge>
                    )}
                  </div>

                  <Button variant="ghost" size="sm" className="font-armenian">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Հաղորդագրություն
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground font-armenian">Գրանցվել է</p>
                  <p className="font-medium">
                    {new Date(student.enrolled_at).toLocaleDateString('hy-AM')}
                  </p>
                </div>
                {student.completed_at && (
                  <div>
                    <p className="text-muted-foreground font-armenian">Ավարտվել է</p>
                    <p className="font-medium">
                      {new Date(student.completed_at).toLocaleDateString('hy-AM')}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground font-armenian">Կարգավիճակ</p>
                  <div className={`w-3 h-3 rounded-full ${getProgressColor(student.progress_percentage || 0)}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {(!students || students.length === 0) && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-armenian text-lg">Ուսանողներ չկան</p>
              <p className="text-sm">Ձեր դասընթացներին դեռ ուսանողներ չեն գրանցվել</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InstructorStudentsTab;
