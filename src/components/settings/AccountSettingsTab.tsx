
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { User, Mail, Globe, Palette, HardDrive, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useTheme } from '@/contexts/ThemeContext';

interface AccountSettingsTabProps {
  user: SupabaseUser;
  profile: any;
}

const AccountSettingsTab = ({ user, profile }: AccountSettingsTabProps) => {
  const { theme, setTheme } = useTheme();
  const [newEmail, setNewEmail] = useState(user.email || '');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [storageUsage] = useState(75); // Mock data - in real app, fetch from API

  const handleEmailUpdate = async () => {
    if (newEmail === user.email) {
      toast.info('Էլ․ փոստի հասցեն նույնն է');
      return;
    }

    setIsUpdatingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;

      toast.success('Հաստատման հղումը ուղարկվեց նոր էլ․ փոստին');
    } catch (error: any) {
      toast.error('Սխալ է տեղի ունեցել էլ․ փոստը փոխելիս');
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleAccountDeactivation = () => {
    toast.error('Հաշվի ապաակտիվացման ֆունկցիան մշակման փուլում է');
  };

  const clearCache = () => {
    // Clear localStorage, sessionStorage, and other cached data
    localStorage.clear();
    sessionStorage.clear();
    
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    toast.success('Քեշը մաքրվեց');
  };

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <User className="w-5 h-5" />
            Հաշվի տեղեկություններ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Օգտանուն</Label>
            <Input
              value={profile?.name || 'Չի նշված'}
              disabled
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Օգտանունը կարող եք փոխել պրոֆիլի բաժնում
            </p>
          </div>

          <div>
            <Label htmlFor="email">Էլ․ փոստի հասցե</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Նոր էլ․ փոստի հասցե"
              />
              <Button 
                onClick={handleEmailUpdate}
                disabled={isUpdatingEmail || newEmail === user.email}
                variant="outline"
              >
                {isUpdatingEmail ? 'Ուղարկվում է...' : 'Փոխել'}
              </Button>
            </div>
          </div>

          <div>
            <Label>Դեր</Label>
            <Input
              value={
                profile?.role === 'student' ? 'Ուսանող' :
                profile?.role === 'instructor' ? 'Դասավանդող' :
                profile?.role === 'employer' ? 'Գործատու' :
                profile?.role === 'admin' ? 'Ադմինիստրատոր' : 'Չի նշված'
              }
              disabled
              className="bg-muted"
            />
          </div>

          <div>
            <Label>Գրանցման ամսաթիվ</Label>
            <Input
              value={new Date(user.created_at).toLocaleDateString('hy-AM')}
              disabled
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      {/* Language & Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Տեսքի կարգավորումներ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Թեմա</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Լուսավոր</SelectItem>
                <SelectItem value="dark">Մուգ</SelectItem>
                <SelectItem value="system">Համակարգի համաձայն</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Լեզու</Label>
            <Select value={profile?.language_preference || 'hy'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hy">Հայերեն</SelectItem>
                <SelectItem value="ru">Ռուսերեն</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Storage & Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Պահպանում և արտադրողականություն
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Պահպանման տարածք</Label>
              <span className="text-sm text-muted-foreground">{storageUsage}% օգտագործված</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${storageUsage}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              750 ՄԲ / 1 ԳԲ օգտագործված
            </p>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <div>
                <Label>Մաքրել քեշը</Label>
                <p className="text-sm text-muted-foreground">
                  Ջնջել ժամանակավոր ֆայլերը և բարելավել արտադրողականությունը
                </p>
              </div>
              <Button variant="outline" onClick={clearCache}>
                Մաքրել
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Հաշվի կարգավիճակ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">Ակտիվ հաշիվ</p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Ձեր հաշիվը լիարժեք ակտիվ է և բոլոր ծառայություններն առկա են
              </p>
            </div>
          </div>

          <div>
            <Label>Վերջին մուտք</Label>
            <Input
              value={new Date(user.last_sign_in_at || '').toLocaleString('hy-AM')}
              disabled
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Վտանգավոր գոտի
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Ապաակտիվացնել հաշիվը</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Ժամանակավորապես ապաակտիվացնել ձեր հաշիվը։ Կարող եք վերականգնել ցանկացած պահի։
            </p>
            <Button 
              variant="destructive" 
              onClick={handleAccountDeactivation}
              className="w-full md:w-auto"
            >
              Ապաակտիվացնել հաշիվը
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettingsTab;
