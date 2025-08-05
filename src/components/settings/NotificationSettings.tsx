import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Bell, Mail, Smartphone, MessageSquare, Save, Loader2 } from 'lucide-react';
import { useNotificationPreferences, useUpdateNotificationPreferences } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';

const NotificationSettings = () => {
  const { toast } = useToast();
  const { data: preferences, isLoading } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  const [settings, setSettings] = useState({
    email_enabled: true,
    push_enabled: true,
    sms_enabled: false,
    frequency: 'immediate',
    quiet_hours_enabled: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    types_config: {
      course_enrollment: { email: true, push: true, sms: false },
      course_completion: { email: true, push: true, sms: false },
      assignment_due: { email: true, push: true, sms: false },
      exam_reminder: { email: true, push: true, sms: false },
      grade_published: { email: true, push: false, sms: false },
      message_received: { email: true, push: true, sms: false },
      announcement: { email: true, push: true, sms: false },
      application_status: { email: true, push: true, sms: true },
      payment_confirmation: { email: true, push: true, sms: true },
      certificate_issued: { email: true, push: true, sms: false },
      system_alert: { email: true, push: true, sms: true },
      instructor_assignment: { email: true, push: true, sms: false },
      partner_course_update: { email: true, push: false, sms: false },
    },
  });

  // Load preferences from database
  useEffect(() => {
    if (preferences) {
      setSettings({
        email_enabled: preferences.email_enabled,
        push_enabled: preferences.push_enabled,
        sms_enabled: preferences.sms_enabled,
        frequency: preferences.frequency,
        quiet_hours_enabled: preferences.quiet_hours_enabled,
        quiet_hours_start: preferences.quiet_hours_start,
        quiet_hours_end: preferences.quiet_hours_end,
        types_config: preferences.types_config || settings.types_config,
      });
    }
  }, [preferences]);

  const handleSave = async () => {
    try {
      await updatePreferences.mutateAsync({
        user_id: '', // Will be set automatically in the hook
        ...settings,
      });
      toast({
        title: 'Կարգավորումները պահպանվել են',
        description: 'Ծանուցումների կարգավորումները հաջողությամբ փոխվել են։',
      });
    } catch (error) {
      toast({
        title: 'Սխալ',
        description: 'Կարգավորումները չհաջողվեց պահպանել։',
        variant: 'destructive',
      });
    }
  };

  const updateGeneralSetting = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateTypeSetting = (type: string, channel: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      types_config: {
        ...prev.types_config,
        [type]: {
          ...prev.types_config[type],
          [channel]: value,
        },
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Բեռնվում է...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Ծանուցումների գլխավոր կարգավորումներ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Էլ․փոստի ծանուցումներ</Label>
              <p className="text-sm text-muted-foreground">
                Ընդհանուր էլ․փոստի ծանուցումների միացում/անջատում
              </p>
            </div>
            <Switch
              checked={settings.email_enabled}
              onCheckedChange={(value) => updateGeneralSetting('email_enabled', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Push ծանուցումներ</Label>
              <p className="text-sm text-muted-foreground">
                Բրաուզերային push ծանուցումների միացում/անջատում
              </p>
            </div>
            <Switch
              checked={settings.push_enabled}
              onCheckedChange={(value) => updateGeneralSetting('push_enabled', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">SMS ծանուցումներ</Label>
              <p className="text-sm text-muted-foreground">
                SMS հաղորդագրությունների միացում/անջատում
              </p>
            </div>
            <Switch
              checked={settings.sms_enabled}
              onCheckedChange={(value) => updateGeneralSetting('sms_enabled', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Ծանուցումների տեսակներ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Course Notifications */}
          <div className="space-y-4">
            <h4 className="font-medium font-armenian">Դասընթացների ծանուցումներ</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="md:col-span-1">
                <Label className="text-sm">Դասընթացի գրանցում</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.types_config.course_enrollment?.email}
                  onCheckedChange={(value) => updateTypeSetting('course_enrollment', 'email', value)}
                  disabled={!settings.email_enabled}
                />
                <Mail className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.types_config.course_enrollment?.push}
                  onCheckedChange={(value) => updateTypeSetting('course_enrollment', 'push', value)}
                  disabled={!settings.push_enabled}
                />
                <Smartphone className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.types_config.course_enrollment?.sms}
                  onCheckedChange={(value) => updateTypeSetting('course_enrollment', 'sms', value)}
                  disabled={!settings.sms_enabled}
                />
                <MessageSquare className="h-4 w-4" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="md:col-span-1">
                <Label className="text-sm">Դասընթացի ավարտ</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.types_config.course_completion?.email}
                  onCheckedChange={(value) => updateTypeSetting('course_completion', 'email', value)}
                  disabled={!settings.email_enabled}
                />
                <Mail className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.types_config.course_completion?.push}
                  onCheckedChange={(value) => updateTypeSetting('course_completion', 'push', value)}
                  disabled={!settings.push_enabled}
                />
                <Smartphone className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.types_config.course_completion?.sms}
                  onCheckedChange={(value) => updateTypeSetting('course_completion', 'sms', value)}
                  disabled={!settings.sms_enabled}
                />
                <MessageSquare className="h-4 w-4" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="md:col-span-1">
                <Label className="text-sm">Առաջադրանքի ժամկետ</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.types_config.assignment_due?.email}
                  onCheckedChange={(value) => updateTypeSetting('assignment_due', 'email', value)}
                  disabled={!settings.email_enabled}
                />
                <Mail className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.types_config.assignment_due?.push}
                  onCheckedChange={(value) => updateTypeSetting('assignment_due', 'push', value)}
                  disabled={!settings.push_enabled}
                />
                <Smartphone className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.types_config.assignment_due?.sms}
                  onCheckedChange={(value) => updateTypeSetting('assignment_due', 'sms', value)}
                  disabled={!settings.sms_enabled}
                />
                <MessageSquare className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* System Notifications */}
          <div className="space-y-4">
            <h4 className="font-medium font-armenian">Համակարգային ծանուցումներ</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="md:col-span-1">
                <Label className="text-sm">Հայտարարություններ</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.types_config.announcement?.email}
                  onCheckedChange={(value) => updateTypeSetting('announcement', 'email', value)}
                  disabled={!settings.email_enabled}
                />
                <Mail className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.types_config.announcement?.push}
                  onCheckedChange={(value) => updateTypeSetting('announcement', 'push', value)}
                  disabled={!settings.push_enabled}
                />
                <Smartphone className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.types_config.announcement?.sms}
                  onCheckedChange={(value) => updateTypeSetting('announcement', 'sms', value)}
                  disabled={!settings.sms_enabled}
                />
                <MessageSquare className="h-4 w-4" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="md:col-span-1">
                <Label className="text-sm">Համակարգային ազդանշան</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.types_config.system_alert?.email}
                  onCheckedChange={(value) => updateTypeSetting('system_alert', 'email', value)}
                  disabled={!settings.email_enabled}
                />
                <Mail className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.types_config.system_alert?.push}
                  onCheckedChange={(value) => updateTypeSetting('system_alert', 'push', value)}
                  disabled={!settings.push_enabled}
                />
                <Smartphone className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.types_config.system_alert?.sms}
                  onCheckedChange={(value) => updateTypeSetting('system_alert', 'sms', value)}
                  disabled={!settings.sms_enabled}
                />
                <MessageSquare className="h-4 w-4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Frequency and Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Ժամանակացույց և հաճախականություն</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="frequency">Ծանուցումների հաճախականություն</Label>
            <Select value={settings.frequency} onValueChange={(value) => updateGeneralSetting('frequency', value)}>
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
              checked={settings.quiet_hours_enabled}
              onCheckedChange={(value) => updateGeneralSetting('quiet_hours_enabled', value)}
            />
          </div>
          
          {settings.quiet_hours_enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Սկիզբ</Label>
                <Select 
                  value={settings.quiet_hours_start} 
                  onValueChange={(value) => updateGeneralSetting('quiet_hours_start', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20:00">20:00</SelectItem>
                    <SelectItem value="21:00">21:00</SelectItem>
                    <SelectItem value="22:00">22:00</SelectItem>
                    <SelectItem value="23:00">23:00</SelectItem>
                    <SelectItem value="00:00">00:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="endTime">Ավարտ</Label>
                <Select 
                  value={settings.quiet_hours_end} 
                  onValueChange={(value) => updateGeneralSetting('quiet_hours_end', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="06:00">06:00</SelectItem>
                    <SelectItem value="07:00">07:00</SelectItem>
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={updatePreferences.isPending}
          className="font-armenian"
        >
          {updatePreferences.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Պահպանվում է...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Պահպանել կարգավորումները
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;