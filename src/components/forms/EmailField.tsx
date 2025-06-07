
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

interface EmailFieldProps {
  email: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  language: string;
}

const EmailField = ({ email, onChange, language }: EmailFieldProps) => {
  return (
    <div>
      <Label htmlFor="email" className="font-armenian">
        {language === 'hy' ? 'Էլ․ փոստ' : language === 'ru' ? 'Эл. почта' : 'Email'}
      </Label>
      <div className="relative mt-1">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={onChange}
          required
          className="pl-10"
          placeholder={language === 'hy' ? 'your@email.com' : language === 'ru' ? 'your@email.com' : 'your@email.com'}
        />
      </div>
    </div>
  );
};

export default EmailField;
