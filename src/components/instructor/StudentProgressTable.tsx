
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { MessageSquare, Eye, Calendar, Users } from 'lucide-react';
import { StudentProgress } from '@/hooks/useInstructorDashboard';

interface StudentProgressTableProps {
  students: StudentProgress[];
  isLoading: boolean;
}

const StudentProgressTable = ({ students, isLoading }: StudentProgressTableProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Ուսանողների առաջընթաց</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: StudentProgress['status']) => {
    const variants = {
      active: { variant: 'default' as const, label: 'Ակտիվ', color: 'bg-green-100 text-green-800' },
      completed: { variant: 'secondary' as const, label: 'Ավարտված', color: 'bg-blue-100 text-blue-800' },
      inactive: { variant: 'outline' as const, label: 'Ապաակտիվ', color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = variants[status];
    return (
      <Badge className={`${config.color} font-armenian`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-armenian">Ուսանողների առաջընթաց</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold font-armenian">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">{student.courseName}</p>
                  </div>
                  
                  <div className="w-32">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-armenian">Առաջընթաց</span>
                      <span>{student.progress}%</span>
                    </div>
                    <Progress value={student.progress} className="h-2" />
                  </div>
                  
                  <div className="text-center">
                    {getStatusBadge(student.status)}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(student.enrolledDate).toLocaleDateString('hy-AM')}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {students.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-armenian">Ուսանողներ չկան</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentProgressTable;
