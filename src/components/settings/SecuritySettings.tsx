
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Smartphone, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const SecuritySettings = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions] = useState([
    { id: '1', device: 'Chrome - Windows', location: 'Երևան, Հայաստան', lastActive: '2 րոպե առաջ', current: true },
    { id: '2', device: 'Safari - iPhone', location: 'Երևան, Հայաստան', lastActive: '1 ժամ առաջ', current: false },
  ]);

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Գաղտնաբառերը չեն համընկնում');
      return;
    }
    toast.success('Գաղտնաբառը հաջողությամբ փոխվեց');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const enableTwoFactor = () => {
    setTwoFactorEnabled(true);
    toast.success('Երկակի նույնականացումը միացվեց');
  };

  const terminateSession = (sessionId: string) => {
    toast.success('Նստաշրջանը ավարտվեց');
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
            <Label htmlFor="currentPassword">Ընթացիկ գաղտնաբառ</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              placeholder="Մուտքագրեք ընթացիկ գաղտնաբառը"
            />
          </div>
          
          <div>
            <Label htmlFor="newPassword">Նոր գաղտնաբառ</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="Մուտքագրեք նոր գաղտնաբառը"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Գաղտնաբառը պետք է լինի առնվազն 8 նիշ և պարունակի թվեր ու տառեր
            </p>
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Հաստատել գաղտնաբառը</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              placeholder="Կրկին մուտքագրեք նոր գաղտնաբառը"
            />
          </div>
          
          <Button onClick={handlePasswordChange} className="w-full">
            Փոխել գաղտնաբառը
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Երկակի նույնականացում (2FA)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold font-armenian">Երկակի նույնականացում</h4>
              <p className="text-sm text-muted-foreground">
                Ավելացրեք լրացուցիչ անվտանգություն ձեր հաշվին
              </p>
            </div>
            <div className="flex items-center gap-2">
              {twoFactorEnabled && <Badge variant="secondary">Միացված</Badge>}
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>
          </div>
          
          {!twoFactorEnabled && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="font-semibold font-armenian">Խորհուրդ</span>
              </div>
              <p className="text-sm">
                Երկակի նույնականացումը զգալիորեն բարձրացնում է ձեր հաշվի անվտանգությունը։
              </p>
              <Button onClick={enableTwoFactor} className="mt-3" variant="outline">
                Միացնել 2FA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Ակտիվ նստաշրջաններ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{session.device}</h4>
                  {session.current && <Badge variant="default">Ընթացիկ</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{session.location}</p>
                <p className="text-xs text-muted-foreground">Վերջին գործունեություն՝ {session.lastActive}</p>
              </div>
              {!session.current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => terminateSession(session.id)}
                >
                  Ավարտել
                </Button>
              )}
            </div>
          ))}
          
          <Button variant="outline" className="w-full">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Ավարտել բոլոր այլ նստաշրջանները
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
