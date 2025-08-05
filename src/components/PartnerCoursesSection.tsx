import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Calendar, DollarSign, Building2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface PartnerCourse {
  id: string;
  title: string;
  description?: string;
  duration_weeks: number;
  price: number;
  max_students?: number;
  current_students: number;
  start_date?: string;
  image_url?: string;
  partner_institutions: {
    institution_name: string;
    logo_url?: string;
  } | null;
}

export default function PartnerCoursesSection() {
  const navigate = useNavigate();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['public-partner-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_courses')
        .select(`
          *,
          partner_institutions(institution_name, logo_url)
        `)
        .eq('status', 'published')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as PartnerCourse[];
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-armenian">
              Գործընկերների առաջարկներ
            </h2>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!courses || courses.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="content-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-armenian">
            Գործընկերների առաջարկներ
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-armenian">
            Մեր գործընկեր ուսումնական հաստատությունների առաջարկած մասնավոր դասընթացները
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {courses.map((course) => (
            <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {course.partner_institutions?.logo_url ? (
                      <img 
                        src={course.partner_institutions.logo_url} 
                        alt={course.partner_institutions.institution_name}
                        className="h-8 w-8 object-contain rounded"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-primary" />
                    )}
                    <div className="text-xs text-muted-foreground">
                      {course.partner_institutions?.institution_name}
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    Մասնավոր
                  </Badge>
                </div>
                
                {course.image_url && (
                  <div className="w-full h-32 mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={course.image_url} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <CardTitle className="text-lg group-hover:text-primary transition-colors font-armenian">
                  {course.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {course.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 font-armenian">
                    {course.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{course.duration_weeks} շաբաթ</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-primary">
                      {course.price === 0 ? 'անվճար' : `${course.price} դրամ`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {course.current_students}/{course.max_students || '∞'}
                    </span>
                  </div>

                  {course.start_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">
                        {format(new Date(course.start_date), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  )}
                </div>

                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors font-armenian"
                  onClick={() => {
                    // For now, show more info - could link to detailed course page later
                    navigate(`/courses`);
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Դիտել մանրամասները
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/courses')}
            className="font-armenian"
          >
            Դիտել բոլոր առաջարկները
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}