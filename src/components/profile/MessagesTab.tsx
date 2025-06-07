
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMessages, useMarkMessageAsRead } from '@/hooks/useMessages';
import { MessageCircle, User, Clock, Mail } from 'lucide-react';

const MessagesTab = () => {
  const { data: messages, isLoading } = useMessages();
  const markAsReadMutation = useMarkMessageAsRead();

  if (isLoading) {
    return <div className="animate-pulse">Բեռնվում է...</div>;
  }

  const unreadCount = messages?.filter(m => !m.is_read).length || 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-armenian flex items-center gap-2">
            Հաղորդագրություններ
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </CardTitle>
          <Button>
            <Mail className="w-4 h-4 mr-2" />
            Նոր հաղորդագրություն
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages?.map((message) => (
              <div 
                key={message.id} 
                className={`p-4 border rounded-lg ${!message.is_read ? 'bg-blue-50 border-blue-200' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {message.sender?.name || 'Անանուն'}
                      </span>
                      {message.sender?.role && (
                        <Badge variant="outline" className="text-xs">
                          {message.sender.role}
                        </Badge>
                      )}
                      {!message.is_read && (
                        <Badge variant="destructive" className="text-xs">Նոր</Badge>
                      )}
                    </div>
                    
                    {message.subject && (
                      <h4 className="font-semibold mb-2">{message.subject}</h4>
                    )}
                    
                    <p className="text-sm text-muted-foreground mb-2">{message.content}</p>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(message.sent_at).toLocaleDateString('hy-AM')} {new Date(message.sent_at).toLocaleTimeString('hy-AM')}
                    </div>
                  </div>
                  
                  {!message.is_read && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => markAsReadMutation.mutate(message.id)}
                    >
                      Նշել որպես կարդացված
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {(!messages || messages.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-armenian">Հաղորդագրություններ չկան</p>
                <p className="text-sm">Դուք դեռ հաղորդագրություններ չեք ստացել</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesTab;
