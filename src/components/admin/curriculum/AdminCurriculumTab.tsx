
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Plus, Search, Users, Clock, Award, Edit, Eye, GitBranch } from 'lucide-react';

const AdminCurriculumTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock curriculum data
  const curriculums = [
    {
      id: '1',
      name: 'Ծրագրավորման հիմունքներ',
      code: 'PRG-FUND',
      duration: '16 շաբաթ',
      credits: 6,
      modules: 8,
      prerequisites: [],
      students: 45,
      completion: 78,
      status: 'active',
      instructor: 'Արամ Ավետիսյան',
      description: 'Ծրագրավորման հիմնական սկզբունքների ուսուցում',
      level: 'Սկսնակ'
    },
    {
      id: '2',
      name: 'Առաջադեմ React',
      code: 'REACT-ADV',
      duration: '12 շաբաթ',
      credits: 4,
      modules: 6,
      prerequisites: ['PRG-FUND', 'JS-BASIC'],
      students: 28,
      completion: 65,
      status: 'active',
      instructor: 'Մարիամ Գրիգորյան',
      description: 'React-ի առաջադեմ հնարավորությունների ուսուցում',
      level: 'Առաջադեմ'
    },
    {
      id: '3',
      name: 'UI/UX Դիզայն',
      code: 'UIUX-DES',
      duration: '10 շաբաթ',
      credits: 3,
      modules: 5,
      prerequisites: [],
      students: 32,
      completion: 84,
      status: 'draft',
      instructor: 'Լուսինե Մարտիրոսյան',
      description: 'Օգտատիրոջ մակերևույթի և փորձի դիզայն',
      level: 'Միջին'
    }
  ];

  const filteredCurriculums = curriculums.filter(curriculum =>
    curriculum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curriculum.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curriculum.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0';
      case 'draft':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0';
      case 'archived':
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Սկսնակ':
        return 'bg-green-100 text-green-800';
      case 'Միջին':
        return 'bg-yellow-100 text-yellow-800';
      case 'Առաջադեմ':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold font-armenian">Ուսումնական ծրագրեր</h3>
          <p className="text-muted-foreground font-armenian">Կառավարեք ուսումնական ծրագրերը և մոդուլները</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Որոնել ծրագիր..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="font-armenian btn-modern">
                <Plus className="w-4 h-4 mr-2" />
                Նոր ծրագիր
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-armenian">Նոր ուսումնական ծրագիր</DialogTitle>
              </DialogHeader>
              <div className="text-center py-8">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="font-armenian text-muted-foreground">Ծրագրի ստեղծման ձևաթուղթ</p>
                <p className="text-sm text-muted-foreground">Մշակման փուլում</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Curriculum Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCurriculums.map((curriculum, index) => (
          <Card key={curriculum.id} className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-edu-blue to-edu-orange flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="font-armenian text-xl">{curriculum.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {curriculum.code}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{curriculum.description}</p>
                    <div className="flex gap-2">
                      <Badge className={getStatusBadge(curriculum.status)}>
                        {curriculum.status === 'active' ? 'Ակտիվ' : curriculum.status === 'draft' ? 'Նախագիծ' : 'Արխիվացված'}
                      </Badge>
                      <Badge className={getLevelColor(curriculum.level)}>
                        {curriculum.level}
                      </Badge>
                    </div>
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
                  <span className="text-sm font-armenian text-muted-foreground">Տևողություն</span>
                  <p className="font-semibold flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {curriculum.duration}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-armenian text-muted-foreground">Կրեդիտներ</span>
                  <p className="font-semibold flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {curriculum.credits}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-armenian text-muted-foreground">Մոդուլներ</span>
                  <p className="font-semibold flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {curriculum.modules}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-armenian text-muted-foreground">Ուսանողներ</span>
                  <p className="font-semibold flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {curriculum.students}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-sm font-armenian text-muted-foreground">Դասախոս</span>
                <p className="font-semibold">{curriculum.instructor}</p>
              </div>

              {curriculum.prerequisites.length > 0 && (
                <div>
                  <span className="text-sm font-armenian text-muted-foreground flex items-center gap-1 mb-2">
                    <GitBranch className="w-4 h-4" />
                    Նախապայմաններ
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {curriculum.prerequisites.map((prereq, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-armenian text-muted-foreground">Ավարտման տոկոս</span>
                  <span className="text-sm font-semibold">{curriculum.completion}%</span>
                </div>
                <Progress value={curriculum.completion} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCurriculums.length === 0 && (
        <Card className="modern-card">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold font-armenian mb-2">Ծրագրեր չեն գտնվել</h3>
            <p className="text-muted-foreground font-armenian">Փորձեք փոխել որոնման չափանիշները</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminCurriculumTab;
