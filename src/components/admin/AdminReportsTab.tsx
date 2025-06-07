
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, Filter, Users, BookOpen, BarChart3 } from 'lucide-react';

const AdminReportsTab = () => {
  const reports = [
    {
      id: 1,
      name: 'Օգտատերերի հաշվետվություն',
      description: 'Բոլոր օգտատերերի մանրամասն ցանկ',
      type: 'users',
      icon: Users,
      lastGenerated: '2024-01-15',
      size: '2.3 MB'
    },
    {
      id: 2,
      name: 'Դասընթացների վիճակագրություն',
      description: 'Դասընթացների ռեգիստրացիա և ավարտ',
      type: 'courses',
      icon: BookOpen,
      lastGenerated: '2024-01-14',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Ակտիվության հաշվետվություն',
      description: 'Օգտատերերի ակտիվության վերլուծություն',
      type: 'activity',
      icon: BarChart3,
      lastGenerated: '2024-01-13',
      size: '3.1 MB'
    }
  ];

  const handleGenerateReport = (reportId: number) => {
    console.log(`Generating report ${reportId}`);
  };

  const handleDownloadReport = (reportId: number) => {
    console.log(`Downloading report ${reportId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-armenian text-gradient">Հաշվետվություններ</h2>
              <p className="text-muted-foreground font-armenian">Ստեղծեք և ներբեռնեք համակարգի հաշվետվությունները</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="font-armenian">
              <Filter className="w-4 h-4 mr-2" />
              Զտել
            </Button>
            <Button variant="outline" className="font-armenian">
              <Calendar className="w-4 h-4 mr-2" />
              Ժամանակահատված
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm font-armenian text-muted-foreground">Ընդամենը հաշվետվություններ</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm font-armenian text-muted-foreground">Ընդամենը ներբեռնումներ</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm font-armenian text-muted-foreground">Այս ամիս</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report, index) => (
          <Card key={report.id} className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: `${0.1 * (index + 4)}s` }}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl">
                    <report.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold font-armenian mb-2">{report.name}</h3>
                    <p className="text-muted-foreground mb-4">{report.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium font-armenian text-muted-foreground">Վերջին գեներացիա:</span>
                        <p className="font-semibold">{report.lastGenerated}</p>
                      </div>
                      <div>
                        <span className="font-medium font-armenian text-muted-foreground">Ֆայլի չափ:</span>
                        <p className="font-semibold">{report.size}</p>
                      </div>
                      <div>
                        <span className="font-medium font-armenian text-muted-foreground">Տիպ:</span>
                        <p className="font-semibold capitalize">{report.type}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateReport(report.id)}
                    className="font-armenian"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Գեներացնել
                  </Button>
                  <Button
                    onClick={() => handleDownloadReport(report.id)}
                    className="font-armenian btn-modern"
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
      <Card className="modern-card animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Հատուկ հաշվետվություն
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold font-armenian mb-2">Հատուկ հաշվետվության գործիք</h3>
            <p className="text-muted-foreground font-armenian mb-6">
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
