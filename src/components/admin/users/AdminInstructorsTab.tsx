
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Search, Plus, User, Award, BookOpen, Star, Edit, Eye } from 'lucide-react';

const AdminInstructorsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for instructors
  const instructors = [
    {
      id: '1',
      name: 'Արամ Ավետիսյան',
      email: 'aram.avetisyan@example.com',
      specialization: 'Ծրագրավորում',
      experience: '8 տարի',
      courses: 5,
      students: 127,
      rating: 4.8,
      certificates: ['React', 'Node.js', 'MongoDB'],
      status: 'active'
    },
    {
      id: '2',
      name: 'Մարիամ Գրիգորյան',
      email: 'mariam.grigoryan@example.com',
      specialization: 'Դիզայն',
      experience: '6 տարի',
      courses: 3,
      students: 89,
      rating: 4.9,
      certificates: ['UI/UX', 'Figma', 'Adobe Creative'],
      status: 'active'
    }
  ];

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold font-armenian">Դասախոսներ</h3>
          <p className="text-muted-foreground font-armenian">Կառավարեք դասախոսական կազմը</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Որոնել դասախոս..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="font-armenian btn-modern">
                <Plus className="w-4 h-4 mr-2" />
                Ավելացնել դասախոս
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-armenian">Նոր դասախոս</DialogTitle>
              </DialogHeader>
              <div className="text-center py-8">
                <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="font-armenian text-muted-foreground">Դասախոս ավելացման ձևաթուղթ</p>
                <p className="text-sm text-muted-foreground">Մշակման փուլում</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInstructors.map((instructor, index) => (
          <Card key={instructor.id} className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-edu-blue to-edu-orange flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="font-armenian text-xl mb-1">{instructor.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-2">{instructor.email}</p>
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                      {instructor.status === 'active' ? 'Ակտիվ' : 'Ապաակտիվ'}
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
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm font-armenian text-muted-foreground">Մասնագիտություն</span>
                  <p className="font-semibold">{instructor.specialization}</p>
                </div>
                <div>
                  <span className="text-sm font-armenian text-muted-foreground">Փորձ</span>
                  <p className="font-semibold">{instructor.experience}</p>
                </div>
                <div>
                  <span className="text-sm font-armenian text-muted-foreground">Դասընթացներ</span>
                  <p className="font-semibold flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {instructor.courses}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-armenian text-muted-foreground">Ուսանողներ</span>
                  <p className="font-semibold flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {instructor.students}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-sm font-armenian text-muted-foreground">Գնահատական</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold ml-1">{instructor.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">/ 5.0</span>
                </div>
              </div>

              <div>
                <span className="text-sm font-armenian text-muted-foreground">Վկայականներ</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {instructor.certificates.map((cert, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInstructors.length === 0 && (
        <Card className="modern-card">
          <CardContent className="p-12 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold font-armenian mb-2">Դասախոսներ չեն գտնվել</h3>
            <p className="text-muted-foreground font-armenian">Փորձեք փոխել որոնման չափանիշները</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminInstructorsTab;
