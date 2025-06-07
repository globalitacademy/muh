
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Hash } from 'lucide-react';

interface GroupNumberFieldProps {
  groupNumber: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  language: string;
}

const GroupNumberField = ({ groupNumber, onChange, language }: GroupNumberFieldProps) => {
  return (
    <div>
      <Label htmlFor="groupNumber" className="font-armenian">
        {language === 'hy' ? 'Խմբի համար' : language === 'ru' ? 'Номер группы' : 'Group Number'}
      </Label>
      <div className="relative mt-1">
        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          id="groupNumber"
          name="groupNumber"
          type="text"
          value={groupNumber}
          onChange={onChange}
          required
          className="pl-10"
          placeholder={language === 'hy' ? 'Խմբի համար' : language === 'ru' ? 'Номер группы' : 'Group Number'}
        />
      </div>
    </div>
  );
};

export default GroupNumberField;
