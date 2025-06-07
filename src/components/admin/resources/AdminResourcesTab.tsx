
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Plus, Search, Clock, Users, Monitor, Edit, Eye } from 'lucide-react';

const AdminResourcesTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for rooms
  const rooms = [
    {
      id: '1',
      name: 'Դասասենյակ A-101',
      type: 'classroom',
      capacity: 30,
      equipment: ['Պրոյեկտոր', 'Բարձրախոս', 'Գրատախտակ'],
      status: 'available',
      location: '1-ին հարկ, A բլոկ',
      bookings: 8
    },
    {
      id: '2',
      name: 'Համակարգչային լաբորատորիա',
      type: 'lab',
      capacity: 20,
      equipment: ['20 համակարգիչ', 'Պրոյեկտոր', 'Ցանցային սարքավորումներ'],
      status: 'occupied',
      location: '2-րդ հարկ, B բլոկ',
      bookings: 12
    },
    {
      id: '3',
      name: 'Վեբինարային սենյակ',
      type: 'webinar',
      capacity: 50,
      equipment: ['4K խցիկ', 'Ձայնագրման սարքավորումներ', 'Լուսավորություն'],
      status: 'maintenance',
      location: '3-րդ հարկ, A բլոկ',
      bookings: 15
    }
  ];

  // Mock data for equipment
  const equipment = [
    {
      id: '1',
      name: 'MacBook Pro 16"',
      type: 'laptop',
      model: 'M1 Pro 2021',
      serialNumber: 'MBP-001',
      status: 'available',
      assignedTo: null,
      lastMaintenance: '2024-01-10'
    },
    {
      id: '2',
      name: 'Epson պրոյեկտոր',
      type: 'projector',
      model: 'EB-2250U',
      serialNumber: 'PROJ-005',
      status: 'in_use',
      assignedTo: 'Դասասենյակ A-101',
      lastMaintenance: '2023-12-15'
    },
    {
      id: '3',
      name: 'iPad Pro',
      type: 'tablet',
      model: '12.9" 2022',
      serialNumber: 'IPAD-003',
      status: 'maintenance',
      assignedTo: null,
      lastMaintenance: '2024-01-12'
    }
  ];

  // Mock data for bookings
  const bookings = [
    {
      id: '1',
      room: 'Դասասենյակ A-101',
      instructor: 'Արամ Ավետիսյան',
      course: 'React հիմունքներ',
      date: '2024-01-17',
      startTime: '10:00',
      endTime: '12:00',
      status: 'confirmed',
      students: 25
    },
    {
      id: '2',
      room: 'Համակարգչային լաբորատորիա',
      instructor: 'Մարիամ Գրիգորյան',
      course: 'JavaScript Առաջադեմ',
      date: '2024-01-17',
      startTime: '14:00',
      endTime: '16:00',
      status: 'pending',
      students: 18
    },
    {
      id: '3',
      room: 'Վեբինարային սենյակ',
      instructor: 'Լուսինե Մարտիրոսյան',
      course: 'UI/UX Դիզայն',
      date: '2024-01-18',
      startTime: '09:00',
      endTime: '11:00',
      status: 'confirmed',
      students: 30
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0';
      case 'occupied':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0';
      case 'maintenance':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0';
      case 'in_use':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0';
      case 'confirmed':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0';
      case 'pending':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'classroom':
        return <Users className="w-6 h-6" />;
      case 'lab':
        return <Monitor className="w-6 h-6" />;
      case 'webinar':
        return <Calendar className="w-6 h-6" />;
      default:
        return <MapPin className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-armenian text-gradient">Ռեսուրսների կառավարում</h2>
            <p className="text-muted-foreground font-armenian">Կառավարեք դասասենյակները և տեխնիկական սարքավորումները</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="rooms" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
              <MapPin className="w-4 h-4 mr-2" />
              Սենյակներ
            </TabsTrigger>
            <TabsTrigger value="equipment" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
              <Monitor className="w-4 h-4 mr-2" />
              Սարքավորումներ
            </TabsTrigger>
            <TabsTrigger value="calendar" className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
              <Calendar className="w-4 h-4 mr-2" />
              Ամրագրումներ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Որոնել սենյակ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="font-armenian btn-modern">
                      <Plus className="w-4 h-4 mr-2" />
                      Ավելացնել սենյակ
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-armenian">Նոր սենյակ ավելացնել</DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-8">
                      <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="font-armenian text-muted-foreground">Սենյակի ավելացման ձևաթուղթ</p>
                      <p className="text-sm text-muted-foreground">Մշակման փուլում</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {rooms.map((room, index) => (
                  <Card key={room.id} className="modern-card course-card-hover animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-edu-blue to-edu-orange flex items-center justify-center text-white">
                            {getTypeIcon(room.type)}
                          </div>
                          <div>
                            <CardTitle className="font-armenian text-lg mb-1">{room.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mb-2">{room.location}</p>
                            <Badge className={getStatusBadge(room.status)}>
                              {room.status === 'available' ? 'Հասանելի' : 
                               room.status === 'occupied' ? 'Զբաղված' : 'Նորոգման մեջ'}
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
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-sm font-armenian text-muted-foreground">Տիպ</span>
                          <p className="font-semibold">
                            {room.type === 'classroom' ? 'Դասասենյակ' :
                             room.type === 'lab' ? 'Լաբորատորիա' : 'Վեբինարային'}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-armenian text-muted-foreground">Տարողություն</span>
                          <p className="font-semibold flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {room.capacity}
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-armenian text-muted-foreground">Սարքավորումներ</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {room.equipment.map((eq, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {eq}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                        <span className="text-sm font-armenian text-muted-foreground">Ամրագրումներ</span>
                        <span className="font-bold">{room.bookings}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-armenian">Տեխնիկական սարքավորումներ</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="font-armenian btn-modern">
                      <Plus className="w-4 h-4 mr-2" />
                      Ավելացնել սարքավորում
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-armenian">Նոր սարքավորում ավելացնել</DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-8">
                      <Monitor className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="font-armenian text-muted-foreground">Սարքավորման ավելացման ձևաթուղթ</p>
                      <p className="text-sm text-muted-foreground">Մշակման փուլում</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {equipment.map((item, index) => (
                  <Card key={item.id} className="modern-card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-edu-blue to-edu-orange flex items-center justify-center text-white">
                            <Monitor className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold font-armenian text-lg">{item.name}</h4>
                              <Badge className={getStatusBadge(item.status)}>
                                {item.status === 'available' ? 'Հասանելի' :
                                 item.status === 'in_use' ? 'Օգտագործման մեջ' : 'Նորոգման մեջ'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <span className="text-sm font-armenian text-muted-foreground">Մոդել</span>
                                <p className="font-semibold">{item.model}</p>
                              </div>
                              <div>
                                <span className="text-sm font-armenian text-muted-foreground">Սերիական համար</span>
                                <p className="font-semibold">{item.serialNumber}</p>
                              </div>
                              <div>
                                <span className="text-sm font-armenian text-muted-foreground">Նշանակված</span>
                                <p className="font-semibold">{item.assignedTo || 'Ոչ մի'}</p>
                              </div>
                              <div>
                                <span className="text-sm font-armenian text-muted-foreground">Վերջին նորոգում</span>
                                <p className="font-semibold">{new Date(item.lastMaintenance).toLocaleDateString('hy-AM')}</p>
                              </div>
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-armenian">Ամրագրումների օրացույց</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="font-armenian btn-modern">
                      <Plus className="w-4 h-4 mr-2" />
                      Նոր ամրագրում
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-armenian">Նոր ամրագրում ստեղծել</DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-8">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="font-armenian text-muted-foreground">Ամրագրման ձևաթուղթ</p>
                      <p className="text-sm text-muted-foreground">Մշակման փուլում</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <Card key={booking.id} className="modern-card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-edu-blue to-edu-orange flex items-center justify-center text-white">
                            <Calendar className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold font-armenian text-lg">{booking.course}</h4>
                              <Badge className={getStatusBadge(booking.status)}>
                                {booking.status === 'confirmed' ? 'Հաստատված' : 'Սպասման մեջ'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                              <div>
                                <span className="text-sm font-armenian text-muted-foreground">Սենյակ</span>
                                <p className="font-semibold">{booking.room}</p>
                              </div>
                              <div>
                                <span className="text-sm font-armenian text-muted-foreground">Դասախոս</span>
                                <p className="font-semibold">{booking.instructor}</p>
                              </div>
                              <div>
                                <span className="text-sm font-armenian text-muted-foreground">Ամսաթիվ</span>
                                <p className="font-semibold">{new Date(booking.date).toLocaleDateString('hy-AM')}</p>
                              </div>
                              <div>
                                <span className="text-sm font-armenian text-muted-foreground">Ժամ</span>
                                <p className="font-semibold flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {booking.startTime} - {booking.endTime}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm font-armenian text-muted-foreground">Ուսանողներ</span>
                                <p className="font-semibold flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {booking.students}
                                </p>
                              </div>
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

export default AdminResourcesTab;
