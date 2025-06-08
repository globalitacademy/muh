
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
import { useUserProfile } from '@/hooks/useUserProfile';
import { User, LogOut, BookOpen, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { data: isAdmin } = useAdminRole();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button 
        onClick={() => navigate('/auth')}
        variant="outline" 
        className="font-armenian"
      >
        Մուտք
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

  const displayName = profile?.name || user.user_metadata?.name || 'Օգտատեր';
  const initials = getInitials(profile?.name || user.user_metadata?.name, user.email || 'U');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={profile?.avatar_url || undefined}
              alt={displayName}
              onLoad={() => console.log('UserMenu: Avatar loaded successfully')}
              onError={() => console.log('UserMenu: Avatar load failed')}
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
          <span>Իմ պրոֆիլը</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/my-courses')} className="font-armenian">
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Իմ դասընթացները</span>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem onClick={() => navigate('/admin')} className="font-armenian">
            <Settings className="mr-2 h-4 w-4" />
            <span>Ադմին վահանակ</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="font-armenian">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Դուրս գալ</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
