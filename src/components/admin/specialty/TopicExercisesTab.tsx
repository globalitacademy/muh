
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TopicExercisesTabProps {
  formData: {
    exercises: string;
    resources: string;
  };
  onFormDataChange: (updates: Partial<typeof formData>) => void;
}

const TopicExercisesTab = ({ formData, onFormDataChange }: TopicExercisesTabProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="exercises" className="font-armenian">Վարժություններ (JSON ֆորմատով)</Label>
        <Textarea
          id="exercises"
          value={formData.exercises}
          onChange={(e) => onFormDataChange({ exercises: e.target.value })}
          rows={10}
          placeholder='{"exercises": [{"title": "Վարժություն 1", "description": "..."}]}'
        />
      </div>
      <div>
        <Label htmlFor="resources" className="font-armenian">Ռեսուրսներ (JSON ֆորմատով)</Label>
        <Textarea
          id="resources"
          value={formData.resources}
          onChange={(e) => onFormDataChange({ resources: e.target.value })}
          rows={8}
          placeholder='{"resources": [{"title": "Ռեսուրս 1", "url": "https://..."}]}'
        />
      </div>
    </div>
  );
};

export default TopicExercisesTab;
