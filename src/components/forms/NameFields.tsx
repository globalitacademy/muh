
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';

interface NameFieldsProps {
  firstName: string;
  lastName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  language: string;
}

const NameFields = ({ firstName, lastName, onChange, language }: NameFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="firstName" className="font-armenian">
          {language === 'hy' ? 'Անուն' : language === 'ru' ? 'Имя' : 'First Name'}
        </Label>
        <div className="relative mt-1">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            id="firstName"
            name="firstName"
            type="text"
            value={firstName}
            onChange={onChange}
            required
            className="pl-10"
            placeholder={language === 'hy' ? 'Անուն' : language === 'ru' ? 'Имя' : 'First Name'}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="lastName" className="font-armenian">
          {language === 'hy' ? 'Ազգանուն' : language === 'ru' ? 'Фамилия' : 'Last Name'}
        </Label>
        <div className="relative mt-1">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            id="lastName"
            name="lastName"
            type="text"
            value={lastName}
            onChange={onChange}
            required
            className="pl-10"
            placeholder={language === 'hy' ? 'Ազգանուն' : language === 'ru' ? 'Фамилия' : 'Last Name'}
          />
        </div>
      </div>
    </div>
  );
};

export default NameFields;
