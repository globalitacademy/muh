
import React, { useState } from 'react';
import { useUserProfile, useUpdateProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import ProfileModals from './components/ProfileModals';

const StudentProfile = () => {
  const { data: profile, isLoading, error, refetch: refetchProfile } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [forceRefreshKey, setForceRefreshKey] = useState(0);

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

  // Add cache busting to avatar URL
  const getAvatarUrl = (url: string | null) => {
    if (!url) return null;
    const timestamp = Date.now() + forceRefreshKey;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${timestamp}`;
  };

  // Create unique key for forcing re-render
  const avatarKey = `student-avatar-${forceRefreshKey}-${profile.avatar_url ? 'has-url' : 'no-url'}`;

  const handleAvatarChange = async (url: string | null) => {
    console.log('StudentProfile: Avatar changed to:', url);
    
    try {
      console.log('StudentProfile: Starting database update for avatar');
      
      // Force refresh the avatar display immediately
      setForceRefreshKey(prev => prev + 1);
      
      // Update the profile in the database
      await updateProfileMutation.mutateAsync({ avatar_url: url });
      
      console.log('StudentProfile: Database update successful, invalidating cache');
      
      // Force complete cache refresh with multiple strategies
      await Promise.all([
        // Invalidate all user profile queries
        queryClient.invalidateQueries({ queryKey: ['userProfile'] }),
        // Refetch the current profile data
        refetchProfile(),
        // Remove cached data to force fresh fetch
        queryClient.removeQueries({ queryKey: ['userProfile'] }),
      ]);
      
      // Small delay to ensure cache refresh, then force another invalidation
      setTimeout(() => {
        console.log('StudentProfile: Performing delayed cache refresh');
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        setForceRefreshKey(prev => prev + 1);
      }, 500);
      
      console.log('StudentProfile: Avatar updated successfully');
      toast.success('Նկարը հաջողությամբ թարմացվեց');
      setIsAvatarModalOpen(false);
    } catch (error) {
      console.error('StudentProfile: Error updating avatar:', error);
      toast.error('Սխալ նկարը թարմացնելիս');
    }
  };

  const handleCoverPhotoChange = async (url: string | null) => {
    console.log('StudentProfile: Cover photo changed to:', url);
    try {
      await updateProfileMutation.mutateAsync({ cover_photo_url: url });
      toast.success('Ծածկագիրը հաջողությամբ թարմացվեց');
      setIsCoverModalOpen(false);
    } catch (error) {
      console.error('StudentProfile: Error updating cover photo:', error);
      toast.error('Սխալ ծածկագիրը թարմացնելիս');
    }
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
      <ProfileHeader
        profile={profile}
        avatarUrl={getAvatarUrl(profile.avatar_url)}
        avatarKey={avatarKey}
        onCoverPhotoClick={handleCoverPhotoClick}
        onAvatarClick={handleAvatarClick}
      />

      <ProfileModals
        isAvatarModalOpen={isAvatarModalOpen}
        isCoverModalOpen={isCoverModalOpen}
        avatarUrl={getAvatarUrl(profile.avatar_url)}
        coverUrl={profile.cover_photo_url}
        name={profile.name || 'Ուսանող'}
        onAvatarModalChange={setIsAvatarModalOpen}
        onCoverModalChange={setIsCoverModalOpen}
        onAvatarChange={handleAvatarChange}
        onCoverPhotoChange={handleCoverPhotoChange}
      />

      <ProfileTabs
        profile={profile}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default StudentProfile;
