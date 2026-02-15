import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  Building2, 
  Mail, 
  User, 
  Phone,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface PartnerCourse {
  id: string;
  partner_id: string;
  title: string;
  description?: string;
  duration_weeks: number;
  price: number;
  max_students?: number;
  current_students: number;
  start_date?: string;
  end_date?: string;
  application_deadline?: string;
  requirements?: string;
  image_url?: string;
  partner_institutions: {
    institution_name: string;
    logo_url?: string;
    contact_email?: string;
    contact_phone?: string;
    address?: string;
  } | null;
}

export default function PartnerCourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isApplying, setIsApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const { data: course, isLoading } = useQuery({
    queryKey: ['partner-course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_courses')
        .select(`
          *,
          partner_institutions(
            institution_name,
            logo_url,
            contact_email,
            contact_phone,
            address
          )
        `)
        .eq('id', courseId)
        .eq('status', 'published')
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data as PartnerCourse;
    },
    enabled: !!courseId,
  });

  const applyMutation = useMutation({
    mutationFn: async (data: typeof applicationData) => {
      const { error } = await supabase
        .from('partner_course_enrollments')
        .insert({
          course_id: courseId,
          student_id: user?.id || null,
          partner_id: course?.partner_id,
          enrollment_status: 'pending',
          notes: `Անուն: ${data.name}\nԷլ. փոստ: ${data.email}\nՀեռախոս: ${data.phone}\nՀաղորդագրություն: ${data.message}`
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Հաջողություն",
        description: "Ձեր դիմումը ուղարկվել է։ Ճշտություն կտանք շուտով։",
      });
      setShowApplicationForm(false);
      setApplicationData({ name: '', email: '', phone: '', message: '' });
      queryClient.invalidateQueries({ queryKey: ['partner-course', courseId] });
    },
    onError: () => {
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց ուղարկել դիմումը։ Խնդրում ենք կրկին փորձել։",
        variant: "destructive",
      });
    },
  });

  const handleApply = () => {
    if (user) {
      // Pre-fill with user data if available
      setApplicationData({
        name: user.user_metadata?.name || '',
        email: user.email || '',
        phone: '',
        message: ''
      });
    }
    setShowApplicationForm(true);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    applyMutation.mutate(applicationData);
    setIsApplying(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Դասընթացը չի գտնվել</h1>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Վերադառնալ գլխավոր էջ
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Վերադառնալ
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    {course.partner_institutions?.logo_url ? (
                      <img 
                        src={course.partner_institutions.logo_url} 
                        alt={course.partner_institutions.institution_name}
                        className="h-12 w-12 object-contain rounded"
                      />
                    ) : (
                      <Building2 className="h-12 w-12 text-primary" />
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {course.partner_institutions?.institution_name}
                      </p>
                      <Badge variant="secondary">Մասնավոր դասընթաց</Badge>
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl font-bold font-armenian">
                    {course.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  {course.image_url && (
                    <img 
                      src={course.image_url} 
                      alt={course.title}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}
                  
                  {course.description && (
                    <p className="text-lg text-muted-foreground font-armenian leading-relaxed">
                      {course.description}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Course Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-armenian">Դասընթացի մանրամասները</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Տևողություն</p>
                        <p className="text-sm text-muted-foreground">{course.duration_weeks} շաբաթ</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Գին</p>
                        <p className="text-sm text-muted-foreground">
                          {course.price === 0 ? 'Անվճար' : `${course.price} դրամ`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Ուսանողներ</p>
                        <p className="text-sm text-muted-foreground">
                          {course.current_students}/{course.max_students || '∞'} գրանցված
                        </p>
                      </div>
                    </div>

                    {course.start_date && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Սկսում</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(course.start_date), 'dd MMMM yyyy')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {course.requirements && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Պահանջներ</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {course.requirements}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Application Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-armenian">Դիմել դասընթացին</CardTitle>
                </CardHeader>
                <CardContent>
                  {!showApplicationForm ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary mb-2">
                          {course.price === 0 ? 'Անվճար' : `${course.price} դրամ`}
                        </p>
                        {course.application_deadline && (
                          <p className="text-sm text-muted-foreground mb-4">
                            Դիմումների վերջնաժամկետ՝ {format(new Date(course.application_deadline), 'dd MMMM yyyy')}
                          </p>
                        )}
                      </div>
                      
                      <Button 
                        onClick={handleApply}
                        className="w-full font-armenian"
                        size="lg"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Դիմել հիմա
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitApplication} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Անուն *</Label>
                        <Input
                          id="name"
                          value={applicationData.name}
                          onChange={(e) => setApplicationData({...applicationData, name: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Էլ. փոստ *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={applicationData.email}
                          onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Հեռախոս</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={applicationData.phone}
                          onChange={(e) => setApplicationData({...applicationData, phone: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Հաղորդագրություն</Label>
                        <Textarea
                          id="message"
                          value={applicationData.message}
                          onChange={(e) => setApplicationData({...applicationData, message: e.target.value})}
                          placeholder="Ավելացուցիչ տեղեկություններ կամ հարցեր"
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          type="submit" 
                          disabled={isApplying || applyMutation.isPending}
                          className="flex-1"
                        >
                          {(isApplying || applyMutation.isPending) ? 'Ուղարկում...' : 'Ուղարկել դիմումը'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setShowApplicationForm(false)}
                        >
                          Չեղարկել
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>

              {/* Institution Contact */}
              {course.partner_institutions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-armenian">Կապ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <h4 className="font-medium">{course.partner_institutions.institution_name}</h4>
                    
                    {course.partner_institutions.contact_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`mailto:${course.partner_institutions.contact_email}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {course.partner_institutions.contact_email}
                        </a>
                      </div>
                    )}
                    
                    {course.partner_institutions.contact_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`tel:${course.partner_institutions.contact_phone}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {course.partner_institutions.contact_phone}
                        </a>
                      </div>
                    )}
                    
                    {course.partner_institutions.address && (
                      <div className="flex items-start gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {course.partner_institutions.address}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}