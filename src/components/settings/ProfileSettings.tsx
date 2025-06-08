import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Save } from 'lucide-react';
import { useUserProfile, useUpdateProfile } from '@/hooks/useUserProfile';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const ProfileSettings = () => {
  const { data: profile, refetch: refetchProfile } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    address: profile?.address || '',
    department: profile?.department || '',
    organization: profile?.organization || '',
    field_of_study: profile?.field_of_study || '',
    personal_website: profile?.personal_website || '',
    linkedin_url: profile?.linkedin_url || '',
    avatar_url: profile?.avatar_url || null,
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        address: profile.address || '',
        department: profile.department || '',
        organization: profile.organization || '',
        field_of_study: profile.field_of_study || '',
        personal_website: profile.personal_website || '',
        linkedin_url: profile.linkedin_url || '',
        avatar_url: profile.avatar_url || null,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync(formData);
      toast.success('Պրոֆիլը հաջողությամբ թարմացվեց');
    } catch (error) {
      toast.error('Սխալ է տեղի ունեցել');
    }
  };

  const handleAvatarChange = async (url: string | null) => {
    console.log('ProfileSettings: Avatar changed to:', url);
    
    // Update local form data immediately for UI feedback
    setFormData(prev => ({ ...prev, avatar_url: url }));
    
    try {
      console.log('ProfileSettings: Starting database update for avatar');
      
      // Update the profile in the database
      await updateProfileMutation.mutateAsync({ avatar_url: url });
      
      console.log('ProfileSettings: Database update successful, invalidating cache');
      
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
        console.log('ProfileSettings: Performing delayed cache refresh');
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      }, 500);
      
      console.log('ProfileSettings: Avatar updated successfully in database and cache refreshed');
      toast.success('Նկարը հաջողությամբ թարմացվեց');
    } catch (error) {
      console.error('ProfileSettings: Error updating avatar:', error);
      // Revert local state on error
      setFormData(prev => ({ ...prev, avatar_url: profile?.avatar_url || null }));
      toast.error('Սխալ նկարը թարմացնելիս');
    }
  };

  // Add cache busting to avatar URL for display
  const getAvatarUrl = (url: string | null) => {
    if (!url) return null;
    const timestamp = Date.now();
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${timestamp}`;
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <User className="w-5 h-5" />
            Նկար
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarUpload
            currentAvatarUrl={getAvatarUrl(formData.avatar_url)}
            name={formData.name}
            onAvatarChange={handleAvatarChange}
            size="lg"
          />
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Անձնական տվյալներ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Անուն*</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ձեր անունը"
              />
            </div>
            <div>
              <Label htmlFor="phone">Հեռախոս</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+374XX XXXXXX"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Հասցե</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Ձեր հասցեն"
            />
          </div>
          
          <div>
            <Label htmlFor="bio">Կենսագրություն</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Պատմեք ձեր մասին..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Մասնագիտական տվյալներ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Բաժին</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Ձեր բաժինը"
              />
            </div>
            <div>
              <Label htmlFor="organization">Կազմակերպություն</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Ձեր կազմակերպությունը"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="field_of_study">Մասնագիտություն</Label>
            <Input
              id="field_of_study"
              value={formData.field_of_study}
              onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
              placeholder="Ձեր մասնագիտությունը"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Կապի միջոցներ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="personal_website">Անձնական կայք</Label>
            <Input
              id="personal_website"
              value={formData.personal_website}
              onChange={(e) => setFormData({ ...formData, personal_website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="linkedin_url">LinkedIn</Label>
            <Input
              id="linkedin_url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={updateProfileMutation.isPending}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {updateProfileMutation.isPending ? 'Պահպանվում է...' : 'Պահպանել փոփոխությունները'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
