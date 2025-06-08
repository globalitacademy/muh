
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, X, Calendar, Globe, Github, FileText, Image } from 'lucide-react';
import { PortfolioImageUpload } from './PortfolioImageUpload';

interface PortfolioFormProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditing
}) => {
  console.log('PortfolioForm: Rendering with formData:', formData);

  const handleImageChange = (url: string | null) => {
    console.log('PortfolioForm: Image changed to:', url);
    setFormData({ ...formData, image_url: url });
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="font-armenian">
          {isEditing ? 'Խմբագրել ծրագիրը' : 'Նոր ծրագիր ավելացնել'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Image */}
        <div>
          <Label htmlFor="image" className="flex items-center gap-2 mb-2">
            <Image className="w-4 h-4" />
            Ծրագրի նկար
          </Label>
          <PortfolioImageUpload
            currentImageUrl={formData.image_url}
            onImageChange={handleImageChange}
          />
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="title">Ծրագրի անուն*</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ծրագրի անունը"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Նկարագրություն</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ծրագրի մանրամասն նկարագրություն..."
              rows={4}
            />
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="project_url" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Ծրագրի հղում
            </Label>
            <Input
              id="project_url"
              value={formData.project_url}
              onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <Label htmlFor="github_url" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub հղում
            </Label>
            <Input
              id="github_url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/username/project"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="files_url" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Ֆայլերի հղում
          </Label>
          <Input
            id="files_url"
            value={formData.files_url}
            onChange={(e) => setFormData({ ...formData, files_url: e.target.value })}
            placeholder="Google Drive, Dropbox, և այլն"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start_date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Սկսման ամսաթիվ
            </Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="end_date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Ավարտի ամսաթիվ
            </Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
          </div>
        </div>

        {/* Project Type */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Թիմային ծրագիր</Label>
              <p className="text-sm text-muted-foreground">
                Այս ծրագիրը իրականացվել է թիմով
              </p>
            </div>
            <Switch
              checked={formData.is_team_project}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, is_team_project: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Դիպլոմային ծրագիր</Label>
              <p className="text-sm text-muted-foreground">
                Այս ծրագիրը դիպլոմային աշխատանք է
              </p>
            </div>
            <Switch
              checked={formData.is_thesis_project}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, is_thesis_project: checked })
              }
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            <X className="w-4 h-4 mr-2" />
            Չեղարկել
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting || !formData.title.trim()}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Պահպանվում է...' : 'Պահպանել'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioForm;
