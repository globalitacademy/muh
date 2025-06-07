
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Search, User, BookOpen, Award, TrendingUp, Edit, Eye } from 'lucide-react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { Loader2 } from 'lucide-react';

const AdminStudentsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const { data: users, isLoading, error } = useAdminUsers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    console.error('Error loading students:', error);
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold font-armenian mb-2">Տվյալների բեռնման սխալ</h3>
        <p className="text-muted-foreground font-armenian">Խնդրում ենք փորձել նորից</p>
      </div>
    );
  }

  // Filter only students
  const students = users?.filter(user => user.role === 'student') || [];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.group_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesGroup = groupFilter === 'all' || student.group_number === groupFilter;
    
    return matchesSearch && matchesStatus && matchesGroup;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0';
      case 'inactive':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
    }
  };

  const uniqueGroups = [...new Set(students.map(s => s.group_number).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold font-armenian">Ուսանողներ</h3>
          <p className="text-muted-foreground font-armenian">Կառավարեք ուսանողական կազմը</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Որոնել ուսանող..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Կարգավիճակ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Բոլոր կարգավիճակները</SelectItem>
            <SelectItem value="active">Ակտիվ</SelectItem>
            <SelectItem value="inactive">Ապաակտիվ</SelectItem>
          </SelectContent>
        </Select>
        <Select value={groupFilter} onValueChange={setGroupFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Խումբ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Բոլոր խմբերը</SelectItem>
            {uniqueGroups.map(group => (
              <SelectItem key={group} value={group || ''}>{group}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student, index) => (
          <Card key={student.id} className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-edu-blue to-edu-orange flex items-center justify-center">
                    {student.avatar_url ? (
                      <img 
                        src={student.avatar_url} 
                        alt={student.name || 'Student'} 
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="font-armenian text-lg mb-1">{student.name || 'Անանուն'}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-2">{student.id.slice(0, 8)}...</p>
                    <Badge className={getStatusBadge(student.status)}>
                      {student.status === 'active' ? 'Ակտիվ' : 'Ապաակտիվ'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
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
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-armenian text-muted-foreground">Խումբ</span>
                  <p className="font-semibold">{student.group_number || 'Չի նշված'}</p>
                </div>
                <div>
                  <span className="font-armenian text-muted-foreground">Կազմակերպություն</span>
                  <p className="font-semibold">{student.organization || 'Չի նշված'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-armenian text-muted-foreground">Բաժին</span>
                  <p className="font-semibold">{student.department || 'Չի նշված'}</p>
                </div>
                <div>
                  <span className="font-armenian text-muted-foreground">Հեռախոս</span>
                  <p className="font-semibold">{student.phone || 'Չի նշված'}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-lg font-bold">0</div>
                  <div className="text-xs font-armenian text-muted-foreground">Դասընթաց</div>
                </div>
                <div className="p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-lg font-bold">0</div>
                  <div className="text-xs font-armenian text-muted-foreground">Ավարտած</div>
                </div>
                <div className="p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-lg font-bold">0</div>
                  <div className="text-xs font-armenian text-muted-foreground">Վկայական</div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground pt-2 border-t">
                <span className="font-armenian">Գրանցման ամսաթիվ:</span> {new Date(student.created_at).toLocaleDateString('hy-AM')}
              </div>

              {student.bio && (
                <div className="text-xs pt-2">
                  <span className="font-armenian text-muted-foreground">Մասին:</span>
                  <p className="text-muted-foreground mt-1 line-clamp-2">{student.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card className="modern-card">
          <CardContent className="p-12 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold font-armenian mb-2">Ուսանողներ չեն գտնվել</h3>
            <p className="text-muted-foreground font-armenian">
              {students.length === 0 
                ? 'Բազայում դեռ չկան գրանցված ուսանողներ' 
                : 'Փորձեք փոխել որոնման կամ զտման չափանիշները'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminStudentsTab;
