
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  BookOpen, 
  FolderOpen,
  Award, 
  Briefcase, 
  MessageCircle, 
  GraduationCap,
  Settings
} from 'lucide-react';
import EnhancedPersonalInfoTab from '@/components/profile/EnhancedPersonalInfoTab';
import AcademicProgressTab from '@/components/profile/AcademicProgressTab';
import EnhancedPortfolioTab from '@/components/profile/EnhancedPortfolioTab';
import CertificatesTab from '@/components/profile/CertificatesTab';
import JobsTab from '@/components/profile/JobsTab';
import MessagesTab from '@/components/profile/MessagesTab';
import ExamsTab from '@/components/profile/ExamsTab';
import ProfileSettingsTab from '@/components/profile/ProfileSettingsTab';

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
  status: 'active' | 'graduated' | 'suspended' | null;
  field_of_study: string | null;
  personal_website: string | null;
  linkedin_url: string | null;
  is_visible_to_employers: boolean | null;
}

interface ProfileTabsProps {
  profile: UserProfile;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  profile,
  activeTab,
  onTabChange
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-1">
        <TabsTrigger value="overview" className="text-xs flex-col gap-1 h-16">
          <User className="w-4 h-4" />
          <span>Ընդհանուր</span>
        </TabsTrigger>
        <TabsTrigger value="academic" className="text-xs flex-col gap-1 h-16">
          <BookOpen className="w-4 h-4" />
          <span>Ուսումնական</span>
        </TabsTrigger>
        <TabsTrigger value="portfolio" className="text-xs flex-col gap-1 h-16">
          <FolderOpen className="w-4 h-4" />
          <span>Պորտֆոլիո</span>
        </TabsTrigger>
        <TabsTrigger value="certificates" className="text-xs flex-col gap-1 h-16">
          <Award className="w-4 h-4" />
          <span>Վկայականներ</span>
        </TabsTrigger>
        <TabsTrigger value="jobs" className="text-xs flex-col gap-1 h-16">
          <Briefcase className="w-4 h-4" />
          <span>Աշխատանք</span>
        </TabsTrigger>
        <TabsTrigger value="messages" className="text-xs flex-col gap-1 h-16">
          <MessageCircle className="w-4 h-4" />
          <span>Հաղորդագրություններ</span>
        </TabsTrigger>
        <TabsTrigger value="exams" className="text-xs flex-col gap-1 h-16">
          <GraduationCap className="w-4 h-4" />
          <span>Քննություններ</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="text-xs flex-col gap-1 h-16">
          <Settings className="w-4 h-4" />
          <span>Կարգավորումներ</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6 mt-6">
        <EnhancedPersonalInfoTab profile={profile} />
      </TabsContent>

      <TabsContent value="academic" className="space-y-6 mt-6">
        <AcademicProgressTab />
      </TabsContent>

      <TabsContent value="portfolio" className="space-y-6 mt-6">
        <EnhancedPortfolioTab />
      </TabsContent>

      <TabsContent value="certificates" className="space-y-6 mt-6">
        <CertificatesTab />
      </TabsContent>

      <TabsContent value="jobs" className="space-y-6 mt-6">
        <JobsTab />
      </TabsContent>

      <TabsContent value="messages" className="space-y-6 mt-6">
        <MessagesTab />
      </TabsContent>

      <TabsContent value="exams" className="space-y-6 mt-6">
        <ExamsTab />
      </TabsContent>

      <TabsContent value="settings" className="space-y-6 mt-6">
        <ProfileSettingsTab profile={profile} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
