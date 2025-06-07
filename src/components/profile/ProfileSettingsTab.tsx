
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useUpdateProfile } from '@/hooks/useUserProfile';
import { Settings, Save, User, Bell, Globe, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileSettingsTabProps {
  profile: any;
}

const ProfileSettingsTab = ({ profile }: ProfileSettingsTabProps) => {
  const updateProfileMutation = useUpdateProfile();
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    address: profile?.address || '',
    field_of_study: profile?.field_of_study || '',
    personal_website: profile?.personal_website || '',
    linkedin_url: profile?.linkedin_url || '',
    language_preference: profile?.language_preference || 'hy',
    is_visible_to_employers: profile?.is_visible_to_employers || false,
  });

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync(formData);
      toast.success('Պրոֆիլը հաջողությամբ թարմացվեց');
    } catch (error) {
      toast.error('Սխալ է տեղի ունեցել');
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <User className="w-5 h-5" />
            Անձնական տվյալներ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Անուն</Label>
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

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Ուսումնական տվյալներ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

      {/* Contact & Social */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Կապի միջոցներ
          </CardTitle>
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

      {/* Privacy & Language */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Կարգավորումներ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="language">Լեզու</Label>
            <Select
              value={formData.language_preference}
              onValueChange={(value) => setFormData({ ...formData, language_preference: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hy">Հայերեն</SelectItem>
                <SelectItem value="ru">Ռուսերեն</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Տեսանելի գործատուներին
              </Label>
              <p className="text-sm text-muted-foreground">
                Թույլ տալ գործատուներին տեսնել ձեր պրոֆիլը
              </p>
            </div>
            <Switch
              checked={formData.is_visible_to_employers}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, is_visible_to_employers: checked })
              }
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
          {updateProfileMutation.isPending ? 'Պահպանվում է...' : 'Պահպանել'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettingsTab;
