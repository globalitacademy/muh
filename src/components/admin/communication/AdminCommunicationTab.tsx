
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Bell, 
  Send, 
  Mail, 
  Users, 
  Plus,
  Search,
  Filter,
  Eye,
  Archive
} from 'lucide-react';

const AdminCommunicationTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for communication
  const messages = [
    {
      id: '1',
      from: 'Արմեն Ավագյան',
      subject: 'Հարց JavaScript դասընթացի մասին',
      date: '2024-01-15 14:30',
      isRead: false,
      category: 'support'
    },
    {
      id: '2',
      from: 'Նարե Պողոսյան',
      subject: 'Տեխնիկական խնդիր',
      date: '2024-01-14 10:15',
      isRead: true,
      category: 'technical'
    },
    {
      id: '3',
      from: 'Դավիթ Մարտիրոսյան',
      subject: 'Գնահատական վերաբերյալ',
      date: '2024-01-13 16:45',
      isRead: true,
      category: 'academic'
    }
  ];

  const notifications = [
    {
      id: '1',
      title: 'Նոր դասընթացի մեկնարկ',
      content: 'React Advanced դասընթացը կմեկնարկի հունվարի 20-ին',
      type: 'announcement',
      audience: 'all',
      scheduled: '2024-01-20 09:00',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Համակարգային նորացում',
      content: 'Հարթակի նորացումը կիրականացվի կիրակի գիշերը',
      type: 'system',
      audience: 'all',
      scheduled: '2024-01-21 02:00',
      status: 'sent'
    }
  ];

  const stats = {
    totalMessages: 1247,
    unreadMessages: 23,
    sentNotifications: 156,
    activeAnnouncements: 8
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold font-armenian">Հաղորդակցության կառավարում</h3>
          <p className="text-muted-foreground font-armenian">Կառավարեք հաղորդագրությունները և ծանուցումները</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="font-armenian">
            <Archive className="w-4 h-4 mr-2" />
            Արխիվ
          </Button>
          <Button className="font-armenian btn-modern">
            <Plus className="w-4 h-4 mr-2" />
            Նոր հաղորդագրություն
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ընդամենը հաղորդագրություններ</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground font-armenian">Բոլոր հաղորդագրությունները</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Չկարդացած</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-yellow">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground font-armenian">Նոր հաղորդագրություններ</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ուղարկված ծանուցումներ</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-edu-blue">{stats.sentNotifications}</div>
            <p className="text-xs text-muted-foreground font-armenian">Այս ամիս</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ակտիվ հայտարարություններ</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-green">{stats.activeAnnouncements}</div>
            <p className="text-xs text-muted-foreground font-armenian">Ընթացիկ</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messages" className="font-armenian">Հաղորդագրություններ</TabsTrigger>
          <TabsTrigger value="notifications" className="font-armenian">Ծանուցումներ</TabsTrigger>
          <TabsTrigger value="compose" className="font-armenian">Նոր հաղորդագրություն</TabsTrigger>
          <TabsTrigger value="announcements" className="font-armenian">Հայտարարություններ</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Որոնել հաղորդագրություններում..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="font-armenian">
              <Filter className="w-4 h-4 mr-2" />
              Ֆիլտր
            </Button>
          </div>

          {/* Messages List */}
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian">Մուտքային հաղորդագրություններ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex items-center justify-between p-4 border rounded-lg ${!message.isRead ? 'bg-muted/30' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-edu-blue to-edu-orange flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className={`font-semibold ${!message.isRead ? 'font-bold' : ''}`}>{message.from}</p>
                        <p className="text-sm text-muted-foreground">{message.subject}</p>
                        <p className="text-xs text-muted-foreground">{message.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!message.isRead && <div className="w-2 h-2 bg-edu-blue rounded-full"></div>}
                      <Badge variant="outline">
                        {message.category === 'support' ? 'Աջակցություն' : 
                         message.category === 'technical' ? 'Տեխնիկական' : 'Ակադեմիական'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian">Համակարգային ծանուցումներ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{notification.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">Ժամանակացույց՝ {notification.scheduled}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={notification.status === 'sent' ? 'bg-success-green' : 'bg-warning-yellow'}>
                          {notification.status === 'sent' ? 'Ուղարկված' : 'Ծրագրված'}
                        </Badge>
                        <Badge variant="outline">
                          {notification.type === 'announcement' ? 'Հայտարարություն' : 'Համակարգային'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compose" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian">Նոր հաղորդագրություն</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium font-armenian">Ստացողներ</label>
                  <Input placeholder="Ընտրել ստացողներ..." />
                </div>
                <div>
                  <label className="text-sm font-medium font-armenian">Թեմա</label>
                  <Input placeholder="Հաղորդագրության թեմա..." />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium font-armenian">Բովանդակություն</label>
                <Textarea 
                  placeholder="Գրեք ձեր հաղորդագրությունը..." 
                  className="min-h-[200px]"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" className="font-armenian">Սևագիր պահել</Button>
                <Button className="font-armenian btn-modern">
                  <Send className="w-4 h-4 mr-2" />
                  Ուղարկել
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian">Հայտարարությունների կառավարում</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold font-armenian mb-2">Հայտարարությունների համակարգ</h3>
              <p className="text-muted-foreground font-armenian mb-4">
                Ստեղծեք և կառավարեք հանրային հայտարարությունները
              </p>
              <Button className="font-armenian btn-modern">
                <Plus className="w-4 h-4 mr-2" />
                Նոր հայտարարություն
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCommunicationTab;
