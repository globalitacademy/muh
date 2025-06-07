
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Mail, Smartphone, MessageSquare } from 'lucide-react';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    email: {
      courseUpdates: true,
      studentMessages: true,
      systemNotifications: false,
      weeklyReports: true,
    },
    push: {
      newEnrollments: true,
      studentQuestions: true,
      systemAlerts: true,
      courseDeadlines: false,
    },
    sms: {
      emergencyAlerts: true,
      importantUpdates: false,
    },
    frequency: 'immediate', // immediate, daily, weekly
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00',
    }
  });

  const updateEmailSetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      email: { ...prev.email, [key]: value }
    }));
  };

  const updatePushSetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      push: { ...prev.push, [key]: value }
    }));
  };

  const updateSmsSetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      sms: { ...prev.sms, [key]: value }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Էլ․փոստի ծանուցումներ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Դասընթացների թարմացումներ</Label>
              <p className="text-sm text-muted-foreground">
                Ծանուցումներ նոր բովանդակության և փոփոխությունների մասին
              </p>
            </div>
            <Switch
              checked={settings.email.courseUpdates}
              onCheckedChange={(value) => updateEmailSetting('courseUpdates', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Ուսանողների հաղորդագրություններ</Label>
              <p className="text-sm text-muted-foreground">
                Նոր հարցեր և հաղորդագրություններ ուսանողներից
              </p>
            </div>
            <Switch
              checked={settings.email.studentMessages}
              onCheckedChange={(value) => updateEmailSetting('studentMessages', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Համակարգային ծանուցումներ</Label>
              <p className="text-sm text-muted-foreground">
                Տեխնիկական կարգավորումներ և թարմացումներ
              </p>
            </div>
            <Switch
              checked={settings.email.systemNotifications}
              onCheckedChange={(value) => updateEmailSetting('systemNotifications', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Շաբաթական հաշվետվություններ</Label>
              <p className="text-sm text-muted-foreground">
                Ուսանողների առաջընթացի ամփոփ տվյալներ
              </p>
            </div>
            <Switch
              checked={settings.email.weeklyReports}
              onCheckedChange={(value) => updateEmailSetting('weeklyReports', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Push ծանուցումներ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Նոր գրանցումներ</Label>
              <p className="text-sm text-muted-foreground">
                Ծանուցումներ նոր ուսանողների գրանցման մասին
              </p>
            </div>
            <Switch
              checked={settings.push.newEnrollments}
              onCheckedChange={(value) => updatePushSetting('newEnrollments', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Ուսանողների հարցեր</Label>
              <p className="text-sm text-muted-foreground">
                Ակնթարթային ծանուցումներ նոր հարցերի մասին
              </p>
            </div>
            <Switch
              checked={settings.push.studentQuestions}
              onCheckedChange={(value) => updatePushSetting('studentQuestions', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Համակարգային ազդանշաններ</Label>
              <p className="text-sm text-muted-foreground">
                Կարևոր համակարգային ծանուցումներ
              </p>
            </div>
            <Switch
              checked={settings.push.systemAlerts}
              onCheckedChange={(value) => updatePushSetting('systemAlerts', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            SMS ծանուցումներ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Արտակարգ իրավիճակներ</Label>
              <p className="text-sm text-muted-foreground">
                Կարևոր և արտակարգ ծանուցումներ
              </p>
            </div>
            <Switch
              checked={settings.sms.emergencyAlerts}
              onCheckedChange={(value) => updateSmsSetting('emergencyAlerts', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Կարևոր թարմացումներ</Label>
              <p className="text-sm text-muted-foreground">
                Հիմնական պլատֆորմի փոփոխություններ
              </p>
            </div>
            <Switch
              checked={settings.sms.importantUpdates}
              onCheckedChange={(value) => updateSmsSetting('importantUpdates', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Frequency */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Ծանուցումների հաճախականություն</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="frequency">Ծանուցումների ռեժիմ</Label>
            <Select value={settings.frequency} onValueChange={(value) => setSettings(prev => ({ ...prev, frequency: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Ակնթարթային</SelectItem>
                <SelectItem value="daily">Օրական ամփոփում</SelectItem>
                <SelectItem value="weekly">Շաբաթական ամփոփում</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Լուռ ժամեր</Label>
              <p className="text-sm text-muted-foreground">
                Ժամանակահատված, երբ ծանուցումները չեն ուղարկվում
              </p>
            </div>
            <Switch
              checked={settings.quietHours.enabled}
              onCheckedChange={(value) => setSettings(prev => ({
                ...prev,
                quietHours: { ...prev.quietHours, enabled: value }
              }))}
            />
          </div>
          
          {settings.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Սկիզբ</Label>
                <Select value={settings.quietHours.start}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="22:00">22:00</SelectItem>
                    <SelectItem value="23:00">23:00</SelectItem>
                    <SelectItem value="00:00">00:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="endTime">Ավարտ</Label>
                <Select value={settings.quietHours.end}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="06:00">06:00</SelectItem>
                    <SelectItem value="07:00">07:00</SelectItem>
                    <SelectItem value="08:00">08:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
