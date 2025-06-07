
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FileText, Plus, Search, Clock, Users, Award, Edit, Eye, AlertCircle } from 'lucide-react';

const AdminAssessmentTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock assessment data
  const assessments = [
    {
      id: '1',
      title: 'React հիմունքներ - Քննություն',
      type: 'exam',
      course: 'React հիմունքներ',
      duration: 120,
      questions: 25,
      participants: 45,
      completed: 38,
      status: 'active',
      dueDate: '2024-01-25',
      instructor: 'Արամ Ավետիսյան',
      avgScore: 78.5
    },
    {
      id: '2',
      title: 'JavaScript Առաջադրանք #3',
      type: 'assignment',
      course: 'JavaScript Առաջադեմ',
      duration: null,
      questions: null,
      participants: 32,
      completed: 28,
      status: 'active',
      dueDate: '2024-01-22',
      instructor: 'Մարիամ Գրիգորյան',
      avgScore: 85.2
    },
    {
      id: '3',
      title: 'UI/UX Թեստ',
      type: 'quiz',
      course: 'UI/UX Դիզայն',
      duration: 45,
      questions: 15,
      participants: 28,
      completed: 25,
      status: 'completed',
      dueDate: '2024-01-20',
      instructor: 'Լուսինե Մարտիրոսյան',
      avgScore: 92.1
    }
  ];

  const complaints = [
    {
      id: '1',
      student: 'Անի Սարգսյան',
      assessment: 'React հիմունքներ - Քննություն',
      reason: 'Տեխնիկական խնդիր',
      status: 'pending',
      submittedAt: '2024-01-16',
      description: 'Քննության ընթացքում ինտերնետի կապը խզվել է'
    },
    {
      id: '2',
      student: 'Դավիթ Հակոբյան',
      assessment: 'JavaScript Առաջադրանք #3',
      reason: 'Գնահատման բողոքարկում',
      status: 'under_review',
      submittedAt: '2024-01-15',
      description: 'Կարծում եմ, որ գնահատականը ճիշտ չէ'
    }
  ];

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

              {/* Assessments Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAssessments.map((assessment, index) => (
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
                        <Progress value={(assessment.completed / assessment.participants) * 100} className="h-2" />
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
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="complaints" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-armenian mb-2">Բողոքարկումներ և վերագնահատումներ</h3>
                <p className="text-muted-foreground font-armenian">Գնահատման դեմ ներկայացված բողոքները</p>
              </div>

              <div className="space-y-4">
                {complaints.map((complaint, index) => (
                  <Card key={complaint.id} className="modern-card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-edu-blue to-edu-orange flex items-center justify-center">
                              <AlertCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold font-armenian">{complaint.student}</h4>
                              <p className="text-sm text-muted-foreground">{complaint.assessment}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <span className="text-sm font-armenian text-muted-foreground">Պատճառ</span>
                              <p className="font-semibold">{complaint.reason}</p>
                            </div>
                            <div>
                              <span className="text-sm font-armenian text-muted-foreground">Ներկայացման ամսաթիվ</span>
                              <p className="font-semibold">{new Date(complaint.submittedAt).toLocaleDateString('hy-AM')}</p>
                            </div>
                            <div>
                              <span className="text-sm font-armenian text-muted-foreground">Կարգավիճակ</span>
                              <Badge className={getComplaintStatusBadge(complaint.status)}>
                                {complaint.status === 'pending' ? 'Սպասման մեջ' : 
                                 complaint.status === 'under_review' ? 'Քննարկման մեջ' : 'Լուծված'}
                              </Badge>
                            </div>
                          </div>

                          <div className="p-4 bg-muted/20 rounded-lg">
                            <span className="text-sm font-armenian text-muted-foreground">Նկարագրություն:</span>
                            <p className="mt-1">{complaint.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="font-armenian">
                            Քննարկել
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAssessmentTab;
