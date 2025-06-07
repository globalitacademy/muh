
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Palette, Globe, Trash2, RotateCcw, Zap } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const AccountSettings = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  
  const [accountSettings, setAccountSettings] = useState({
    autoSave: true,
    offlineMode: false,
    highPerformanceMode: false,
    betaFeatures: false,
  });

  const handleClearCache = () => {
    localStorage.clear();
    toast.success('Քեշը մաքրված է');
  };

  const handleResetSettings = () => {
    toast.success('Կարգավորումները վերականգնված են');
  };

  const handleOptimizePerformance = () => {
    setAccountSettings(prev => ({ ...prev, highPerformanceMode: true }));
    toast.success('Արտադրողականությունը օպտիմիզացված է');
  };

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Տեսքի կարգավորումներ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="theme">Գունային թեմա</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Բաց</SelectItem>
                <SelectItem value="dark">Մուգ</SelectItem>
                <SelectItem value="system">Համակարգային</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Ընտրեք ձեր նախընտրած գունային թեման
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Լեզվի կարգավորումներ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="language">Ինտերֆեյսի լեզու</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hy">Հայերեն</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Ընտրեք ինտերֆեյսի լեզուն
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Արտադրողականություն
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Ավտոմատ պահպանում</Label>
              <p className="text-sm text-muted-foreground">
                Ավտոմատ պահպանել փոփոխությունները
              </p>
            </div>
            <Switch
              checked={accountSettings.autoSave}
              onCheckedChange={(value) => setAccountSettings(prev => ({ ...prev, autoSave: value }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Օֆլայն ռեժիմ</Label>
              <p className="text-sm text-muted-foreground">
                Աշխատել առանց ինտերնետի
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Շուտով</Badge>
              <Switch
                checked={accountSettings.offlineMode}
                onCheckedChange={(value) => setAccountSettings(prev => ({ ...prev, offlineMode: value }))}
                disabled
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Բարձր արտադրողականություն</Label>
              <p className="text-sm text-muted-foreground">
                Օպտիմիզացնել արագության համար
              </p>
            </div>
            <Switch
              checked={accountSettings.highPerformanceMode}
              onCheckedChange={(value) => setAccountSettings(prev => ({ ...prev, highPerformanceMode: value }))}
            />
          </div>
          
          <Button onClick={handleOptimizePerformance} variant="outline" className="w-full">
            <Zap className="w-4 h-4 mr-2" />
            Օպտիմիզացնել արտադրողականությունը
          </Button>
        </CardContent>
      </Card>

      {/* Beta Features */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Փորձնական հնարավորություններ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-armenian">Բետա ֆունկցիաներ</Label>
              <p className="text-sm text-muted-foreground">
                Փորձել նոր ֆունկցիաներ մինչ պաշտոնական թողարկումը
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Փորձնական</Badge>
              <Switch
                checked={accountSettings.betaFeatures}
                onCheckedChange={(value) => setAccountSettings(prev => ({ ...prev, betaFeatures: value }))}
              />
            </div>
          </div>
          
          {accountSettings.betaFeatures && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Բետա ֆունկցիաները կարող են անկայուն լինել։ Օգտագործեք ձեր պատասխանատվությամբ։
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Storage & Cache */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Պահեստ և քեշ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleClearCache} variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              Մաքրել քեշը
            </Button>
            
            <Button onClick={handleResetSettings} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Վերականգնել կարգավորումները
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Քեշի չափ՝ ~2.5 ՄԲ</p>
            <p>• Վերջին մաքրում՝ 3 օր առաջ</p>
            <p>• Օֆլայն տվյալներ՝ 12 ՄԲ</p>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Հաշվի տեղեկություններ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Հաշվի տիպ:</span>
              <span className="ml-2 font-semibold">Դասախոս</span>
            </div>
            <div>
              <span className="text-muted-foreground">Գրանցման ամսաթիվ:</span>
              <span className="ml-2">Մարտ 15, 2024</span>
            </div>
            <div>
              <span className="text-muted-foreground">Վերջին մուտք:</span>
              <span className="ml-2">Այսօր, 14:30</span>
            </div>
            <div>
              <span className="text-muted-foreground">Հաշվի ID:</span>
              <span className="ml-2 font-mono text-xs">usr_123456</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
