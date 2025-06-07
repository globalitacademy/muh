
import React from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettingsTab from '@/components/profile/ProfileSettingsTab';
import SecuritySettingsTab from '@/components/settings/SecuritySettingsTab';
import NotificationSettingsTab from '@/components/settings/NotificationSettingsTab';
import PrivacySettingsTab from '@/components/settings/PrivacySettingsTab';
import AccountSettingsTab from '@/components/settings/AccountSettingsTab';
import { Loader2, Settings, Shield, Bell, Eye, User } from 'lucide-react';

const Settings = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 font-armenian">Կարգավորումներ</h1>
            <p className="text-muted-foreground">
              Կառավարեք ձեր հաշվի կարգավորումները և նախընտրությունները
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden md:inline">Պրոֆիլ</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden md:inline">Անվտանգություն</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden md:inline">Ծանուցումներ</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="hidden md:inline">Գաղտնիություն</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">Հաշիվ</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileSettingsTab profile={profile} />
            </TabsContent>

            <TabsContent value="security">
              <SecuritySettingsTab user={user} />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSettingsTab profile={profile} />
            </TabsContent>

            <TabsContent value="privacy">
              <PrivacySettingsTab profile={profile} />
            </TabsContent>

            <TabsContent value="account">
              <AccountSettingsTab user={user} profile={profile} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
