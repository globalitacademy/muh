
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera,
  Edit,
  GraduationCap,
  BookOpen,
  Phone,
  MapPin,
  Briefcase,
  Globe,
  Linkedin,
  Eye
} from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

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

interface ProfileHeaderProps {
  profile: UserProfile;
  avatarUrl: string | null;
  avatarKey: string;
  onCoverPhotoClick: () => void;
  onAvatarClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  avatarUrl,
  avatarKey,
  onCoverPhotoClick,
  onAvatarClick
}) => {
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
    <div className="relative">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-t-lg relative overflow-hidden">
        {profile.cover_photo_url && (
          <img 
            src={profile.cover_photo_url} 
            alt="Ծածկագիր" 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30"
          onClick={onCoverPhotoClick}
        >
          <Camera className="w-4 h-4 mr-2" />
          Փոխել ծածկագիրը
        </Button>
      </div>
      
      {/* Profile Info */}
      <Card className="relative -mt-12 mx-4 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <ProfileAvatar
              key={avatarKey}
              avatarUrl={avatarUrl}
              name={profile.name || 'Ուսանող'}
              onAvatarClick={onAvatarClick}
            />
            
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
  );
};

export default ProfileHeader;
