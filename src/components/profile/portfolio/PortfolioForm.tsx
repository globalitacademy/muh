
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface PortfolioFormData {
  title: string;
  description: string;
  project_url: string;
  github_url: string;
  files_url: string;
  start_date: string;
  end_date: string;
  is_team_project: boolean;
  is_thesis_project: boolean;
  instructor_review: string;
  employer_review: string;
}

interface PortfolioFormProps {
  formData: PortfolioFormData;
  setFormData: (data: PortfolioFormData) => void;
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
  return (
    <Card className="p-4 border-dashed">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Ծրագրի անունը *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              placeholder="Սկսման ամսաթիվ"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
            <Input
              type="date"
              placeholder="Ավարտման ամսաթիվ"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
          </div>
        </div>

        <Textarea
          placeholder="Ծրագրի նկարագրությունը"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Ծրագրի URL"
            value={formData.project_url}
            onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
          />
          <Input
            placeholder="GitHub URL"
            value={formData.github_url}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
          />
          <Input
            placeholder="Ֆայլերի URL"
            value={formData.files_url}
            onChange={(e) => setFormData({ ...formData, files_url: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="team-project"
              checked={formData.is_team_project}
              onCheckedChange={(checked) => setFormData({ ...formData, is_team_project: checked })}
            />
            <Label htmlFor="team-project" className="text-sm font-armenian">
              Թիմային ծրագիր
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="thesis-project"
              checked={formData.is_thesis_project}
              onCheckedChange={(checked) => setFormData({ ...formData, is_thesis_project: checked })}
            />
            <Label htmlFor="thesis-project" className="text-sm font-armenian">
              Դիպլոմային աշխատանք
            </Label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isEditing ? 'Թարմացնել' : 'Ավելացնել'}
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Չեղարկել
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PortfolioForm;
