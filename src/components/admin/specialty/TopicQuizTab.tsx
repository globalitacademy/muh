import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AIGenerateButton from './AIGenerateButton';

interface TopicQuizFormData {
  quiz_questions: string;
  title?: string;
}

interface TopicQuizTabProps {
  formData: TopicQuizFormData;
  onFormDataChange: (updates: Partial<TopicQuizFormData>) => void;
}

const TopicQuizTab = ({ formData, onFormDataChange }: TopicQuizTabProps) => {
  const handleAIGenerate = (data: any) => {
    if (data.questions) {
      onFormDataChange({ quiz_questions: JSON.stringify(data, null, 2) });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="quiz_questions" className="font-armenian">Վիկտորինայի հարցեր (JSON ֆորմատով)</Label>
          <AIGenerateButton
            topicTitle={formData.title || ''}
            type="quiz"
            onGenerated={handleAIGenerate}
          />
        </div>
        <Textarea
          id="quiz_questions"
          value={formData.quiz_questions}
          onChange={(e) => onFormDataChange({ quiz_questions: e.target.value })}
          rows={12}
          placeholder='{"questions": [{"question": "Հարց 1", "answers": ["Պատ. 1", "Պատ. 2"], "correct": 0}]}'
        />
      </div>
    </div>
  );
};

export default TopicQuizTab;
