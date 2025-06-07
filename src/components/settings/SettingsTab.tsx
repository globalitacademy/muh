
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, Bell, Eye, Settings, Download, Trash2 } from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import SecuritySettings from './SecuritySettings';
import NotificationSettings from './NotificationSettings';
import PrivacySettings from './PrivacySettings';
import AccountSettings from './AccountSettings';

const SettingsTab = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Կարգավորումներ
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="font-armenian">
            <User className="w-4 h-4 mr-2" />
            Պրոֆիլ
          </TabsTrigger>
          <TabsTrigger value="security" className="font-armenian">
            <Shield className="w-4 h-4 mr-2" />
            Անվտանգություն
          </TabsTrigger>
          <TabsTrigger value="notifications" className="font-armenian">
            <Bell className="w-4 h-4 mr-2" />
            Ծանուցումներ
          </TabsTrigger>
          <TabsTrigger value="privacy" className="font-armenian">
            <Eye className="w-4 h-4 mr-2" />
            Գաղտնիություն
          </TabsTrigger>
          <TabsTrigger value="account" className="font-armenian">
            <Settings className="w-4 h-4 mr-2" />
            Հաշիվ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <PrivacySettings />
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <AccountSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTab;
