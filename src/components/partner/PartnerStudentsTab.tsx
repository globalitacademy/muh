import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface EnrollmentWithDetails {
  id: string;
  enrollment_status: string;
  enrolled_at: string;
  course_id: string;
  student_id: string;
  notes?: string;
  partner_courses: {
    title: string;
  } | null;
  profiles: {
    name: string;
    email?: string;
  } | null;
}

export default function PartnerStudentsTab() {
  const { user } = useAuth();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['partner-enrollments', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_course_enrollments')
        .select(`
          *,
          partner_courses(title),
          profiles!inner(name, email)
        `)
        .eq('partner_id', user?.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      return data as any;
    },
    enabled: !!user?.id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Հաստատված';
      case 'pending':
        return 'Սպասում է';
      case 'rejected':
        return 'Մերժված';
      case 'completed':
        return 'Ավարտված';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Դեռ չկան գրանցված ուսանողներ ձեր դասընթացներում
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Գրանցված ուսանողներ</h2>
        <p className="text-muted-foreground">
          Ձեր դասընթացներին գրանցված ուսանողների ցանկը
        </p>
      </div>

      <div className="space-y-4">
        {enrollments.map((enrollment) => (
          <Card key={enrollment.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {enrollment.profiles?.name || 'Անանուն ուսանող'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {enrollment.partner_courses?.title}
                  </p>
                </div>
                <Badge className={getStatusColor(enrollment.enrollment_status)}>
                  {getStatusText(enrollment.enrollment_status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enrollment.profiles?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{enrollment.profiles.email}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Գրանցվել է՝ {format(new Date(enrollment.enrolled_at), 'dd/MM/yyyy')}
                  </span>
                </div>
              </div>

              {enrollment.notes && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Գրառումներ:</p>
                  <p className="text-sm">{enrollment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}