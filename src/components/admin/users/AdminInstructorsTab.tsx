
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Search, Plus, User, Award, BookOpen, Star, Edit, Eye } from 'lucide-react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { Loader2 } from 'lucide-react';

const AdminInstructorsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: users, isLoading, error } = useAdminUsers();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    console.error('Error loading instructors:', error);
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold font-armenian mb-2">Տվյալների բեռնման սխալ</h3>
        <p className="text-muted-foreground font-armenian">Խնդրում ենք փորձել նորից</p>
      </div>
    );
  }

  // Filter only instructors
  const instructors = users?.filter(user => user.role === 'instructor') || [];
  
  const filteredInstructors = instructors.filter(instructor =>
    instructor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.department?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    {instructor.avatar_url ? (
                      <img 
                        src={instructor.avatar_url} 
                        alt={instructor.name || 'Instructor'} 
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="font-armenian text-xl mb-1">{instructor.name || 'Անանուն'}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-2">{instructor.id}</p>
                    <Badge className={instructor.status === 'active' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0' : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0'}>
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
                  <span className="text-sm font-armenian text-muted-foreground">Կազմակերպություն</span>
                  <p className="font-semibold">{instructor.organization || 'Չի նշված'}</p>
                </div>
                <div>
                  <span className="text-sm font-armenian text-muted-foreground">Բաժին</span>
                  <p className="font-semibold">{instructor.department || 'Չի նշված'}</p>
                </div>
                <div>
                  <span className="text-sm font-armenian text-muted-foreground">Խումբ</span>
                  <p className="font-semibold">{instructor.group_number || 'Չի նշված'}</p>
                </div>
                <div>
                  <span className="text-sm font-armenian text-muted-foreground">Հեռախոս</span>
                  <p className="font-semibold">{instructor.phone || 'Չի նշված'}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-sm font-armenian text-muted-foreground">Գրանցման ամսաթիվ</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {new Date(instructor.created_at).toLocaleDateString('hy-AM')}
                  </span>
                </div>
              </div>

              {instructor.bio && (
                <div>
                  <span className="text-sm font-armenian text-muted-foreground">Կենսագրություն</span>
                  <p className="text-sm mt-1 text-muted-foreground line-clamp-2">{instructor.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInstructors.length === 0 && (
        <Card className="modern-card">
          <CardContent className="p-12 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold font-armenian mb-2">Դասախոսներ չեն գտնվել</h3>
            <p className="text-muted-foreground font-armenian">
              {instructors.length === 0 
                ? 'Բազայում դեռ չկան գրանցված դասախոսներ' 
                : 'Փորձեք փոխել որոնման չափանիշները'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminInstructorsTab;
