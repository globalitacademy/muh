
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useUpdateProfile } from '@/hooks/useUserProfile';
import { Bell, Mail, MessageSquare, Calendar, GraduationCap, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationSettingsTabProps {
  profile: any;
}

const NotificationSettingsTab = ({ profile }: NotificationSettingsTabProps) => {
  const updateProfileMutation = useUpdateProfile();
  
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    course_updates: true,
    exam_reminders: true,
    job_alerts: profile?.role === 'student',
    message_notifications: true,
    system_updates: true,
    marketing_emails: false,
  });

  const [emailFrequency, setEmailFrequency] = useState('daily');
  const [quietHours, setQuietHours] = useState({
    enabled: true,
    start: '22:00',
    end: '08:00',
  });

  const handleSave = async () => {
    try {
      // In a real implementation, you would save these notification preferences
      // to a separate notifications table or user preferences
      toast.success('Ծանուցումների կարգավորումները պահպանվեցին');
    } catch (error) {
      toast.error('Սխալ է տեղի ունեցել');
    }
  };

  const updateNotification = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* General Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Ընդհանուր ծանուցումներ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Էլ․ փոստի ծանուցումներ
              </Label>
              <p className="text-sm text-muted-foreground">
                Ստանալ ծանուցումներ էլ․ փոստով
              </p>
            </div>
            <Switch
              checked={notifications.email_notifications}
              onCheckedChange={(checked) => updateNotification('email_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push ծանուցումներ</Label>
              <p className="text-sm text-muted-foreground">
                Ստանալ ծանուցումներ բրաուզերում
              </p>
            </div>
            <Switch
              checked={notifications.push_notifications}
              onCheckedChange={(checked) => updateNotification('push_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                SMS ծանուցումներ
              </Label>
              <p className="text-sm text-muted-foreground">
                Ստանալ ծանուցումներ հեռախոսով
              </p>
            </div>
            <Switch
              checked={notifications.sms_notifications}
              onCheckedChange={(checked) => updateNotification('sms_notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Բովանդակության ծանուցումներ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Դասընթացների թարմացումներ
              </Label>
              <p className="text-sm text-muted-foreground">
                Նոր բաժիններ, առաջադրանքներ և գնահատականներ
              </p>
            </div>
            <Switch
              checked={notifications.course_updates}
              onCheckedChange={(checked) => updateNotification('course_updates', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Քննությունների հիշեցումներ
              </Label>
              <p className="text-sm text-muted-foreground">
                Հիշեցումներ առաջիկա քննությունների մասին
              </p>
            </div>
            <Switch
              checked={notifications.exam_reminders}
              onCheckedChange={(checked) => updateNotification('exam_reminders', checked)}
            />
          </div>

          {profile?.role === 'student' && (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Աշխատանքային առաջարկություններ
                </Label>
                <p className="text-sm text-muted-foreground">
                  Նոր աշխատանքային հնարավորություններ
                </p>
              </div>
              <Switch
                checked={notifications.job_alerts}
                onCheckedChange={(checked) => updateNotification('job_alerts', checked)}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Հաղորդագրությունների ծանուցումներ</Label>
              <p className="text-sm text-muted-foreground">
                Նոր անձնական հաղորդագրություններ
              </p>
            </div>
            <Switch
              checked={notifications.message_notifications}
              onCheckedChange={(checked) => updateNotification('message_notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Frequency */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Էլ․ փոստի հաճախություն</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Ծանուցումների հաճախություն</Label>
            <Select value={emailFrequency} onValueChange={setEmailFrequency}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Անմիջապես</SelectItem>
                <SelectItem value="daily">Ամենօրյա ամփոփում</SelectItem>
                <SelectItem value="weekly">Շաբաթական ամփոփում</SelectItem>
                <SelectItem value="never">Երբեք</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Լուռ ժամեր</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ակտիվացնել լուռ ժամերը</Label>
              <p className="text-sm text-muted-foreground">
                Չստանալ ծանուցումներ ընտրված ժամանակահատվածում
              </p>
            </div>
            <Switch
              checked={quietHours.enabled}
              onCheckedChange={(checked) => 
                setQuietHours(prev => ({ ...prev, enabled: checked }))
              }
            />
          </div>

          {quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Սկիզբ</Label>
                <Select
                  value={quietHours.start}
                  onValueChange={(value) => 
                    setQuietHours(prev => ({ ...prev, start: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <SelectItem key={hour} value={`${hour}:00`}>
                          {hour}:00
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ավարտ</Label>
                <Select
                  value={quietHours.end}
                  onValueChange={(value) => 
                    setQuietHours(prev => ({ ...prev, end: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <SelectItem key={hour} value={`${hour}:00`}>
                          {hour}:00
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Marketing */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Մարքեթինգ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Մարքեթինգային էլ․ նամակներ</Label>
              <p className="text-sm text-muted-foreground">
                Ստանալ տեղեկություններ նոր հնարավորությունների և առաջարկությունների մասին
              </p>
            </div>
            <Switch
              checked={notifications.marketing_emails}
              onCheckedChange={(checked) => updateNotification('marketing_emails', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          Պահպանել կարգավորումները
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettingsTab;
