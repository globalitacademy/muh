import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, BookOpen, Award, Briefcase, Settings, Target, MessageSquare, FileText, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
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

const tabItems = [
  { value: 'overview', label: 'Ընդհանուր', icon: User },
  { value: 'progress', label: 'Առաջընթաց', icon: BookOpen },
  { value: 'portfolio', label: 'Պորտֆոլիո', icon: Target },
  { value: 'certificates', label: 'Վկայագրեր', icon: Award },
  { value: 'exams', label: 'Քննություններ', icon: FileText },
  { value: 'jobs', label: 'Աշխատանք', icon: Briefcase },
  { value: 'messages', label: 'Հաղորդագրություններ', icon: MessageSquare },
  { value: 'settings', label: 'Կարգավորումներ', icon: Settings },
];

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  profile,
  activeTab,
  onTabChange,
}) => {
  const isMobile = useIsMobile();
  
  const activeTabItem = tabItems.find(item => item.value === activeTab);

  // Mobile Dropdown Component
  const MobileTabsDropdown = () => (
    <div className="w-full mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-14 font-armenian bg-gradient-to-r from-card/90 to-background/70 backdrop-blur-xl border border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 focus-ring"
          >
            <div className="flex items-center gap-4">
              {activeTabItem && <activeTabItem.icon className="w-5 h-5 text-edu-blue" />}
              <span className="text-base font-medium">{activeTabItem?.label || 'Ընտրել բաժին'}</span>
            </div>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[320px] bg-background/95 backdrop-blur-xl border border-border/30 shadow-2xl">
          {tabItems.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onClick={() => onTabChange(item.value)}
              className={`flex items-center gap-4 p-4 font-armenian cursor-pointer transition-all duration-300 focus-ring ${
                activeTab === item.value 
                  ? 'bg-gradient-to-r from-edu-blue/15 to-edu-purple/10 text-edu-blue border-l-4 border-edu-blue font-semibold' 
                  : 'hover:bg-accent/60 hover:text-accent-foreground'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.value ? 'text-edu-blue' : 'text-muted-foreground'}`} />
              <span className="text-sm">{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  // Tablet Scrollable Tabs Component
  const TabletScrollableTabs = () => (
    <div className="w-full mb-8 relative">
      {/* Enhanced scroll indicators */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
      
      <TabsList className="w-full h-16 bg-gradient-to-r from-card/80 via-background/60 to-card/80 backdrop-blur-xl border border-border/30 shadow-xl overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max gap-3 px-4 py-2">
          {tabItems.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="font-armenian data-[state=active]:bg-gradient-to-r data-[state=active]:from-edu-blue data-[state=active]:to-edu-purple data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105 rounded-xl transition-all duration-300 whitespace-nowrap min-w-fit px-5 py-3 hover:bg-accent/40 hover:scale-102 focus-ring border border-transparent data-[state=active]:border-white/20"
            >
              <item.icon className="w-4 h-4 mr-3" />
              <span className="text-sm font-medium">{item.label}</span>
            </TabsTrigger>
          ))}
        </div>
      </TabsList>
    </div>
  );

  // Desktop Full Grid Component
  const DesktopTabsGrid = () => (
    <div className="mb-10 relative">
      {/* Enhanced glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-card/60 via-background/40 to-card/60 backdrop-blur-xl rounded-3xl border border-border/30 shadow-2xl -m-3" />
      <div className="absolute inset-0 bg-gradient-to-br from-edu-blue/10 via-transparent to-edu-purple/10 rounded-3xl opacity-80 -m-3" />
      
      <TabsList className="relative z-10 grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 bg-transparent p-4 h-auto gap-4">
        {tabItems.map((item, index) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="font-armenian data-[state=active]:bg-gradient-to-r data-[state=active]:from-edu-blue data-[state=active]:to-edu-purple data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105 rounded-2xl transition-all duration-500 hover:scale-102 hover:shadow-lg group p-5 h-auto min-h-[100px] flex flex-col items-center justify-center border border-border/20 bg-background/70 backdrop-blur-sm hover:bg-accent/30 focus-ring data-[state=active]:border-white/30"
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <item.icon className="w-6 h-6 mb-3 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xs lg:text-sm text-center leading-tight font-medium">{item.label}</span>
            
            {/* Enhanced hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-edu-blue/0 to-edu-purple/0 group-hover:from-edu-blue/15 group-hover:to-edu-purple/15 rounded-2xl transition-all duration-300" />
          </TabsTrigger>
        ))}
      </TabsList>
      
      {/* Enhanced floating decorative elements */}
      <div className="absolute -top-3 -left-3 w-6 h-6 bg-gradient-to-r from-edu-blue to-edu-purple rounded-full opacity-50 animate-pulse" />
      <div className="absolute -bottom-3 -right-3 w-4 h-4 bg-gradient-to-r from-edu-orange to-edu-yellow rounded-full opacity-40 animate-bounce" />
      <div className="absolute top-1/2 -right-4 w-3 h-3 bg-gradient-to-r from-edu-light-blue to-edu-purple rounded-full opacity-60 animate-pulse animation-delay-2000" />
    </div>
  );

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-8">
      {/* Responsive Tab Navigation */}
      {isMobile ? (
        <MobileTabsDropdown />
      ) : window.innerWidth < 1024 ? (
        <TabletScrollableTabs />
      ) : (
        <DesktopTabsGrid />
      )}

      {/* Enhanced Tab Content with smooth transitions */}
      <div className="min-h-[500px] relative">
        {/* Content background with enhanced glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-card/40 via-background/30 to-card/40 backdrop-blur-sm rounded-3xl border border-border/20 shadow-xl opacity-70" />
        
        <div className="relative z-10 p-8 lg:p-10">
          <TabsContent value="overview" className="m-0 animate-fade-in">
            <EnhancedPersonalInfoTab profile={profile} />
          </TabsContent>

          <TabsContent value="progress" className="m-0 animate-fade-in">
            <AcademicProgressTab />
          </TabsContent>

          <TabsContent value="portfolio" className="m-0 animate-fade-in">
            <EnhancedPortfolioTab />
          </TabsContent>

          <TabsContent value="certificates" className="m-0 animate-fade-in">
            <CertificatesTab />
          </TabsContent>

          <TabsContent value="exams" className="m-0 animate-fade-in">
            <ExamsTab />
          </TabsContent>

          <TabsContent value="jobs" className="m-0 animate-fade-in">
            <JobsTab />
          </TabsContent>

          <TabsContent value="messages" className="m-0 animate-fade-in">
            <MessagesTab />
          </TabsContent>

          <TabsContent value="settings" className="m-0 animate-fade-in">
            <ProfileSettingsTab profile={profile} />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
};

export default ProfileTabs;
