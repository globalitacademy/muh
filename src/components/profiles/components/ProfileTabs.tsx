
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, BookOpen, Award, Briefcase, Settings, Target, MessageSquare, FileText } from 'lucide-react';
import EnhancedPersonalInfoTab from '@/components/profile/EnhancedPersonalInfoTab';
import AcademicProgressTab from '@/components/profile/AcademicProgressTab';
import CertificatesTab from '@/components/profile/CertificatesTab';
import JobsTab from '@/components/profile/JobsTab';
import ProfileSettingsTab from '@/components/profile/ProfileSettingsTab';
import EnhancedPortfolioTab from '@/components/profile/EnhancedPortfolioTab';
import MessagesTab from '@/components/profile/MessagesTab';
import ExamsTab from '@/components/profile/ExamsTab';

interface UserProfile {
  id: string;
  name: string | null;
  role: 'admin' | 'instructor' | 'student' | 'employer' | null;
  group_number: string | null;
  department: string | null;
  phone: string | null;
  bio: string | null;
  organization: string | null;
  avatar_url: string | null;
  cover_photo_url: string | null;
  birth_date: string | null;
  address: string | null;
  language_preference: 'hy' | 'ru' | 'en' | null;
  status: 'active' | 'graduated' | 'suspended' | 'blocked' | 'deleted' | null;
  field_of_study: string | null;
  personal_website: string | null;
  linkedin_url: string | null;
  is_visible_to_employers: boolean | null;
}

interface ProfileTabsProps {
  profile: UserProfile;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  profile,
  activeTab,
  onTabChange,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-muted/50 p-1 rounded-xl">
        <TabsTrigger 
          value="overview" 
          className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
        >
          <User className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Ընդհանուր</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="progress" 
          className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Առաջընթաց</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="portfolio" 
          className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
        >
          <Target className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Պորտֆոլիո</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="certificates" 
          className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
        >
          <Award className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Վկայագրեր</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="exams" 
          className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
        >
          <FileText className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Քննություններ</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="jobs" 
          className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
        >
          <Briefcase className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Աշխատանք</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="messages" 
          className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Հաղորդագրություններ</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="settings" 
          className="font-armenian data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
        >
          <Settings className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Կարգավորումներ</span>
        </TabsTrigger>
      </TabsList>

      <div className="min-h-[400px]">
        <TabsContent value="overview" className="mt-6">
          <EnhancedPersonalInfoTab profile={profile} />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <AcademicProgressTab />
        </TabsContent>

        <TabsContent value="portfolio" className="mt-6">
          <EnhancedPortfolioTab />
        </TabsContent>

        <TabsContent value="certificates" className="mt-6">
          <CertificatesTab />
        </TabsContent>

        <TabsContent value="exams" className="mt-6">
          <ExamsTab />
        </TabsContent>

        <TabsContent value="jobs" className="mt-6">
          <JobsTab />
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <MessagesTab />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <ProfileSettingsTab />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ProfileTabs;
