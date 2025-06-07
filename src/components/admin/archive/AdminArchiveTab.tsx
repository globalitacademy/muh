
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Archive, 
  Download, 
  Search, 
  Filter, 
  FileText, 
  Users, 
  BookOpen,
  Calendar,
  RotateCcw,
  Trash2,
  Eye
} from 'lucide-react';

const AdminArchiveTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for archived items
  const archivedCourses = [
    {
      id: '1',
      title: 'HTML/CSS Հիմունքներ',
      type: 'course',
      archivedDate: '2023-12-15',
      students: 145,
      instructor: 'Արա Նազարյան',
      reason: 'outdated'
    },
    {
      id: '2',
      title: 'jQuery Ծրագրավորում',
      type: 'course',
      archivedDate: '2023-11-20',
      students: 89,
      instructor: 'Մարիա Հակոբյան',
      reason: 'replaced'
    }
  ];

  const archivedUsers = [
    {
      id: '1',
      name: 'Գագիկ Պետրոսյան',
      role: 'instructor',
      archivedDate: '2023-10-30',
      reason: 'inactive',
      lastActivity: '2023-09-15'
    },
    {
      id: '2',
      name: 'Շուշան Կարապետյան',
      role: 'student',
      archivedDate: '2023-09-25',
      reason: 'graduated',
      lastActivity: '2023-09-20'
    }
  ];

  const archivedDocuments = [
    {
      id: '1',
      title: '2023 Ակադեմիական Տարվա Հաշվետվություն',
      type: 'report',
      archivedDate: '2024-01-01',
      size: '2.4 MB',
      category: 'academic'
    },
    {
      id: '2',
      title: 'Հին Ուսումնական Ծրագիր',
      type: 'curriculum',
      archivedDate: '2023-12-01',
      size: '1.8 MB',
      category: 'educational'
    }
  ];

  const stats = {
    archivedCourses: 23,
    archivedUsers: 156,
    archivedDocuments: 89,
    totalStorage: '245 MB'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold font-armenian">Արխիվ</h3>
          <p className="text-muted-foreground font-armenian">Կառավարեք արխիվացված տվյալները</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="font-armenian">
            <Download className="w-4 h-4 mr-2" />
            Էքսպորտ
          </Button>
          <Button variant="outline" className="font-armenian">
            <Filter className="w-4 h-4 mr-2" />
            Մաքրել արխիվը
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Արխիվացված դասընթացներ</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.archivedCourses}</div>
            <p className="text-xs text-muted-foreground font-armenian">Անակտիվ դասընթացներ</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Արխիվացված օգտատերեր</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.archivedUsers}</div>
            <p className="text-xs text-muted-foreground font-armenian">Ապաակտիվ օգտատերեր</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Արխիվացված փաստաթղթեր</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.archivedDocuments}</div>
            <p className="text-xs text-muted-foreground font-armenian">Հին փաստաթղթեր</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Պահպանված ծավալ</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStorage}</div>
            <p className="text-xs text-muted-foreground font-armenian">Արխիվի չափ</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses" className="font-armenian">Դասընթացներ</TabsTrigger>
          <TabsTrigger value="users" className="font-armenian">Օգտատերեր</TabsTrigger>
          <TabsTrigger value="documents" className="font-armenian">Փաստաթղթեր</TabsTrigger>
          <TabsTrigger value="settings" className="font-armenian">Կարգավորումներ</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Որոնել արխիվացված դասընթացներում..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Archived Courses */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian">Արխիվացված դասընթացներ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {archivedCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{course.title}</p>
                        <p className="text-sm text-muted-foreground">Դասախոս՝ {course.instructor}</p>
                        <p className="text-xs text-muted-foreground">
                          Արխիվացված՝ {course.archivedDate} • {course.students} ուսանող
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {course.reason === 'outdated' ? 'Հնացած' : 
                         course.reason === 'replaced' ? 'Փոխարինված' : 'Այլ'}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" title="Դիտել">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="Վերականգնել">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="Ջնջել">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian">Արխիվացված օգտատերեր</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {archivedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.role === 'instructor' ? 'Դասախոս' : 'Ուսանող'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Արխիվացված՝ {user.archivedDate} • Վերջին գործունեություն՝ {user.lastActivity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {user.reason === 'inactive' ? 'Ապաակտիվ' : 
                         user.reason === 'graduated' ? 'Ավարտական' : 'Այլ'}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" title="Դիտել">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="Վերականգնել">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="Ջնջել">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian">Արխիվացված փաստաթղթեր</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {archivedDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{doc.title}</p>
                        <p className="text-sm text-muted-foreground">{doc.category}</p>
                        <p className="text-xs text-muted-foreground">
                          Արխիվացված՝ {doc.archivedDate} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {doc.type === 'report' ? 'Հաշվետվություն' : 
                         doc.type === 'curriculum' ? 'Ծրագիր' : 'Փաստաթուղթ'}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" title="Ներբեռնել">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="Վերականգնել">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="Ջնջել">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
              <CardTitle className="font-armenian">Արխիվի կարգավորումներ</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Archive className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold font-armenian mb-2">Արխիվի կառավարման կարգավորումներ</h3>
              <p className="text-muted-foreground font-armenian mb-4">
                Կարգավորեք ավտոմատ արխիվացման կանոնները և պահպանման ժամկետները
              </p>
              <Button className="font-armenian btn-modern">
                Կարգավորել արխիվը
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminArchiveTab;
