
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, MapPin, Calendar, Phone, Mail, Globe, Linkedin } from 'lucide-react';
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
  status: 'active' | 'graduated' | 'suspended' | 'blocked' | 'deleted' | null;
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
  onAvatarClick,
}) => {
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'graduated':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'deleted':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'Ակտիվ';
      case 'graduated':
        return 'Շրջանավարտ';
      case 'suspended':
        return 'Կասեցված';
      case 'blocked':
        return 'Արգելափակված';
      case 'deleted':
        return 'Ջնջված';
      default:
        return 'Անհայտ';
    }
  };

  const getRoleText = (role: string | null) => {
    switch (role) {
      case 'student':
        return 'Ուսանող';
      case 'instructor':
        return 'Դասախոս';
      case 'admin':
        return 'Ադմինիստրատոր';
      case 'employer':
        return 'Գործատու';
      default:
        return 'Օգտատեր';
    }
  };

  return (
    <Card className="modern-card overflow-hidden">
      <div className="relative">
        {/* Cover Photo */}
        <div 
          className="h-48 bg-gradient-to-br from-edu-blue to-edu-orange cursor-pointer relative group"
          onClick={onCoverPhotoClick}
          style={profile.cover_photo_url ? {
            backgroundImage: `url(${profile.cover_photo_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="sm" variant="secondary" className="gap-2">
              <Camera className="w-4 h-4" />
              Փոխել ծածկագիրը
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
            {/* Avatar */}
            <div className="relative z-10">
              <ProfileAvatar
                key={avatarKey}
                src={avatarUrl}
                alt={profile.name || 'Profile'}
                size="lg"
                onClick={onAvatarClick}
                showCamera={true}
              />
            </div>

            {/* Basic Info */}
            <div className="flex-1 md:mt-16">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold font-armenian mb-2">
                    {profile.name || 'Անանուն'}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={getStatusColor(profile.status)}>
                      {getStatusText(profile.status)}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {getRoleText(profile.role)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                {profile.organization && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.organization}</span>
                  </div>
                )}
                {profile.group_number && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Խումբ {profile.group_number}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.personal_website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <a 
                      href={profile.personal_website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Անձնական կայք
                    </a>
                  </div>
                )}
                {profile.linkedin_url && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    <a 
                      href={profile.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      LinkedIn
                    </a>
                  </div>
                )}
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="mt-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ProfileHeader;
