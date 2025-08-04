import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, Filter, Users, BookOpen, BarChart3, GraduationCap, Award, UserCheck } from 'lucide-react';
import { useReportsData } from '@/hooks/useReportsData';
import { format } from 'date-fns';

const AdminReportsTab = () => {
  const { data: reportsData, isLoading, error } = useReportsData();

  const reports = [
    {
      id: 1,
      name: 'Օգտատերերի հաշվետվություն',
      description: 'Բոլոր օգտատերերի մանրամասն ցանկ և վիճակագրություն',
      type: 'users',
      icon: Users,
      lastGenerated: format(new Date(), 'yyyy-MM-dd'),
      size: `${((reportsData?.totalUsers || 0) * 0.15).toFixed(1)} KB`,
      count: reportsData?.totalUsers || 0
    },
    {
      id: 2,
      name: 'Դասընթացների վիճակագրություն',
      description: 'Բոլոր մոդուլների և գրանցումների վերլուծություն',
      type: 'courses',
      icon: BookOpen,
      lastGenerated: format(new Date(), 'yyyy-MM-dd'),
      size: `${((reportsData?.totalModules || 0) * 0.25).toFixed(1)} KB`,
      count: reportsData?.totalModules || 0
    },
    {
      id: 3,
      name: 'Գրանցումների հաշվետվություն',
      description: 'Ուսանողների գրանցումների և առաջընթացի վերլուծություն',
      type: 'enrollments',
      icon: UserCheck,
      lastGenerated: format(new Date(), 'yyyy-MM-dd'),
      size: `${((reportsData?.totalEnrollments || 0) * 0.18).toFixed(1)} KB`,
      count: reportsData?.totalEnrollments || 0
    },
    {
      id: 4,
      name: 'Վկայականների հաշվետվություն',
      description: 'Տրված վկայականների և ավարտական վիճակագրություն',
      type: 'certificates',
      icon: Award,
      lastGenerated: format(new Date(), 'yyyy-MM-dd'),
      size: `${((reportsData?.recentCertificates || 0) * 0.12).toFixed(1)} KB`,
      count: reportsData?.recentCertificates || 0
    }
  ];

  const handleGenerateReport = (reportId: number) => {
    const report = reports.find(r => r.id === reportId);
    console.log(`Generating ${report?.type} report with ${report?.count} records`);
  };

  const handleDownloadReport = (reportId: number) => {
    const report = reports.find(r => r.id === reportId);
    console.log(`Downloading ${report?.type} report`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-edu-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-armenian">Սխալ տվյալների բեռնման ժամանակ</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-0">
      {/* Header */}
      <div className="glass-card rounded-2xl p-4 md:p-6 animate-fade-in-up">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-armenian text-gradient">Հաշվետվություններ</h2>
              <p className="text-sm md:text-base text-muted-foreground font-armenian">Ստեղծեք և ներբեռնեք համակարգի հաշվետվությունները</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <Button variant="outline" className="font-armenian text-sm">
              <Filter className="w-4 h-4 mr-2" />
              Զտել
            </Button>
            <Button variant="outline" className="font-armenian text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Ժամանակահատված
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">{reportsData?.totalUsers || 0}</div>
                <div className="text-xs md:text-sm font-armenian text-muted-foreground">Ընդամենը օգտատերեր</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">{reportsData?.totalModules || 0}</div>
                <div className="text-xs md:text-sm font-armenian text-muted-foreground">Ընդամենը մոդուլներ</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <UserCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">{reportsData?.totalEnrollments || 0}</div>
                <div className="text-xs md:text-sm font-armenian text-muted-foreground">Ընդամենը գրանցումներ</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">{reportsData?.monthlyActivity || 0}</div>
                <div className="text-xs md:text-sm font-armenian text-muted-foreground">Այս ամիս ակտիվություն</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report, index) => (
          <Card key={report.id} className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: `${0.1 * (index + 5)}s` }}>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6 flex-1">
                  <div className="p-3 md:p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl">
                    <report.icon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-semibold font-armenian mb-2">{report.name}</h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-4">{report.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-sm">
                      <div>
                        <span className="font-medium font-armenian text-muted-foreground">Վերջին գեներացիա:</span>
                        <p className="font-semibold break-words">{report.lastGenerated}</p>
                      </div>
                      <div>
                        <span className="font-medium font-armenian text-muted-foreground">Ֆայլի չափ:</span>
                        <p className="font-semibold">{report.size}</p>
                      </div>
                      <div>
                        <span className="font-medium font-armenian text-muted-foreground">Տվյալների քանակ:</span>
                        <p className="font-semibold">{report.count}</p>
                      </div>
                      <div>
                        <span className="font-medium font-armenian text-muted-foreground">Տիպ:</span>
                        <p className="font-semibold capitalize">{report.type}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateReport(report.id)}
                    className="font-armenian text-sm"
                    size="sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Գեներացնել
                  </Button>
                  <Button
                    onClick={() => handleDownloadReport(report.id)}
                    className="font-armenian btn-modern text-sm"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Ներբեռնել
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Report Builder */}
      <Card className="modern-card animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2 text-lg md:text-xl">
            <BarChart3 className="w-5 h-5" />
            Հատուկ հաշվետվություն
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 md:py-12">
            <FileText className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg md:text-xl font-semibold font-armenian mb-2">Հատուկ հաշվետվության գործիք</h3>
            <p className="text-sm md:text-base text-muted-foreground font-armenian mb-6 max-w-md mx-auto">
              Ստեղծեք կարգավորվող հաշվետվություններ ձեր կարիքներին համապատասխան
            </p>
            <Button className="font-armenian btn-modern">
              <FileText className="w-4 h-4 mr-2" />
              Մշակման փուլում
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReportsTab;