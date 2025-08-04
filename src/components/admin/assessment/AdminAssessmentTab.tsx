
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FileText, Plus, Search, Clock, Users, Award, Edit, Eye, AlertCircle, Loader2 } from 'lucide-react';

const AdminAssessmentTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch real exams data from database
  const { data: exams, isLoading: isLoadingExams } = useQuery({
    queryKey: ['adminExams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch exam registrations for statistics
  const { data: examRegistrations, isLoading: isLoadingRegistrations } = useQuery({
    queryKey: ['examRegistrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exam_registrations')
        .select('exam_id, status, score');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Transform exams data to match the expected format
  const assessments = exams?.map(exam => {
    const registrations = examRegistrations?.filter(reg => reg.exam_id === exam.id) || [];
    const completed = registrations.filter(reg => reg.status === 'completed').length;
    const scores = registrations.filter(reg => reg.score !== null).map(reg => reg.score);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    return {
      id: exam.id,
      title: exam.title,
      type: 'exam',
      course: exam.title, // Using title as course for now
      duration: exam.duration_minutes,
      questions: null, // Not available in current schema
      participants: registrations.length,
      completed: completed,
      status: exam.is_active ? 'active' : 'draft',
      dueDate: exam.exam_date || exam.created_at,
      instructor: 'Դասախոս', // Not available in current schema
      avgScore: Math.round(avgScore)
    };
  }) || [];

  const filteredAssessments = assessments.filter(assessment =>
    assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'exam':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0';
      case 'assignment':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0';
      case 'quiz':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0';
      case 'completed':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0';
      case 'draft':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
    }
  };

  const getComplaintStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0';
      case 'under_review':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0';
      case 'resolved':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-armenian text-gradient">Գնահատման համակարգ</h2>
            <p className="text-muted-foreground font-armenian">Կառավարեք քննությունները, թեստերը և առաջադրանքները</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Tabs defaultValue="assessments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="assessments" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
              <FileText className="w-4 h-4 mr-2" />
              Գնահատումներ
            </TabsTrigger>
            <TabsTrigger value="complaints" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
              <AlertCircle className="w-4 h-4 mr-2" />
              Բողոքարկումներ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assessments" className="mt-6">
            <div className="space-y-6">
              {/* Search and Create */}
              <div className="flex justify-between items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Որոնել գնահատում..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="font-armenian btn-modern">
                      <Plus className="w-4 h-4 mr-2" />
                      Նոր գնահատում
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-armenian">Նոր գնահատում ստեղծել</DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-8">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="font-armenian text-muted-foreground">Գնահատման ստեղծման ձևաթուղթ</p>
                      <p className="text-sm text-muted-foreground">Մշակման փուլում</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Loading State */}
              {(isLoadingExams || isLoadingRegistrations) && (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2 font-armenian">Բեռնվում է...</span>
                </div>
              )}

              {/* Assessments Grid */}
              {!isLoadingExams && !isLoadingRegistrations && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredAssessments.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="font-armenian text-muted-foreground text-lg">Գնահատումներ չեն գտնվել</p>
                      <p className="text-sm text-muted-foreground mt-2">Ստեղծեք նոր գնահատում սկսելու համար</p>
                    </div>
                  ) : (
                     filteredAssessments.map((assessment, index) => (
                      <Card key={assessment.id} className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <CardHeader className="pb-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="font-armenian text-lg">{assessment.title}</CardTitle>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{assessment.course}</p>
                              <div className="flex gap-2">
                                <Badge className={getTypeBadge(assessment.type)}>
                                  {assessment.type === 'exam' ? 'Քննություն' : assessment.type === 'assignment' ? 'Առաջադրանք' : 'Թեստ'}
                                </Badge>
                                <Badge className={getStatusBadge(assessment.status)}>
                                  {assessment.status === 'active' ? 'Ակտիվ' : assessment.status === 'completed' ? 'Ավարտված' : 'Նախագիծ'}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-armenian text-muted-foreground">Դասախոս</span>
                              <p className="font-semibold">{assessment.instructor}</p>
                            </div>
                            <div>
                              <span className="text-sm font-armenian text-muted-foreground">Ժամկետ</span>
                              <p className="font-semibold">{new Date(assessment.dueDate).toLocaleDateString('hy-AM')}</p>
                            </div>
                            {assessment.duration && (
                              <div>
                                <span className="text-sm font-armenian text-muted-foreground">Տևողություն</span>
                                <p className="font-semibold flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {assessment.duration} րոպե
                                </p>
                              </div>
                            )}
                            {assessment.questions && (
                              <div>
                                <span className="text-sm font-armenian text-muted-foreground">Հարցեր</span>
                                <p className="font-semibold">{assessment.questions}</p>
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-armenian text-muted-foreground">Առաջընթաց</span>
                              <span className="text-sm font-semibold">{assessment.completed}/{assessment.participants}</span>
                            </div>
                            <Progress value={assessment.participants > 0 ? (assessment.completed / assessment.participants) * 100 : 0} className="h-2" />
                          </div>

                          <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                            <span className="text-sm font-armenian text-muted-foreground">Միջին գնահատական</span>
                            <span className="font-bold text-lg flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              {assessment.avgScore}%
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="complaints" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-armenian mb-2">Բողոքարկումներ և վերագնահատումներ</h3>
                <p className="text-muted-foreground font-armenian">Գնահատման դեմ ներկայացված բողոքները</p>
              </div>

              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="font-armenian text-muted-foreground text-lg">Բողոքարկումների համակարգ</p>
                <p className="text-sm text-muted-foreground mt-2">Մշակման փուլում</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAssessmentTab;
