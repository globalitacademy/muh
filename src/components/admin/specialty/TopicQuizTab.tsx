
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TopicQuizTabProps {
  formData: {
    quiz_questions: string;
  };
  onFormDataChange: (updates: Partial<typeof formData>) => void;
}

const TopicQuizTab = ({ formData, onFormDataChange }: TopicQuizTabProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="quiz_questions" className="font-armenian">Վիկտորինայի հարցեր (JSON ֆորմատով)</Label>
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
