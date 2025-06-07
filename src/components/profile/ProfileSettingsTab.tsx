
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateProfile } from '@/hooks/useUserProfile';
import { Settings, Save, User, Globe, Eye, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileSettingsTabProps {
  profile: any;
}

const ProfileSettingsTab = ({ profile }: ProfileSettingsTabProps) => {
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

  const updateProfileMutation = useUpdateProfile();
  const { toast } = useToast();

  const handleSave = () => {
    updateProfileMutation.mutate(formData, {
      onSuccess: () => {
        toast({
          title: "Պրոֆիլը թարմացվել է",
          description: "Ձեր փոփոխությունները պահպանվել են:",
        });
      },
      onError: (error) => {
        toast({
          title: "Սխալ",
          description: "Չհաջողվեց պահպանել փոփոխությունները:",
          variant: "destructive",
        });
      },
    });
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
            <div className="space-y-2">
              <Label htmlFor="name">Անուն Ազգանուն</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Մուտքագրեք ձեր անունը"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Հեռախոսահամար</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+374 XX XXX XXX"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="field_of_study">Մասնագիտություն/Ոլորտ</Label>
            <Input
              id="field_of_study"
              value={formData.field_of_study}
              onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
              placeholder="Ձեր ուսուցման ոլորտը"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Հասցե</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Ձեր հասցեն"
            />
          </div>
          
          <div className="space-y-2">
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

      {/* Online Presence */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Առցանց ներկայություն
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="personal_website">Անձնական կայք</Label>
            <Input
              id="personal_website"
              value={formData.personal_website}
              onChange={(e) => setFormData({ ...formData, personal_website: e.target.value })}
              placeholder="https://your-website.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn պրոֆիլ</Label>
            <Input
              id="linkedin_url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/your-profile"
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Գաղտնիություն և տեսանելիություն
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Տեսանելի գործատուներին</Label>
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

      {/* Language Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Լեզվական նախընտրություններ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="language">Ինտերֆեյսի լեզուն</Label>
            <Select 
              value={formData.language_preference} 
              onValueChange={(value) => setFormData({ ...formData, language_preference: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hy">Հայերեն</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={updateProfileMutation.isPending}
          className="min-w-32"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateProfileMutation.isPending ? 'Պահպանվում է...' : 'Պահպանել'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettingsTab;
