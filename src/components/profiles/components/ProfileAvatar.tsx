
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Camera } from 'lucide-react';

interface ProfileAvatarProps {
  avatarUrl: string | null;
  name: string;
  onAvatarClick: () => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  avatarUrl,
  name,
  onAvatarClick
}) => {
  return (
    <div className="relative">
      <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={name} 
            className="w-24 h-24 rounded-full object-cover"
            onLoad={() => {
              console.log('ProfileAvatar: Avatar image loaded successfully');
            }}
            onError={(e) => {
              console.error('ProfileAvatar: Avatar image load error:', e);
            }}
          />
        ) : (
          <User className="w-12 h-12 text-primary" />
        )}
      </div>
      <Button 
        size="sm" 
        className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8"
        onClick={onAvatarClick}
      >
        <Camera className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default ProfileAvatar;
