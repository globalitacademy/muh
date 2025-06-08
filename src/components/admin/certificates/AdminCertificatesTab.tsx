
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
  Edit,
  GraduationCap
} from 'lucide-react';
import { useCertificates } from '@/hooks/useCertificates';
import NewCertificateDialog from './NewCertificateDialog';
import CertificateTemplateDialog from './CertificateTemplateDialog';
import CertificateSettingsDialog from './CertificateSettingsDialog';

const AdminCertificatesTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: certificates, isLoading } = useCertificates();

  // Filter certificates based on search
  const filteredCertificates = certificates?.filter(cert => 
    cert.modules?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Calculate stats from real data
  const stats = {
    totalIssued: certificates?.length || 0,
    thisMonth: certificates?.filter(cert => {
      const issuedDate = new Date(cert.issued_at);
      const currentDate = new Date();
      return issuedDate.getMonth() === currentDate.getMonth() && 
             issuedDate.getFullYear() === currentDate.getFullYear();
    }).length || 0,
    pendingApproval: 0, // This would need a status field in the certificates table
    diplomas: certificates?.filter(cert => cert.is_diploma).length || 0
  };

  if (isLoading) {
    return <div className="animate-pulse">Բեռնվում է...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold font-armenian">Վկայականների կառավարում</h3>
          <p className="text-muted-foreground font-armenian">Կառավարեք և ստեղծեք վկայականներ</p>
        </div>
        <div className="flex gap-3">
          <CertificateSettingsDialog>
            <Button variant="outline" className="font-armenian">
              <Settings className="w-4 h-4 mr-2" />
              Կարգավորումներ
            </Button>
          </CertificateSettingsDialog>
          <NewCertificateDialog>
            <Button className="font-armenian btn-modern">
              <Plus className="w-4 h-4 mr-2" />
              Նոր վկայական
            </Button>
          </NewCertificateDialog>
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
            <CardTitle className="text-sm font-medium font-armenian">Դիպլոմներ</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-yellow">{stats.diplomas}</div>
            <p className="text-xs text-muted-foreground font-armenian">Տրված դիպլոմներ</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ակտիվություն</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-green">
              {stats.totalIssued > 0 ? Math.round((stats.thisMonth / stats.totalIssued) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground font-armenian">Ամսական աճ</p>
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
                {filteredCertificates.length > 0 ? (
                  filteredCertificates.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-edu-blue to-edu-orange flex items-center justify-center">
                          {cert.is_diploma ? (
                            <GraduationCap className="w-6 h-6 text-white" />
                          ) : (
                            <Award className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{cert.user_id}</p>
                          <p className="text-sm text-muted-foreground">
                            {cert.modules?.title || 'Ընդհանուր վկայական'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Տրված՝ {new Date(cert.issued_at).toLocaleDateString('hy-AM')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cert.is_diploma ? 'bg-edu-orange' : 'bg-edu-blue'}>
                          {cert.is_diploma ? 'Դիպլոմ' : 'Ավարտական'}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {cert.certificate_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          {cert.qr_code && (
                            <Button variant="outline" size="sm">
                              <QrCode className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-armenian">
                      {searchTerm ? 'Որոնման արդյունքներ չկան' : 'Վկայականներ դեռ չկան'}
                    </p>
                    <p className="text-sm">
                      {searchTerm ? 'Փորձեք այլ որոնման բառ' : 'Վկայականները կհայտնվեն այստեղ'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian">Վկայականների շաբլոններ</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold font-armenian mb-2">Շաբլոնների կառավարում</h3>
              <p className="text-muted-foreground font-armenian mb-4">
                Ստեղծեք և կառավարեք վկայականների շաբլոնները
              </p>
              <CertificateTemplateDialog>
                <Button className="font-armenian btn-modern">
                  <Plus className="w-4 h-4 mr-2" />
                  Նոր շաբլոն
                </Button>
              </CertificateTemplateDialog>
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
              <CertificateSettingsDialog>
                <Button className="font-armenian btn-modern">
                  <Settings className="w-4 h-4 mr-2" />
                  Կարգավորել
                </Button>
              </CertificateSettingsDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCertificatesTab;
