
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
  EyeOff,
  Camera,
  Edit
} from 'lucide-react';
import EnhancedPersonalInfoTab from '@/components/profile/EnhancedPersonalInfoTab';
import AcademicProgressTab from '@/components/profile/AcademicProgressTab';
import EnhancedPortfolioTab from '@/components/profile/EnhancedPortfolioTab';
import CertificatesTab from '@/components/profile/CertificatesTab';
import JobsTab from '@/components/profile/JobsTab';
import MessagesTab from '@/components/profile/MessagesTab';
import ExamsTab from '@/components/profile/ExamsTab';
import ProfileSettingsTab from '@/components/profile/ProfileSettingsTab';
import SettingsTab from '@/components/settings/SettingsTab';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const StudentProfile = () => {
  const { data: profile, isLoading, error } = useUserProfile();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

  console.log('StudentProfile - Loading:', isLoading);
  console.log('StudentProfile - Profile data:', profile);
  console.log('StudentProfile - Error:', error);

  if (isLoading) {
    return <div className="animate-pulse font-armenian">Բեռնվում է...</div>;
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

  const handleAvatarChange = (url: string | null) => {
    console.log('StudentProfile: Avatar changed to:', url);
    // The ProfileSettingsTab will handle the actual profile update
    setIsAvatarModalOpen(false);
  };

  const handleCoverPhotoClick = () => {
    console.log('StudentProfile: Cover photo clicked');
    setIsCoverModalOpen(true);
  };

  const handleAvatarClick = () => {
    console.log('StudentProfile: Avatar camera clicked');
    setIsAvatarModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Profile Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30"
            onClick={handleCoverPhotoClick}
          >
            <Camera className="w-4 h-4 mr-2" />
            Փոխել ծածկագիրը
          </Button>
        </div>
        
        {/* Profile Info */}
        <Card className="relative -mt-12 mx-4 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.name || 'Ուսանող'} 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-primary" />
                  )}
                </div>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8"
                  onClick={handleAvatarClick}
                >
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold font-armenian">
                        {profile.name || 'Ուսանող'}
                      </h1>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-1 text-muted-foreground">
                      {profile.field_of_study && (
                        <p className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          {profile.field_of_study}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Խումբ: {profile.group_number || 'Նշված չէ'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {getStatusBadge(profile.status)}
                      {profile.is_visible_to_employers && (
                        <Badge variant="outline" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          Տեսանելի գործատուներին
                        </Badge>
                      )}
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
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
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm">{profile.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avatar Upload Modal */}
      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-armenian">Նկարի փոփոխություն</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <AvatarUpload
              currentAvatarUrl={profile.avatar_url}
              name={profile.name || 'Ուսանող'}
              onAvatarChange={handleAvatarChange}
              size="lg"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Cover Photo Upload Modal */}
      <Dialog open={isCoverModalOpen} onOpenChange={setIsCoverModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-armenian">Ծածկագրի փոփոխություն</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Ծածկագրի ֆունկցիան շուտով կավելացվի
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
    </div>
  );
};

export default StudentProfile;
