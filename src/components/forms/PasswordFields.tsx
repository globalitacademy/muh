
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordFieldsProps {
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  language: string;
}

const PasswordFields = ({ 
  password, 
  confirmPassword, 
  showPassword, 
  showConfirmPassword, 
  onChange, 
  onTogglePassword, 
  onToggleConfirmPassword, 
  language 
}: PasswordFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="password" className="font-armenian">
          {language === 'hy' ? 'Գաղտնաբառ' : language === 'ru' ? 'Пароль' : 'Password'}
        </Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={onChange}
            required
            className="pl-10 pr-10"
            placeholder={language === 'hy' ? 'Գաղտնաբառ' : language === 'ru' ? 'Пароль' : 'Password'}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="confirmPassword" className="font-armenian">
          {language === 'hy' ? 'Հաստատել գաղտնաբառը' : language === 'ru' ? 'Подтвердить пароль' : 'Confirm Password'}
        </Label>
        <div className="relative mt-1">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={onChange}
            required
            className="pl-10 pr-10"
            placeholder={language === 'hy' ? 'Հաստատել գաղտնաբառը' : language === 'ru' ? 'Подтвердить пароль' : 'Confirm Password'}
          />
          <button
            type="button"
            onClick={onToggleConfirmPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  );
};

export default PasswordFields;
