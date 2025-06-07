
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Eye, Globe, Users, Lock, Download } from 'lucide-react';
import { toast } from 'sonner';

const PrivacySettings = () => {
  const [settings, setSettings] = useState({
    profileVisibility: 'private', // public, private, limited
    allowSearch: false,
    showEmail: false,
    showPhone: false,
    allowDirectMessages: true,
    shareProgress: false,
    dataSharingConsent: false,
    marketingEmails: false,
    analyticsTracking: true,
  });

  const handleExportData = () => {
    toast.success('Տվյալների արտահանման հարցումը ուղարկված է');
  };

  const handleDeleteAccount = () => {
    toast.error('Հաշվի ջնջման գործառույթը շուտով');
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
            <Label htmlFor="visibility">Ով կարող է տեսնել ձեր պրոֆիլը</Label>
            <Select 
              value={settings.profileVisibility} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, profileVisibility: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Բոլորը</SelectItem>
                <SelectItem value="limited">Միայն ուսանողները</SelectItem>
                <SelectItem value="private">Միայն ես</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Որոնման մեջ ցույց տալ</Label>
              <p className="text-sm text-muted-foreground">
                Թույլ տալ գտնել ձեզ որոնման միջոցով
              </p>
            </div>
            <Switch
              checked={settings.allowSearch}
              onCheckedChange={(value) => setSettings(prev => ({ ...prev, allowSearch: value }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Էլ․փոստի ցուցադրում</Label>
              <p className="text-sm text-muted-foreground">
                Ցույց տալ էլ․փոստը պրոֆիլում
              </p>
            </div>
            <Switch
              checked={settings.showEmail}
              onCheckedChange={(value) => setSettings(prev => ({ ...prev, showEmail: value }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Հեռախոսի ցուցադրում</Label>
              <p className="text-sm text-muted-foreground">
                Ցույց տալ հեռախոսը պրոֆիլում
              </p>
            </div>
            <Switch
              checked={settings.showPhone}
              onCheckedChange={(value) => setSettings(prev => ({ ...prev, showPhone: value }))}
            />
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
            <div>
              <Label className="font-armenian">Ուղղակի հաղորդագրություններ</Label>
              <p className="text-sm text-muted-foreground">
                Թույլ տալ ուսանողներին ուղղակի նամակ գրել
              </p>
            </div>
            <Switch
              checked={settings.allowDirectMessages}
              onCheckedChange={(value) => setSettings(prev => ({ ...prev, allowDirectMessages: value }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Առաջընթացի կիսում</Label>
              <p className="text-sm text-muted-foreground">
                Կիսվել ուսանողների առաջընթացով այլ դասախոսների հետ
              </p>
            </div>
            <Switch
              checked={settings.shareProgress}
              onCheckedChange={(value) => setSettings(prev => ({ ...prev, shareProgress: value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Տվյալների գաղտնիություն
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Տվյալների կիսում</Label>
              <p className="text-sm text-muted-foreground">
                Համաձայնություն տվյալները կիսելու երրորդ կողմերի հետ
              </p>
            </div>
            <Switch
              checked={settings.dataSharingConsent}
              onCheckedChange={(value) => setSettings(prev => ({ ...prev, dataSharingConsent: value }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Մարքեթինգային էլ․նամակներ</Label>
              <p className="text-sm text-muted-foreground">
                Ստանալ տեղեկություններ նոր հնարավորությունների մասին
              </p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(value) => setSettings(prev => ({ ...prev, marketingEmails: value }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Վերլուծական հետագծում</Label>
              <p className="text-sm text-muted-foreground">
                Օգնել բարելավել հարթակը օգտագործման տվյալներով
              </p>
            </div>
            <Switch
              checked={settings.analyticsTracking}
              onCheckedChange={(value) => setSettings(prev => ({ ...prev, analyticsTracking: value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Download className="w-5 h-5" />
            Տվյալների կառավարում
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button onClick={handleExportData} variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Արտահանել իմ տվյալները
            </Button>
            <p className="text-sm text-muted-foreground">
              Ծանուցում կստանաք, երբ տվյալները պատրաստ լինեն ներբեռնման
            </p>
          </div>
          
          <div className="border-t pt-4">
            <div className="bg-destructive/10 p-4 rounded-lg">
              <h4 className="font-semibold text-destructive font-armenian mb-2">Վտանգավոր գոտի</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Հաշվի ջնջումը անվերադարձ գործողություն է։ Բոլոր տվյալները կջնջվեն։
              </p>
              <Button onClick={handleDeleteAccount} variant="destructive" size="sm">
                Ջնջել հաշիվը
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacySettings;
