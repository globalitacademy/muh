
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TopicBasicInfoTabProps {
  formData: {
    title: string;
    title_en: string;
    title_ru: string;
    description: string;
    description_en: string;
    description_ru: string;
    video_url: string;
    duration_minutes: number;
    order_index: number;
    is_free: boolean;
  };
  onFormDataChange: (updates: Partial<typeof formData>) => void;
}

const TopicBasicInfoTab = ({ formData, onFormDataChange }: TopicBasicInfoTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title" className="font-armenian">Վերնագիր (հայերեն)</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onFormDataChange({ title: e.target.value })}
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="is_free"
            type="checkbox"
            checked={formData.is_free}
            onChange={(e) => onFormDataChange({ is_free: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="is_free" className="font-armenian">Անվճար թեմա</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration_minutes" className="font-armenian">Տևողություն (րոպե)</Label>
          <Input
            id="duration_minutes"
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => onFormDataChange({ duration_minutes: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="order_index" className="font-armenian">Հերթականություն</Label>
          <Input
            id="order_index"
            type="number"
            value={formData.order_index}
            onChange={(e) => onFormDataChange({ order_index: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="font-armenian">Նկարագրություն</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFormDataChange({ description: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="video_url" className="font-armenian">Վիդեո URL</Label>
        <Input
          id="video_url"
          value={formData.video_url}
          onChange={(e) => onFormDataChange({ video_url: e.target.value })}
          placeholder="https://..."
        />
      </div>
    </div>
  );
};

export default TopicBasicInfoTab;
