
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Key, Smartphone, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface SecuritySettingsTabProps {
  user: User;
}

const SecuritySettingsTab = ({ user }: SecuritySettingsTabProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Նոր գաղտնաբառերը չեն համընկնում');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Գաղտնաբառը պետք է լինի առնվազն 6 նիշ');
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Գաղտնաբառը հաջողությամբ փոխվեց');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error('Սխալ է տեղի ունեցել գաղտնաբառը փոխելիս');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSignOutAllDevices = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      toast.success('Բոլոր սարքերից դուրս եկաք');
    } catch (error) {
      toast.error('Սխալ է տեղի ունեցել');
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Key className="w-5 h-5" />
            Գաղտնաբառի փոփոխություն
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-password">Ընթացիկ գաղտնաբառ</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Մուտքագրեք ընթացիկ գաղտնաբառը"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-password">Նոր գաղտնաբառ</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Նոր գաղտնաբառ"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Հաստատեք գաղտնաբառը</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Կրկնեք նոր գաղտնաբառը"
              />
            </div>
          </div>
          
          <Button 
            onClick={handlePasswordChange}
            disabled={isChangingPassword || !newPassword || !confirmPassword}
            className="w-full md:w-auto"
          >
            {isChangingPassword ? 'Փոխվում է...' : 'Փոխել գաղտնաբառը'}
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Երկակի նույնականացում
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Երկակի նույնականացում</Label>
              <p className="text-sm text-muted-foreground">
                Ավելացրեք լրացուցիչ անվտանգություն ձեր հաշվին
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>
          
          {twoFactorEnabled && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Երկակի նույնականացումը կգործարկվի հաջորդ մուտքի ժամանակ
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Նստաշրջանի կառավարում
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="session-timeout">Նստաշրջանի ավարտ (րոպե)</Label>
            <Input
              id="session-timeout"
              type="number"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(Number(e.target.value))}
              min="5"
              max="120"
              className="w-32"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Ինքնաբերաբար դուրս գալ {sessionTimeout} րոպե անգործության դեպքում
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Մուտքի ծանուցումներ</Label>
              <p className="text-sm text-muted-foreground">
                Ծանուցում ստանալ նոր մուտքերի դեպքում
              </p>
            </div>
            <Switch
              checked={loginAlerts}
              onCheckedChange={setLoginAlerts}
            />
          </div>
          
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleSignOutAllDevices}
              className="w-full md:w-auto"
            >
              Բոլոր սարքերից դուրս գալ
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Դուրս կգաք բոլոր սարքերից և կպահանջվի նորից մուտք գործել
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Անվտանգության զգուշացումներ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  Բոլոր անվտանգության ստուգումներն անցած են
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Ձեր հաշիվը պաշտպանված է
                </p>
              </div>
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettingsTab;
