
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Phone, Mail, MapPin, Calendar, Briefcase, Save, X } from 'lucide-react';
import { UserProfile } from '@/hooks/useAdminUsers';
import EnhancedRichTextEditor from '@/components/ui/enhanced-rich-text-editor';

interface EditInstructorFormProps {
  instructor: UserProfile;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditInstructorForm: React.FC<EditInstructorFormProps> = ({
  instructor,
  onSuccess,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: instructor.name || '',
    email: instructor.email || '',
    phone: instructor.phone || '',
    bio: instructor.bio || '',
    organization: instructor.organization || '',
    department: instructor.department || '',
    personal_website: instructor.personal_website || '',
    linkedin_url: instructor.linkedin_url || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would typically call an API to update the instructor
      console.log('Updating instructor:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSuccess();
    } catch (error) {
      console.error('Error updating instructor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="font-armenian">
            <User className="w-4 h-4 mr-2" />
            Անձնական տվյալներ
          </TabsTrigger>
          <TabsTrigger value="professional" className="font-armenian">
            <Briefcase className="w-4 h-4 mr-2" />
            Մասնագիտական տվյալներ
          </TabsTrigger>
          <TabsTrigger value="bio" className="font-armenian">
            <Calendar className="w-4 h-4 mr-2" />
            Կենսագրություն
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-armenian">Անձնական տեղեկություններ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="font-armenian">Ամբողջական անուն</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Մուտքագրեք ամբողջական անունը"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="font-armenian">Էլ. փոստ</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Մուտքագրեք էլ. փոստի հասցեն"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="font-armenian">Հեռախոսահամար</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Մուտքագրեք հեռախոսահամարը"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-armenian">Մասնագիտական տեղեկություններ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organization" className="font-armenian">Կազմակերպություն</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    placeholder="Մուտքագրեք կազմակերպության անունը"
                  />
                </div>
                <div>
                  <Label htmlFor="department" className="font-armenian">Ստորաբաժանում</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="Մուտքագրեք ստորաբաժանումը"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="personal_website" className="font-armenian">Անձնական կայք</Label>
                  <Input
                    id="personal_website"
                    type="url"
                    value={formData.personal_website}
                    onChange={(e) => handleInputChange('personal_website', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin_url" className="font-armenian">LinkedIn պրոֆիլ</Label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-armenian">Կենսագրություն և փորձառություն</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="bio" className="font-armenian mb-2 block">Կենսագրություն</Label>
              <EnhancedRichTextEditor
                value={formData.bio}
                onChange={(value) => handleInputChange('bio', value)}
                placeholder="Գրեք դասախոսի մասին, նրա փորձառության, կրթության և նվաճումների մասին..."
                height={350}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="font-armenian"
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <Save className="w-4 h-4 mr-2" />
          Պահպանել փոփոխությունները
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="font-armenian"
        >
          <X className="w-4 h-4 mr-2" />
          Չեղարկել
        </Button>
      </div>
    </form>
  );
};

export default EditInstructorForm;
