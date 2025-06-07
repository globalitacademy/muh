
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateProfile } from '@/hooks/useUserProfile';
import { Eye, EyeOff, Users, Download, Trash2, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface PrivacySettingsTabProps {
  profile: any;
}

const PrivacySettingsTab = ({ profile }: PrivacySettingsTabProps) => {
  const updateProfileMutation = useUpdateProfile();
  
  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: profile?.is_visible_to_employers ? 'employers' : 'private',
    show_email: false,
    show_phone: false,
    show_birth_date: false,
    allow_messages: true,
    analytics_tracking: true,
    data_sharing: false,
  });

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        is_visible_to_employers: privacySettings.profile_visibility === 'employers',
      });
      toast.success('Գաղտնիության կարգավորումները պահպանվեցին');
    } catch (error) {
      toast.error('Սխալ է տեղի ունեցել');
    }
  };

  const updatePrivacySetting = (key: string, value: boolean | string) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDownloadData = () => {
    toast.info('Ձեր տվյալների արտահանումը սկսվեց');
    // In a real implementation, this would trigger a data export
  };

  const handleDeleteAccount = () => {
    toast.error('Հաշվի ջնջման ֆունկցիան մշակման փուլում է');
    // In a real implementation, this would show a confirmation dialog
  };

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Պրոֆիլի տեսանելիություն
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Ով կարող է տեսնել ձեր պրոֆիլը</Label>
            <Select
              value={privacySettings.profile_visibility}
              onValueChange={(value) => updatePrivacySetting('profile_visibility', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Միայն ես</SelectItem>
                <SelectItem value="students">Ուսանողներ</SelectItem>
                <SelectItem value="instructors">Դասավանդողներ</SelectItem>
                <SelectItem value="employers">Գործատուներ</SelectItem>
                <SelectItem value="public">Բոլորը</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ցուցադրել էլ․ փոստը</Label>
                <p className="text-sm text-muted-foreground">
                  Թույլ տալ ուրիշներին տեսնել ձեր էլ․ փոստի հասցեն
                </p>
              </div>
              <Switch
                checked={privacySettings.show_email}
                onCheckedChange={(checked) => updatePrivacySetting('show_email', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ցուցադրել հեռախոսահամարը</Label>
                <p className="text-sm text-muted-foreground">
                  Թույլ տալ ուրիշներին տեսնել ձեր հեռախոսահամարը
                </p>
              </div>
              <Switch
                checked={privacySettings.show_phone}
                onCheckedChange={(checked) => updatePrivacySetting('show_phone', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ցուցադրել ծննդյան ամսաթիվը</Label>
                <p className="text-sm text-muted-foreground">
                  Թույլ տալ ուրիշներին տեսնել ձեր ծննդյան ամսաթիվը
                </p>
              </div>
              <Switch
                checked={privacySettings.show_birth_date}
                onCheckedChange={(checked) => updatePrivacySetting('show_birth_date', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Users className="w-5 h-5" />
            Հաղորդակցության կարգավորումներ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Թույլ տալ հաղորդագրություններ</Label>
              <p className="text-sm text-muted-foreground">
                Ուրիշ օգտատերերը կարող են ուղարկել ձեզ հաղորդագրություններ
              </p>
            </div>
            <Switch
              checked={privacySettings.allow_messages}
              onCheckedChange={(checked) => updatePrivacySetting('allow_messages', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Տվյալներ և վիերակչություն
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Վերլուծական հետագծում</Label>
              <p className="text-sm text-muted-foreground">
                Թույլ տալ հավաքել անանուն վիերակչական տվյալներ ծառայության բարելավման համար
              </p>
            </div>
            <Switch
              checked={privacySettings.analytics_tracking}
              onCheckedChange={(checked) => updatePrivacySetting('analytics_tracking', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Տվյալների կիսում</Label>
              <p className="text-sm text-muted-foreground">
                Կիսել տվյալները երրորդ կողմի գործընկերների հետ
              </p>
            </div>
            <Switch
              checked={privacySettings.data_sharing}
              onCheckedChange={(checked) => updatePrivacySetting('data_sharing', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Տվյալների կառավարում</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Արտահանել ձեր տվյալները</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Ստանալ ձեր բոլոր անձնական տվյալների պատճենը
            </p>
            <Button 
              variant="outline" 
              onClick={handleDownloadData}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Ներբեռնել տվյալները
            </Button>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2 text-destructive">Ջնջել հաշիվը</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Մշտապես ջնջել ձեր հաշիվը և բոլոր տվյալները։ Այս գործողությունը հնարավոր չէ չեղյալ համարել։
            </p>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Ջնջել հաշիվը
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Գաղտնիության դրույթներ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Մենք հարգում ենք ձեր գաղտնիությունը և անվտանգությունը։ Մանրամասն տեղեկությունների համար 
            ծանոթացեք մեր{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Գաղտնիության քաղաքականության
            </a>{' '}
            հետ։
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={updateProfileMutation.isPending}
          className="flex items-center gap-2"
        >
          {updateProfileMutation.isPending ? 'Պահպանվում է...' : 'Պահպանել կարգավորումները'}
        </Button>
      </div>
    </div>
  );
};

export default PrivacySettingsTab;
