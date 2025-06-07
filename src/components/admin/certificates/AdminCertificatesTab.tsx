
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, 
  Download, 
  QrCode, 
  FileText, 
  Search, 
  Plus,
  Settings,
  Eye,
  Edit
} from 'lucide-react';

const AdminCertificatesTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for certificates
  const certificates = [
    {
      id: '1',
      studentName: 'Արմեն Ավագյան',
      courseName: 'JavaScript Հիմունքներ',
      issuedDate: '2024-01-15',
      certificateType: 'completion',
      qrCode: 'QR123456',
      downloadUrl: '#'
    },
    {
      id: '2',
      studentName: 'Նարե Պողոսյան',
      courseName: 'React Development',
      issuedDate: '2024-01-10',
      certificateType: 'diploma',
      qrCode: 'QR789012',
      downloadUrl: '#'
    },
    {
      id: '3',
      studentName: 'Դավիթ Մարտիրոսյան',
      courseName: 'Full Stack Development',
      issuedDate: '2024-01-08',
      certificateType: 'completion',
      qrCode: 'QR345678',
      downloadUrl: '#'
    }
  ];

  const templates = [
    {
      id: '1',
      name: 'Ստանդարտ ավարտական վկայական',
      type: 'completion',
      isActive: true,
      lastModified: '2024-01-01'
    },
    {
      id: '2',
      name: 'Դիպլոմի ստանդարտ',
      type: 'diploma',
      isActive: true,
      lastModified: '2023-12-15'
    },
    {
      id: '3',
      name: 'Մասնակցության վկայական',
      type: 'participation',
      isActive: false,
      lastModified: '2023-11-20'
    }
  ];

  const stats = {
    totalIssued: 1285,
    thisMonth: 67,
    pendingApproval: 23,
    templates: 5
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold font-armenian">Վկայականների կառավարում</h3>
          <p className="text-muted-foreground font-armenian">Կառավարեք և ստեղծեք վկայականներ</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="font-armenian">
            <Settings className="w-4 h-4 mr-2" />
            Կարգավորումներ
          </Button>
          <Button className="font-armenian btn-modern">
            <Plus className="w-4 h-4 mr-2" />
            Նոր վկայական
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ընդամենը տրված</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIssued}</div>
            <p className="text-xs text-muted-foreground font-armenian">Վկայականներ</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Այս ամիս</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-edu-blue">{stats.thisMonth}</div>
            <p className="text-xs text-muted-foreground font-armenian">Նոր վկայականներ</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Սպասում է հաստատման</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-yellow">{stats.pendingApproval}</div>
            <p className="text-xs text-muted-foreground font-armenian">Վկայականներ</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Շաբլոնները</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-green">{stats.templates}</div>
            <p className="text-xs text-muted-foreground font-armenian">Ակտիվ շաբլոններ</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="certificates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="certificates" className="font-armenian">Վկայականներ</TabsTrigger>
          <TabsTrigger value="templates" className="font-armenian">Շաբլոններ</TabsTrigger>
          <TabsTrigger value="settings" className="font-armenian">Կարգավորումներ</TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Որոնել վկայական..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Certificates List */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian">Տրված վկայականներ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-edu-blue to-edu-orange flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{cert.studentName}</p>
                        <p className="text-sm text-muted-foreground">{cert.courseName}</p>
                        <p className="text-xs text-muted-foreground">Տրված՝ {cert.issuedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cert.certificateType === 'diploma' ? 'bg-edu-orange' : 'bg-edu-blue'}>
                        {cert.certificateType === 'diploma' ? 'Դիպլոմ' : 'Ավարտական'}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <QrCode className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian">Վկայականների շաբլոններ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">Վերջին փոփոխություն՝ {template.lastModified}</p>
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
                    <div className="flex items-center justify-between">
                      <Badge className={template.isActive ? 'bg-success-green' : 'bg-muted'}>
                        {template.isActive ? 'Ակտիվ' : 'Ապաակտիվ'}
                      </Badge>
                      <Badge variant="outline">
                        {template.type === 'diploma' ? 'Դիպլոմ' : 
                         template.type === 'completion' ? 'Ավարտական' : 'Մասնակցություն'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian">Վկայականների կարգավորումներ</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Settings className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold font-armenian mb-2">Համակարգային կարգավորումներ</h3>
              <p className="text-muted-foreground font-armenian mb-4">
                Կարգավորեք վկայականների գեներացման պարամետրները
              </p>
              <Button className="font-armenian btn-modern">
                <Settings className="w-4 h-4 mr-2" />
                Կարգավորել
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCertificatesTab;
