
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useUserRole } from '@/hooks/useUserRole';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, LogOut, BookOpen, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { data: isAdmin } = useAdminRole();
  const { data: userRole } = useUserRole();
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useUserProfile();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button 
        onClick={() => navigate('/auth')}
        variant="outline" 
        className="font-armenian"
      >
        {t('user.login')}
      </Button>
    );
  }

  const getInitials = (name: string | null, email: string) => {
    if (name && name.trim()) {
      const names = name.trim().split(' ');
      if (names.length >= 2) {
        return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    return email.charAt(0).toUpperCase();
  };

  const displayName = profile?.name || user.user_metadata?.name || t('user.guest');
  const initials = getInitials(profile?.name || user.user_metadata?.name, user.email || 'U');

  // Add cache busting to avatar URL
  const getAvatarUrl = (url: string | null) => {
    if (!url) return undefined;
    const timestamp = Date.now();
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${timestamp}`;
  };

  // Force refresh avatar by using timestamp as key
  const avatarKey = profile?.avatar_url ? `${profile.avatar_url}-${Date.now()}` : 'no-avatar';

  console.log('UserMenu: Current profile data:', {
    profileId: profile?.id,
    avatarUrl: profile?.avatar_url,
    displayName,
    profileLoading
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8" key={avatarKey}>
            <AvatarImage 
              src={getAvatarUrl(profile?.avatar_url)}
              alt={displayName}
              onLoad={() => {
                console.log('UserMenu: Avatar loaded successfully with URL:', getAvatarUrl(profile?.avatar_url));
              }}
              onError={(e) => {
                console.error('UserMenu: Avatar load error for URL:', getAvatarUrl(profile?.avatar_url), e);
                // Force refetch profile data on avatar load error
                refetchProfile();
              }}
            />
            <AvatarFallback>
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {displayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/dashboard')} className="font-armenian">
          <User className="mr-2 h-4 w-4" />
          <span>{t('user.profile')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/my-courses')} className="font-armenian">
          <BookOpen className="mr-2 h-4 w-4" />
          <span>{t('user.courses')}</span>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem onClick={() => navigate('/admin')} className="font-armenian">
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('user.admin')}</span>
          </DropdownMenuItem>
        )}
        {userRole === 'partner' && (
          <DropdownMenuItem onClick={() => navigate('/partner')} className="font-armenian">
            <Settings className="mr-2 h-4 w-4" />
            <span>Գործընկեր վահանակ</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="font-armenian">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('user.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
