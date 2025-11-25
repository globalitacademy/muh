import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AIGenerateButton from './AIGenerateButton';

interface TopicExercisesFormData {
  exercises: string;
  resources: string;
  title?: string;
}

interface TopicExercisesTabProps {
  formData: TopicExercisesFormData;
  onFormDataChange: (updates: Partial<TopicExercisesFormData>) => void;
}

const TopicExercisesTab = ({ formData, onFormDataChange }: TopicExercisesTabProps) => {
  const handleAIGenerateExercises = (data: any) => {
    if (data.exercises) {
      onFormDataChange({ exercises: JSON.stringify(data, null, 2) });
    }
  };

  const handleAIGenerateResources = (data: any) => {
    if (data.resources) {
      onFormDataChange({ resources: JSON.stringify(data, null, 2) });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="exercises" className="font-armenian">Վարժություններ (JSON ֆորմատով)</Label>
          <AIGenerateButton
            topicTitle={formData.title || ''}
            type="exercises"
            onGenerated={handleAIGenerateExercises}
          />
        </div>
        <Textarea
          id="exercises"
          value={formData.exercises}
          onChange={(e) => onFormDataChange({ exercises: e.target.value })}
          rows={10}
          placeholder='{"exercises": [{"title": "Վարժություն 1", "description": "..."}]}'
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="resources" className="font-armenian">Ռեսուրսներ (JSON ֆորմատով)</Label>
          <AIGenerateButton
            topicTitle={formData.title || ''}
            type="resources"
            onGenerated={handleAIGenerateResources}
          />
        </div>
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
