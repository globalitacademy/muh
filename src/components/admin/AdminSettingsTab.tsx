
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Database, Mail, Shield, Bell, Globe, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const AdminSettingsTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Կրթական հարթակ',
    siteUrl: 'https://example.com',
    adminEmail: 'admin@example.com',
    allowRegistration: true,
    requireEmailVerification: true,
    enableNotifications: true,
    maintenanceMode: false,
    maxUsers: 1000,
    sessionTimeout: 30,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Կարգավորումները հաջողությամբ պահպանվել են');
    } catch (error) {
      toast.error('Կարգավորումների պահպանման սխալ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      siteName: 'Կրթական հարթակ',
      siteUrl: 'https://example.com',
      adminEmail: 'admin@example.com',
      allowRegistration: true,
      requireEmailVerification: true,
      enableNotifications: true,
      maintenanceMode: false,
      maxUsers: 1000,
      sessionTimeout: 30,
    });
    toast.success('Կարգավորումները վերակայվել են սկզբնական արժեքներին');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-armenian text-gradient">Համակարգի կարգավորումներ</h2>
              <p className="text-muted-foreground font-armenian">Կառավարեք հարթակի հիմնական կարգավորումները</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="font-armenian">
              <RefreshCw className="w-4 h-4 mr-2" />
              Վերակայել
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="font-armenian btn-modern">
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Պահպանում...' : 'Պահպանել'}
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="glass-card rounded-2xl p-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="general" className="font-armenian">
              <Globe className="w-4 h-4 mr-2" />
              Ընդհանուր
            </TabsTrigger>
            <TabsTrigger value="security" className="font-armenian">
              <Shield className="w-4 h-4 mr-2" />
              Անվտանգություն
            </TabsTrigger>
            <TabsTrigger value="notifications" className="font-armenian">
              <Bell className="w-4 h-4 mr-2" />
              Ծանուցումներ
            </TabsTrigger>
            <TabsTrigger value="database" className="font-armenian">
              <Database className="w-4 h-4 mr-2" />
              Տվյալների բազա
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="font-armenian flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Կայքի տեղեկություններ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName" className="font-armenian">Կայքի անվանում</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl" className="font-armenian">Կայքի հասցե</Label>
                    <Input
                      id="siteUrl"
                      value={settings.siteUrl}
                      onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail" className="font-armenian">Ադմինի էլ. հասցե</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => setSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                      className="bg-background/50"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="font-armenian flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Ընդհանուր կարգավորումներ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="font-armenian">Գրանցման թույլտվություն</Label>
                      <p className="text-sm text-muted-foreground">Թույլատրել նոր օգտատերերի գրանցումը</p>
                    </div>
                    <Switch
                      checked={settings.allowRegistration}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowRegistration: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="font-armenian">Տեխնիկական նկարներ</Label>
                      <p className="text-sm text-muted-foreground">Կայքը տեխնիկական աշխատանքների ռեժիմում է</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxUsers" className="font-armenian">Օգտատերերի առավելագույն քանակ</Label>
                    <Input
                      id="maxUsers"
                      type="number"
                      value={settings.maxUsers}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxUsers: parseInt(e.target.value) }))}
                      className="bg-background/50"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="font-armenian flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Անվտանգության կարգավորումներ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="font-armenian">Էլ. հասցեի հաստատում</Label>
                      <p className="text-sm text-muted-foreground">Պահանջել էլ. հասցեի հաստատում գրանցման ժամանակ</p>
                    </div>
                    <Switch
                      checked={settings.requireEmailVerification}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireEmailVerification: checked }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout" className="font-armenian">Սեսիայի ժամանակահատիկ (րոպե)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                      className="bg-background/50"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="font-armenian flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Ծանուցումների կարգավորումներ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-armenian">Ծանուցումներ</Label>
                    <p className="text-sm text-muted-foreground">Միացնել/անջատել համակարգի ծանուցումները</p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableNotifications: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="mt-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="font-armenian flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Տվյալների բազայի կարգավորումներ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-armenian">
                  Տվյալների բազայի կարգավորումները կառավարվում են Supabase-ի միջոցով։
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSettingsTab;
