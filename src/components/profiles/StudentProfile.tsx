import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProfile } from '@/hooks/useUserProfile';
import { 
  User, 
  BookOpen, 
  Award, 
  Briefcase, 
  MessageCircle, 
  Bell, 
  Settings,
  GraduationCap,
  FolderOpen,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Eye,
  EyeOff
} from 'lucide-react';
import PersonalInfoTab from '@/components/profile/PersonalInfoTab';
import AcademicProgressTab from '@/components/profile/AcademicProgressTab';
import PortfolioTab from '@/components/profile/PortfolioTab';
import CertificatesTab from '@/components/profile/CertificatesTab';
import JobsTab from '@/components/profile/JobsTab';
import MessagesTab from '@/components/profile/MessagesTab';
import ExamsTab from '@/components/profile/ExamsTab';
import ProfileSettingsTab from '@/components/profile/ProfileSettingsTab';
import SettingsTab from '@/components/settings/SettingsTab';

const StudentProfile = () => {
  const { data: profile, isLoading, error } = useUserProfile();
  const [activeTab, setActiveTab] = useState('overview');

  console.log('StudentProfile - Loading:', isLoading);
  console.log('StudentProfile - Profile data:', profile);
  console.log('StudentProfile - Error:', error);

  if (isLoading) {
    return <div className="animate-pulse">Բեռնվում է...</div>;
  }

  if (error) {
    console.error('StudentProfile - Error loading profile:', error);
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-4">Սխալ է տեղի ունեցել</h2>
        <p className="text-muted-foreground">Չհաջողվեց բեռնել պրոֆիլի տվյալները:</p>
        <p className="text-sm text-red-500 mt-2">{error?.message}</p>
      </div>
    );
  }

  if (!profile) {
    console.log('StudentProfile - No profile data available');
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-4">Պրոֆիլ չի գտնվել</h2>
        <p className="text-muted-foreground">Ձեր պրոֆիլի տվյալները հասանելի չեն:</p>
      </div>
    );
  }

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Ակտիվ</Badge>;
      case 'graduated':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Ավարտած</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Դադարեցված</Badge>;
      default:
        return <Badge variant="secondary">Անհայտ</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.name || 'Ուսանող'} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-primary" />
                )}
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 font-armenian">
                  {profile.name || 'Ուսանող'}
                </CardTitle>
                <CardDescription className="font-armenian">
                  {profile.field_of_study && (
                    <span className="block">{profile.field_of_study}</span>
                  )}
                  <span>Խումբ: {profile.group_number || 'Նշված չէ'}</span>
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(profile.status)}
                  {profile.is_visible_to_employers && (
                    <Badge variant="outline" className="text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      Տեսանելի գործատուներին
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {profile.personal_website && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.personal_website} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {profile.linkedin_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{profile.address}</span>
              </div>
            )}
            {profile.organization && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>{profile.organization}</span>
              </div>
            )}
          </div>
          {profile.bio && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm">{profile.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="overview" className="text-xs">
            <User className="w-4 h-4 mr-1" />
            Ընդհանուր
          </TabsTrigger>
          <TabsTrigger value="academic" className="text-xs">
            <BookOpen className="w-4 h-4 mr-1" />
            Ուսումնական
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="text-xs">
            <FolderOpen className="w-4 h-4 mr-1" />
            Պորտֆոլիո
          </TabsTrigger>
          <TabsTrigger value="certificates" className="text-xs">
            <Award className="w-4 h-4 mr-1" />
            Վկայականներ
          </TabsTrigger>
          <TabsTrigger value="jobs" className="text-xs">
            <Briefcase className="w-4 h-4 mr-1" />
            Աշխատանք
          </TabsTrigger>
          <TabsTrigger value="messages" className="text-xs">
            <MessageCircle className="w-4 h-4 mr-1" />
            Հաղորդագրություններ
          </TabsTrigger>
          <TabsTrigger value="exams" className="text-xs">
            <GraduationCap className="w-4 h-4 mr-1" />
            Քննություններ
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">
            <Settings className="w-4 h-4 mr-1" />
            Կարգավորումներ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PersonalInfoTab profile={profile} />
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <AcademicProgressTab />
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <PortfolioTab />
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <CertificatesTab />
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <JobsTab />
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <MessagesTab />
        </TabsContent>

        <TabsContent value="exams" className="space-y-6">
          <ExamsTab />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <ProfileSettingsTab profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentProfile;
