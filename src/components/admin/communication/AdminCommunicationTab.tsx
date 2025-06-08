
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedMessages, useSearchMessages } from '@/hooks/useEnhancedMessages';
import { useAnnouncements, usePublishAnnouncement, useDeleteAnnouncement } from '@/hooks/useAnnouncements';
import { useCommunicationStats } from '@/hooks/useCommunicationStats';
import { useNotifications } from '@/hooks/useNotifications';
import MessageDetailDialog from './MessageDetailDialog';
import ComposeMessageDialog from './ComposeMessageDialog';
import AnnouncementDialog from './AnnouncementDialog';
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
  Archive,
  Clock,
  CheckCircle,
  Trash2,
  Edit
} from 'lucide-react';

const AdminCommunicationTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isMessageDetailOpen, setIsMessageDetailOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  const { user } = useAuth();
  const { data: messages, isLoading: messagesLoading } = useEnhancedMessages(user?.id);
  const { data: searchResults } = useSearchMessages(searchTerm, user?.id);
  const { data: announcements } = useAnnouncements();
  const { data: notifications } = useNotifications();
  const { data: stats } = useCommunicationStats();
  const publishAnnouncementMutation = usePublishAnnouncement();
  const deleteAnnouncementMutation = useDeleteAnnouncement();

  // Use search results when searching, otherwise use all messages
  const displayedMessages = searchTerm.trim() ? searchResults : messages;

  useEffect(() => {
    // Real-time subscription for new messages
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          // Refetch messages when changes occur
          queryClient.invalidateQueries({ queryKey: ['enhanced-messages'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setIsMessageDetailOpen(true);
  };

  const handleReply = (message) => {
    setReplyTo({
      recipient_id: message.sender_id,
      subject: message.subject
    });
    setIsComposeOpen(true);
  };

  const handleComposeNew = () => {
    setReplyTo(null);
    setIsComposeOpen(true);
  };

  const handlePublishAnnouncement = (id) => {
    publishAnnouncementMutation.mutate(id);
  };

  const handleDeleteAnnouncement = (id) => {
    if (confirm('Իսկապե՞ս ուզում եք ջնջել այս հայտարարությունը:')) {
      deleteAnnouncementMutation.mutate(id);
    }
  };

  const getAnnouncementTypeBadge = (type) => {
    const types = {
      general: { label: 'Ընդհանուր', color: 'bg-gray-500' },
      announcement: { label: 'Հայտարարություն', color: 'bg-edu-blue' },
      system: { label: 'Համակարգային', color: 'bg-warning-yellow' },
      academic: { label: 'Ակադեմիական', color: 'bg-success-green' }
    };
    return types[type] || types.general;
  };

  const getPriorityBadge = (priority) => {
    const priorities = {
      low: { label: 'Ցածր', color: 'bg-gray-400' },
      medium: { label: 'Միջին', color: 'bg-edu-blue' },
      high: { label: 'Բարձր', color: 'bg-warning-yellow' },
      urgent: { label: 'Արտակարգ', color: 'bg-red-500' }
    };
    return priorities[priority] || priorities.medium;
  };

  if (messagesLoading) {
    return <div className="animate-pulse font-armenian">Բեռնվում է...</div>;
  }

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
          <Button onClick={handleComposeNew} className="font-armenian btn-modern">
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
            <div className="text-2xl font-bold">{stats?.totalMessages || 0}</div>
            <p className="text-xs text-muted-foreground font-armenian">Բոլոր հաղորդագրությունները</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Չկարդացած</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-yellow">{stats?.unreadMessages || 0}</div>
            <p className="text-xs text-muted-foreground font-armenian">Նոր հաղորդագրություններ</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ուղարկված ծանուցումներ</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-edu-blue">{stats?.sentNotifications || 0}</div>
            <p className="text-xs text-muted-foreground font-armenian">Այս ամիս</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-armenian">Ակտիվ հայտարարություններ</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-green">{stats?.activeAnnouncements || 0}</div>
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
              <CardTitle className="font-armenian">
                {searchTerm ? 'Որոնման արդյունքներ' : 'Մուտքային հաղորդագրություններ'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayedMessages?.length > 0 ? (
                  displayedMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 ${!message.is_read ? 'bg-muted/30 border-edu-blue' : ''}`}
                      onClick={() => handleMessageClick(message)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-edu-blue to-edu-orange flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className={`font-semibold ${!message.is_read ? 'font-bold' : ''}`}>
                            {message.sender?.name || 'Անանուն'}
                          </p>
                          <p className="text-sm text-muted-foreground">{message.subject || 'Առանց թեմայի'}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(message.sent_at).toLocaleString('hy-AM')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!message.is_read && <div className="w-2 h-2 bg-edu-blue rounded-full"></div>}
                        {message.sender?.role && (
                          <Badge variant="outline">
                            {message.sender.role === 'admin' ? 'Ադմին' : 
                             message.sender.role === 'instructor' ? 'Դասավանդող' : 
                             message.sender.role === 'student' ? 'Ուսանող' : 'Գործատու'}
                          </Badge>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-armenian">Հաղորդագրություններ չկան</p>
                    <p className="text-sm">
                      {searchTerm ? 'Որոնման արդյունքներ չգտնվեցին' : 'Դուք դեռ հաղորդագրություններ չեք ստացել'}
                    </p>
                  </div>
                )}
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
                {notifications?.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{notification.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(notification.created_at).toLocaleString('hy-AM')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!notification.is_read && (
                            <Badge variant="destructive">Նոր</Badge>
                          )}
                          <Badge variant="outline">
                            {notification.type === 'announcement' ? 'Հայտարարություն' : 'Համակարգային'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-armenian">Ծանուցումներ չկան</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compose" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="font-armenian">Բարի գալուստ նոր հաղորդագրության բաժին</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Send className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold font-armenian mb-2">Ստեղծել նոր հաղորդագրություն</h3>
              <p className="text-muted-foreground font-armenian mb-4">
                Ուղարկեք հաղորդագրություն օգտվողներին
              </p>
              <Button onClick={handleComposeNew} className="font-armenian btn-modern">
                <Plus className="w-4 h-4 mr-2" />
                Նոր հաղորդագրություն
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold font-armenian">Հայտարարությունների կառավարում</h4>
            <Button onClick={() => setIsAnnouncementOpen(true)} className="font-armenian btn-modern">
              <Plus className="w-4 h-4 mr-2" />
              Նոր հայտարարություն
            </Button>
          </div>

          <Card className="modern-card">
            <CardContent>
              <div className="space-y-4">
                {announcements?.length > 0 ? (
                  announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{announcement.title}</h4>
                            <Badge className={`${getAnnouncementTypeBadge(announcement.type).color} text-white text-xs`}>
                              {getAnnouncementTypeBadge(announcement.type).label}
                            </Badge>
                            <Badge className={`${getPriorityBadge(announcement.priority).color} text-white text-xs`}>
                              {getPriorityBadge(announcement.priority).label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Ստեղծված՝ {new Date(announcement.created_at).toLocaleDateString('hy-AM')}</span>
                            <span>Կարգավիճակ՝ {announcement.status === 'published' ? 'Հրապարակված' : 'Սևագիր'}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {announcement.status === 'draft' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePublishAnnouncement(announcement.id)}
                              className="font-armenian"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Հրապարակել
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-armenian">Հայտարարություններ չկան</p>
                    <p className="text-sm">Ստեղծեք ձեր առաջին հայտարարությունը</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <MessageDetailDialog
        message={selectedMessage}
        open={isMessageDetailOpen}
        onOpenChange={setIsMessageDetailOpen}
        onReply={handleReply}
      />

      <ComposeMessageDialog
        open={isComposeOpen}
        onOpenChange={setIsComposeOpen}
        replyTo={replyTo}
      />

      <AnnouncementDialog
        open={isAnnouncementOpen}
        onOpenChange={setIsAnnouncementOpen}
      />
    </div>
  );
};

export default AdminCommunicationTab;
