
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AvatarUpload from '@/components/ui/avatar-upload';
import CoverPhotoUpload from '@/components/ui/cover-photo-upload';

interface ProfileModalsProps {
  isAvatarModalOpen: boolean;
  isCoverModalOpen: boolean;
  avatarUrl: string | null;
  coverUrl: string | null;
  name: string;
  onAvatarModalChange: (open: boolean) => void;
  onCoverModalChange: (open: boolean) => void;
  onAvatarChange: (url: string | null) => void;
  onCoverPhotoChange: (url: string | null) => void;
}

const ProfileModals: React.FC<ProfileModalsProps> = ({
  isAvatarModalOpen,
  isCoverModalOpen,
  avatarUrl,
  coverUrl,
  name,
  onAvatarModalChange,
  onCoverModalChange,
  onAvatarChange,
  onCoverPhotoChange,
}) => {
  return (
    <>
      {/* Avatar Upload Modal */}
      <Dialog open={isAvatarModalOpen} onOpenChange={onAvatarModalChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-armenian">Նկարի փոփոխություն</DialogTitle>
          </DialogHeader>
          <AvatarUpload
            currentImageUrl={avatarUrl}
            onImageChange={onAvatarChange}
            userName={name}
          />
        </DialogContent>
      </Dialog>

      {/* Cover Photo Upload Modal */}
      <Dialog open={isCoverModalOpen} onOpenChange={onCoverModalChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-armenian">Ծածկագիր փոփոխություն</DialogTitle>
          </DialogHeader>
          <CoverPhotoUpload
            currentImageUrl={coverUrl}
            onImageChange={onCoverPhotoChange}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileModals;
